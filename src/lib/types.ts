export type ResourceCategory = "Address" | "Google Drive" | "Documents" | "Links" | "Employee";

export interface SearchResource {
  id: string;
  type?: "google-drive" | "document" | "address" | "link" | "employee";
  title: string;
  keywords: string[];
  category: ResourceCategory;
  description: string;
  city?: string;
  state?: string;
  tags: string[];
  googleDriveLink?: string;
  websiteLink?: string;
  documentLink?: string;
  googleMapsLink?: string;
  language?: string;
  address?: string;
  gstin?: string;
  phone?: string;
  email?: string;
  previewImage?: string;
  thumbnail?: string;
  provider?: string;
  year?: string;
  organization?: string;
  designation?: string;
  linkedinUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "Admin" | "Marketing User" | "Requester";

export interface User {
  id: string;
  username: string;
  passwordHash?: string; // we won't send this to client, but it exists in DB
  role: UserRole;
  name: string;
  isActive: boolean;
}

export type RequestStatus = "New" | "Accepted" | "In Progress" | "Need More Information" | "Under Review" | "Completed" | "Cancelled";

export interface RequestHistoryEntry {
  action: string;
  changedBy: string;
  date: string;
}

export interface CreativeRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requestType: string;
  title: string;
  description: string;
  dueDate: string;
  content: string;
  additionalInformation?: string;
  attachments?: string[];
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  history: RequestHistoryEntry[];
}
