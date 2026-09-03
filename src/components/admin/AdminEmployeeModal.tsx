"use client";

import { useState, useEffect } from "react";
import { X, Save, Loader2, AlertCircle } from "lucide-react";
import { SearchResource } from "@/lib/types";
import { addEmployee, updateEmployee } from "@/lib/search";

interface AdminEmployeeModalProps {
  resource: SearchResource | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function AdminEmployeeModal({ resource, onClose, onSaved }: AdminEmployeeModalProps) {
  const isEditing = !!resource;
  
  const [title, setTitle] = useState(resource?.title || "");
  const [designation, setDesignation] = useState(resource?.designation || "");
  const [linkedinUrl, setLinkedinUrl] = useState(resource?.linkedinUrl || "");
  
  // Keywords state
  const [keywords, setKeywords] = useState<string[]>(resource?.keywords || []);
  const [keywordInput, setKeywordInput] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleAddKeyword = (e?: React.KeyboardEvent | React.FocusEvent) => {
    if (e && 'key' in e && e.key !== 'Enter' && e.key !== ',') return;
    if (e) e.preventDefault();
    
    const terms = keywordInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);
      
    if (terms.length > 0) {
      const newKeywords = [...keywords];
      let added = false;
      terms.forEach(term => {
        if (!newKeywords.includes(term)) {
          newKeywords.push(term);
          added = true;
        }
      });
      
      if (added) {
        setKeywords(newKeywords);
      }
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (indexToRemove: number) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (keywordInput.trim()) {
      handleAddKeyword();
    }
    
    if (!title.trim() || !designation.trim()) {
      setError("Employee Name and Designation are required.");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Automatically generate implicit keywords based on requirements
      const nameParts = title.trim().toLowerCase().split(' ');
      const desigParts = designation.trim().toLowerCase().split(' ');
      
      let allKeywords = new Set<string>([
        ...keywords,
        title.trim().toLowerCase(),
        designation.trim().toLowerCase(),
        ...nameParts,
        ...desigParts
      ]);
      
      const finalKeywords = Array.from(allKeywords);

      if (isEditing && resource) {
        await updateEmployee(resource.id, {
          title: title.trim(),
          designation: designation.trim(),
          linkedinUrl: linkedinUrl.trim(),
          keywords: finalKeywords,
        });
      } else {
        const newResource: SearchResource = {
          id: `employee-${Date.now()}`,
          type: "employee",
          title: title.trim(),
          category: "Employee",
          description: designation.trim(),
          designation: designation.trim(),
          linkedinUrl: linkedinUrl.trim(),
          keywords: finalKeywords,
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await addEmployee(newResource);
      }
      onSaved();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save the employee.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-950 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-950/95 z-10 backdrop-blur">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Employee Name <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. John Smith"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="designation" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                id="designation"
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior UX/UI Designer"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="linkedinUrl" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                LinkedIn URL or ID
              </label>
              <input
                id="linkedinUrl"
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="e.g. johnsmith or https://linkedin.com/in/johnsmith"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
              />
              <p className="mt-1 text-xs text-slate-500">If you just enter an ID (e.g., johnsmith), it will be automatically converted to a valid URL.</p>
            </div>

            <div>
              <label htmlFor="keywords" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Additional Keywords
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Type a keyword and press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">Enter</kbd> or comma to add. 
              </p>
              
              <div className="w-full min-h-[42px] px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                {keywords.map((kw, index) => (
                  <span 
                    key={index} 
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50 rounded-md text-sm font-medium"
                  >
                    {kw}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveKeyword(index)}
                      className="text-amber-400 hover:text-amber-800 dark:hover:text-amber-100 focus:outline-none"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <input
                  id="keywords"
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                  onBlur={handleAddKeyword}
                  placeholder={keywords.length === 0 ? "e.g. designer, UX, UI..." : "Add more..."}
                  className="flex-1 min-w-[120px] bg-transparent text-sm focus:outline-none dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEditing ? "Save Changes" : "Save Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
