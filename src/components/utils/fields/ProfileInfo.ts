export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  dateUploaded: string;
  status: 'verified' | 'pending' | 'rejected';
  url: string;
}

export interface AgencyProfile {
  agencyName: string;
  logoUrl: string;
  slogan: string;
  description: string;
  gstin: string;
  dateJoined: string;
  phone: string;
  email: string;
  physicalAddress: string;
  website: string;
  socials: SocialLinks;
  documents: Document[];
  kycStatus: 'Approved' | 'Pending' | 'Rejected';
  profileCompletion: number;
}