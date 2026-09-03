"use client";

import { SearchResource } from "@/lib/types";
import { Folder, MapPin, ExternalLink, Share2, Heart, Copy, Check, Video, Image as ImageIcon, FileText, Building, Link as LinkIcon, Users, ShieldCheck, Calendar, HardDrive, Building2, Globe, Fingerprint, Mailbox, Map, UserSquare2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ResultCardProps {
  resource: SearchResource;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Address": return MapPin;
    case "Links": return LinkIcon;
    case "Employee": return Users;
    case "Images": return ImageIcon;
    case "Videos": return Video;
    case "Documents": return FileText;
    case "Google Drive": return HardDrive;
    case "HR": return Users;
    case "Marketing": return Building;
    case "Policies": return ShieldCheck;
    case "Events": return Calendar;
    default: return Folder;
  }
};

export function ResultCard({ resource }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const Icon = getCategoryIcon(resource.category);

  const handleCopy = (textToCopy: string) => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPrimaryLink = () => resource.googleDriveLink || resource.documentLink || resource.websiteLink || resource.googleMapsLink || resource.linkedinUrl;

  // --- ADDRESS CARD RENDERING ---
  if (resource.type === "address") {
    const googleMapsUrl = resource.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resource.address || "")}`;
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-blue-500 transition-colors"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Building2 className="w-5 h-5 text-blue-500 shrink-0" />
              <span className="font-medium">City:</span>
              <span className="text-slate-600 dark:text-slate-300">{resource.city}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <MapPin className="w-5 h-5 text-red-500 shrink-0" />
              <span className="font-medium">State:</span>
              <span className="text-slate-600 dark:text-slate-300">{resource.state}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Globe className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="font-medium">Language:</span>
              <span className="text-slate-600 dark:text-slate-300">{resource.language}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Fingerprint className="w-5 h-5 text-purple-500 shrink-0" />
              <span className="font-medium">GSTIN:</span>
              <span className="text-slate-600 dark:text-slate-300 font-mono">{resource.gstin}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-900 dark:text-white">
              <Mailbox className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <span className="font-medium">Address:</span>
              <span className="text-slate-600 dark:text-slate-300 flex-1">{resource.address}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <a 
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg text-sm font-medium transition-colors"
          >
            <Map className="w-4 h-4" />
            Open in Google Maps
          </a>
          <button 
            onClick={() => handleCopy(resource.address || "")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            Copy Address
          </button>
          <button 
            onClick={() => handleCopy(resource.gstin || "")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            Copy GSTIN
          </button>
        </div>
      </motion.div>
    );
  }

  // --- LINK CARD RENDERING ---
  if (resource.type === "link") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-blue-500 transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <LinkIcon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <a href={resource.websiteLink} target="_blank" rel="noopener noreferrer" className="block hover:underline">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white truncate">{resource.title}</h3>
            </a>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{resource.description}</p>
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <a 
                href={resource.websiteLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Visit Website <ArrowRight className="w-4 h-4" />
              </a>
              <button 
                onClick={() => handleCopy(resource.websiteLink || "")}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- EMPLOYEE CARD RENDERING ---
  if (resource.type === "employee") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-blue-500 transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
            <UserSquare2 className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white truncate">{resource.title}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 truncate">{resource.designation}</p>
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center">
              {resource.linkedinUrl ? (
                <a 
                  href={resource.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  LinkedIn Profile
                </a>
              ) : (
                <span className="text-sm text-slate-400">No LinkedIn profile available</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- STANDARD CARD RENDERING (Google Drive, Documents) ---
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col sm:flex-row bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all"
    >
      {resource.thumbnail && (
        <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-slate-100 dark:bg-slate-800 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800">
          <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white line-clamp-2">
              {resource.title}
            </h3>
            <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Icon className="w-3.5 h-3.5" />
              {resource.category}
            </span>
          </div>
          
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
            {resource.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
            {resource.city && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {resource.city}{resource.state ? `, ${resource.state}` : ''}
              </div>
            )}
            {resource.organization && (
              <div className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-slate-400" />
                {resource.organization}
              </div>
            )}
            {resource.year && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {resource.year}
              </div>
            )}
            {resource.provider && (
              <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <HardDrive className="w-4 h-4 text-blue-500" />
                {resource.provider}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {new Date(resource.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {resource.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-auto">
          {getPrimaryLink() && (
            <a 
              href={getPrimaryLink()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-500/20"
            >
              Open <ExternalLink className="w-4 h-4" />
            </a>
          )}
          
          <button 
            onClick={() => handleCopy(getPrimaryLink() || "")}
            title="Copy Link"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => setFavorite(!favorite)}
            title="Favorite"
            className={cn(
              "p-2 rounded-lg transition-colors",
              favorite 
                ? "text-red-500 bg-red-50 dark:bg-red-500/10" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800"
            )}
          >
            <Heart className={cn("w-5 h-5", favorite && "fill-current")} />
          </button>
          
          <button 
            title="Share"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors ml-auto"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

