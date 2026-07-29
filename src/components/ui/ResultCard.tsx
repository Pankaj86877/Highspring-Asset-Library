"use client";

import { SearchResource } from "@/lib/types";
import { Folder, MapPin, ExternalLink, Share2, Heart, Copy, Check, Video, Image as ImageIcon, FileText, Building, Link as LinkIcon, Users, ShieldCheck, Calendar, HardDrive } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ResultCardProps {
  resource: SearchResource;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Addresses": return MapPin;
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

  const handleCopy = () => {
    const link = resource.googleDriveLink || resource.websiteLink || resource.googleMapsLink || "";
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPrimaryLink = () => resource.googleDriveLink || resource.websiteLink || resource.googleMapsLink;

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
            {resource.city && resource.state && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {resource.city}, {resource.state}
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
            onClick={handleCopy}
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
