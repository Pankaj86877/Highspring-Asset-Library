export type ResourceCategory = 
  | "All"
  | "Addresses"
  | "Images"
  | "Videos"
  | "Documents"
  | "Google Drive"
  | "HR"
  | "Marketing"
  | "Policies"
  | "Contacts"
  | "Events"
  | "Links";

export interface SearchResource {
  id: string;
  title: string;
  keywords: string[];
  category: ResourceCategory;
  description: string;
  city?: string;
  state?: string;
  tags: string[];
  googleDriveLink?: string;
  websiteLink?: string;
  googleMapsLink?: string;
  address?: string;
  phone?: string;
  email?: string;
  previewImage?: string;
  thumbnail?: string;
  provider?: string;
  createdAt: string;
  updatedAt: string;
}
