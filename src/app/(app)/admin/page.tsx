"use client";

import { useState, useEffect } from "react";
import { Folder, Search, Plus, Edit2, Trash2, Link as LinkIcon, AlertCircle, FileText, MapPin, Users, Building2, UserSquare2, Globe } from "lucide-react";
import { SearchResource } from "@/lib/types";
import { fetchResources, deleteResource, fetchDocuments, deleteDocument, fetchAddresses, deleteAddress, fetchLinks, deleteLink, fetchEmployees, deleteEmployee } from "@/lib/search";
import AdminFolderModal from "@/components/admin/AdminFolderModal";
import AdminDocumentModal from "@/components/admin/AdminDocumentModal";
import AdminAddressModal from "@/components/admin/AdminAddressModal";
import AdminLinkModal from "@/components/admin/AdminLinkModal";
import AdminEmployeeModal from "@/components/admin/AdminEmployeeModal";
import AdminUserModal from "@/components/admin/AdminUserModal";
import { fetchUsers, deleteUser } from "@/lib/users";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";

type AdminTab = "address" | "google-drive" | "documents" | "links" | "employee" | "users" | "requests";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("address");
  
  // Data State
  const [folders, setFolders] = useState<SearchResource[]>([]);
  const [documents, setDocuments] = useState<SearchResource[]>([]);
  const [addresses, setAddresses] = useState<SearchResource[]>([]);
  const [links, setLinks] = useState<SearchResource[]>([]);
  const [employees, setEmployees] = useState<SearchResource[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals & Deleting
  const [activeModal, setActiveModal] = useState<AdminTab | null>(null);
  const [editingResource, setEditingResource] = useState<SearchResource | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [foldersData, docsData, addrData, linksData, empData, usersData] = await Promise.all([
        fetchResources(),
        fetchDocuments(),
        fetchAddresses(),
        fetchLinks(),
        fetchEmployees(),
        fetchUsers()
      ]);
      setFolders(foldersData.filter(r => r.type === "google-drive" || r.category === "Google Drive"));
      setDocuments(docsData);
      setAddresses(addrData);
      setLinks(linksData);
      setEmployees(empData);
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleDelete = async (id: string, type: AdminTab) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    setDeletingId(id);
    try {
      if (type === "google-drive") await deleteResource(id);
      if (type === "documents") await deleteDocument(id);
      if (type === "address") await deleteAddress(id);
      if (type === "links") await deleteLink(id);
      if (type === "employee") await deleteEmployee(id);
      if (type === "users") await deleteUser(id);
      await loadData();
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
      alert(`Failed to delete the ${type}.`);
    } finally {
      setDeletingId(null);
    }
  };

  const openModal = (type: AdminTab, resource?: SearchResource | User) => {
    setEditingResource(resource as any || null);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingResource(null);
  };

  const onSaved = () => {
    closeModal();
    loadData();
  };

  // Filter Active Data
  const getActiveData = () => {
    switch (activeTab) {
      case "google-drive": return folders;
      case "documents": return documents;
      case "address": return addresses;
      case "links": return links;
      case "employee": return employees;
      case "users": return users as unknown as SearchResource[]; // Cast for shared rendering
      default: return [];
    }
  };

  const filteredData = getActiveData().filter(r => {
    const term = searchQuery.toLowerCase();
    const asUser = r as unknown as User;
    if (activeTab === "users") {
      return (
        asUser.username.toLowerCase().includes(term) ||
        asUser.name.toLowerCase().includes(term) ||
        asUser.role.toLowerCase().includes(term)
      );
    }
    
    return (
      r.title.toLowerCase().includes(term) ||
      r.keywords?.some(k => k.toLowerCase().includes(term)) ||
      (r.description && r.description.toLowerCase().includes(term)) ||
      (r.category && r.category.toLowerCase().includes(term)) ||
      (r.address && r.address.toLowerCase().includes(term)) ||
      (r.city && r.city.toLowerCase().includes(term))
    );
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage search resources securely.</p>
        </div>
        <button
          onClick={() => openModal(activeTab)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add New {activeTab === "google-drive" ? "Folder" : activeTab === "address" ? "Address" : activeTab === "links" ? "Link" : activeTab === "employee" ? "Employee" : activeTab === "users" ? "User" : "Document"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6 overflow-x-auto">
        {(["address", "google-drive", "documents", "links", "employee", "users", "requests"] as AdminTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => { 
              if (tab === "requests") {
                router.push("/requests");
              } else {
                setActiveTab(tab); 
                setSearchQuery("");
              }
            }}
            className={`flex items-center justify-center gap-2 min-w-32 py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab 
                ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-sm" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {tab === "google-drive" && <Folder className="w-4 h-4" />}
            {tab === "documents" && <FileText className="w-4 h-4" />}
            {tab === "address" && <MapPin className="w-4 h-4" />}
            {tab === "links" && <LinkIcon className="w-4 h-4" />}
            {tab === "employee" && <Users className="w-4 h-4" />}
            {tab === "users" && <Users className="w-4 h-4 text-orange-500" />}
            {tab === "requests" && <FileText className="w-4 h-4 text-indigo-500" />}
            <span className="capitalize">{tab.replace('-', ' ')}</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab.replace('-', ' ')}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            {filteredData.length} item{filteredData.length !== 1 && 's'} found
          </div>
        </div>

        {/* List */}
        <div className="p-0 overflow-y-auto flex-1 bg-slate-50/30 dark:bg-slate-950/30">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center px-4">
                  <AlertCircle className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-700" />
                  <p className="text-lg font-medium text-slate-900 dark:text-white">No items found</p>
                </div>
              ) : (
                filteredData.map((resource) => (
                  <li key={resource.id} className="p-6 hover:bg-white dark:hover:bg-slate-900 transition-colors group">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            {activeTab === "google-drive" && <Folder className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                            {activeTab === "documents" && <FileText className="w-5 h-5 text-amber-500 flex-shrink-0" />}
                            {activeTab === "address" && <Building2 className="w-5 h-5 text-red-500 flex-shrink-0" />}
                            {activeTab === "links" && <Globe className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                            {activeTab === "employee" && <UserSquare2 className="w-5 h-5 text-purple-500 flex-shrink-0" />}
                            {activeTab === "users" && <Users className="w-5 h-5 text-orange-500 flex-shrink-0" />}
                            <span className="truncate">{activeTab === "users" ? (resource as unknown as User).name : resource.title}</span>
                          </h3>
                          
                          {/* Mobile Actions */}
                          <div className="flex lg:hidden items-center gap-2">
                            <button onClick={() => openModal(activeTab, resource)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(resource.id, activeTab)} disabled={deletingId === resource.id} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Description / Content Based on Tab */}
                        {activeTab === "address" && (
                          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                            {resource.city && <p><span className="font-medium text-slate-900 dark:text-white">City:</span> {resource.city}, {resource.state}</p>}
                            {resource.gstin && <p><span className="font-medium text-slate-900 dark:text-white">GSTIN:</span> <span className="font-mono">{resource.gstin}</span></p>}
                            <p className="line-clamp-2">{resource.address}</p>
                          </div>
                        )}
                        
                        {activeTab === "employee" && (
                          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                            <p><span className="font-medium text-slate-900 dark:text-white">Role:</span> {resource.designation}</p>
                            {resource.linkedinUrl && (
                              <a href={resource.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 hover:underline">
                                <Globe className="w-3.5 h-3.5" /> LinkedIn Profile
                              </a>
                            )}
                          </div>
                        )}

                        {activeTab === "links" && (
                          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                            <p className="line-clamp-2">{resource.description}</p>
                            {resource.websiteLink && (
                              <a href={resource.websiteLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 hover:underline break-all">
                                <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" /> {resource.websiteLink}
                              </a>
                            )}
                          </div>
                        )}

                        {(activeTab === "documents" || activeTab === "google-drive") && (
                          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                            {resource.category && <span className="font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs mr-2">{resource.category}</span>}
                            {resource.description && <p className="line-clamp-2 mt-1">{resource.description}</p>}
                            
                            {(resource.googleDriveLink || resource.documentLink) && (
                              <a href={resource.googleDriveLink || resource.documentLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 hover:underline break-all mt-1">
                                <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" /> {resource.googleDriveLink || resource.documentLink}
                              </a>
                            )}
                          </div>
                        )}

                        {activeTab === "users" && (
                          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                            <p><span className="font-medium text-slate-900 dark:text-white">Username:</span> {(resource as unknown as User).username}</p>
                            <p><span className="font-medium text-slate-900 dark:text-white">Role:</span> {(resource as unknown as User).role}</p>
                            <p><span className="font-medium text-slate-900 dark:text-white">Status:</span> {(resource as unknown as User).isActive ? <span className="text-emerald-600 font-medium">Active</span> : <span className="text-red-600 font-medium">Inactive</span>}</p>
                          </div>
                        )}

                        {activeTab !== "users" && (
                          <div className="pt-2">
                            <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Keywords</p>
                            <div className="flex flex-wrap gap-1.5">
                              {resource.keywords?.map((kw, i) => (
                                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/50">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Desktop Actions */}
                      <div className="hidden lg:flex flex-col justify-start gap-2 flex-shrink-0 w-40 border-l border-slate-100 dark:border-slate-800 pl-6">
                        <button onClick={() => openModal(activeTab, resource)} className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-left">
                          <Edit2 className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => handleDelete(resource.id, activeTab)} disabled={deletingId === resource.id} className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg text-left">
                          <Trash2 className="w-4 h-4" /> {deletingId === resource.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      {activeModal === "google-drive" && <AdminFolderModal resource={editingResource} onClose={closeModal} onSaved={onSaved} />}
      {activeModal === "documents" && <AdminDocumentModal resource={editingResource} onClose={closeModal} onSaved={onSaved} />}
      {activeModal === "address" && <AdminAddressModal resource={editingResource} onClose={closeModal} onSaved={onSaved} />}
      {activeModal === "links" && <AdminLinkModal resource={editingResource} onClose={closeModal} onSaved={onSaved} />}
      {activeModal === "employee" && <AdminEmployeeModal resource={editingResource} onClose={closeModal} onSaved={onSaved} />}
      {activeModal === "users" && <AdminUserModal user={editingResource as unknown as User} onClose={closeModal} onSaved={onSaved} />}
    </div>
  );
}
