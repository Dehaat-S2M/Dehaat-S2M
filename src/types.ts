export type AssetStatus = 'Available' | 'Assigned' | 'Under Maintenance' | 'Lost' | 'Damaged' | 'Retired';

export type UserRole = 'Super Admin' | 'Asset Manager' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Asset {
  id: string;
  assetTag: string; // unique, e.g. "AST-2024-001"
  name: string;
  categoryId: string;
  categoryName?: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchaseCost: number;
  warrantyExpiry: string;
  vendorId: string;
  vendorName?: string;
  locationId: string;
  locationName?: string;
  departmentId: string;
  departmentName?: string;
  status: AssetStatus;
  assignedEmployeeId?: string | null;
  assignedEmployeeName?: string | null;
  assignedEmployeeEmail?: string | null;
  assignedDate?: string | null;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  employeeId: string; // e.g. "EMP-1001"
  fullName: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName?: string;
  jobTitle: string;
  locationId: string;
  locationName?: string;
  joiningDate: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  iconName?: string;
  description?: string;
  color?: string;
  assetCount?: number;
  createdAt: string;
}

export interface Location {
  id: string;
  name: string;
  building?: string;
  floor?: string;
  room?: string;
  address?: string;
  contactPerson?: string;
  assetCount?: number;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName?: string;
  managerName?: string;
  budget?: number;
  employeeCount?: number;
  assetCount?: number;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson?: string;
  contactEmail?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  notes?: string;
  assetCount?: number;
  createdAt: string;
}

export interface AssetAssignment {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  employeeId: string;
  employeeName: string;
  assignedDate: string;
  expectedReturnDate?: string;
  returnedDate?: string | null;
  assignedByUserId: string;
  assignedByUserName: string;
  returnCondition?: 'Excellent' | 'Good' | 'Fair' | 'Damaged' | 'Defective' | null;
  assignmentNotes?: string;
  returnNotes?: string;
  status: 'Active' | 'Returned';
  createdAt: string;
}

export interface AssetHistory {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'Created' | 'Updated' | 'Assigned' | 'Returned' | 'Transferred' | 'Status Changed' | 'Maintenance' | 'Retired' | 'Deleted';
  fieldChanged?: string;
  previousValue?: string;
  newValue?: string;
  notes?: string;
}

export interface OrganizationSettings {
  organizationName: string;
  organizationLogoUrl?: string;
  address?: string;
  email?: string;
  phone?: string;
  defaultCurrency: string;
  currencySymbol: string;
  dateFormat: string;
  timeZone?: string;
  assetTagPrefix?: string;
}

export interface DashboardStats {
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  maintenanceAssets: number;
  retiredAssets: number;
  lostAssets: number;
  damagedAssets: number;
  totalEmployees: number;
  totalAssetValue: number;
  assetsByCategory: { name: string; count: number; value: number }[];
  assetsByLocation: { name: string; count: number }[];
  assetsByDepartment: { name: string; count: number }[];
  assetsByStatus: { name: string; count: number; color: string }[];
  recentActivity: AssetHistory[];
  expiringWarranties: Asset[];
}
