export interface Organization {
  id: string;
  name: string; // "Otago Community Hospice"
  slug: string; // "otago-hospice" (for URLs)
  location: string; // "Dunedin"
  region: string; // "Otago"
  description?: string;
  contactEmail: string;
  website?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Need {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'meals' | 'companionship' | 'other';
  location: string; // Specific address/area
  timeSlots: { start: Date; end: Date }[];
  status: 'open' | 'claimed' | 'completed' | 'cancelled';
  organizationId: string;
  requesterId: string;
  volunteerId?: string;
  createdAt: Date;
  claimedAt?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'requester' | 'volunteer' | 'org_admin' | 'platform_admin';
  organizationId?: string; // For requesters/org_admins
  preferredLocations?: string[]; // For volunteers
}

export type NeedCategory = Need['category'];
export type NeedStatus = Need['status'];
export type UserRole = User['role'];