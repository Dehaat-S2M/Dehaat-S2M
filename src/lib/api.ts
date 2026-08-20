import type {
  Asset,
  Employee,
  Category,
  Location,
  Department,
  Vendor,
  AssetHistory,
  AssetAssignment,
  OrganizationSettings,
  User,
  DashboardStats
} from '../types';

const BASE_URL = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  });

  if (!res.ok) {
    let errorMsg = `Request failed with status ${res.status}`;
    try {
      const errData = await res.json();
      if (errData.error) errorMsg = errData.error;
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Auth & Current User
  getMe: () => fetchJSON<{ user: User; availableUsers: User[] }>('/auth/me'),
  getCurrentUser: async () => {
    const res = await fetchJSON<{ user: User; availableUsers: User[] }>('/auth/me');
    return res.user;
  },
  getUsers: async () => {
    const res = await fetchJSON<{ user: User; availableUsers: User[] }>('/auth/me');
    return res.availableUsers;
  },
  switchUser: (userId: string) => fetchJSON<{ success: boolean; user: User }>('/auth/switch-user', {
    method: 'POST',
    body: JSON.stringify({ userId })
  }),
  setActiveUser: async (userId: string) => {
    const res = await fetchJSON<{ success: boolean; user: User }>('/auth/switch-user', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
    return res.user;
  },

  // Dashboard
  getDashboardStats: () => fetchJSON<DashboardStats>('/dashboard/stats'),

  // Assets
  getAssets: (params?: {
    search?: string;
    categoryId?: string;
    locationId?: string;
    departmentId?: string;
    status?: string;
    assignedEmployeeId?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.categoryId) query.append('categoryId', params.categoryId);
    if (params?.locationId) query.append('locationId', params.locationId);
    if (params?.departmentId) query.append('departmentId', params.departmentId);
    if (params?.status) query.append('status', params.status);
    if (params?.assignedEmployeeId) query.append('assignedEmployeeId', params.assignedEmployeeId);
    const qs = query.toString();
    return fetchJSON<Asset[]>(`/assets${qs ? `?${qs}` : ''}`);
  },

  getAssetById: (id: string) =>
    fetchJSON<Asset & { history: AssetHistory[]; activeAssignment?: AssetAssignment }>(`/assets/${id}`),
  getAsset: (id: string) =>
    fetchJSON<Asset & { history: AssetHistory[]; activeAssignment?: AssetAssignment }>(`/assets/${id}`),

  createAsset: (data: Partial<Asset>) =>
    fetchJSON<Asset>('/assets', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateAsset: (id: string, data: Partial<Asset>) =>
    fetchJSON<Asset>(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteAsset: (id: string) =>
    fetchJSON<{ success: boolean; message: string }>(`/assets/${id}`, {
      method: 'DELETE'
    }),

  assignAsset: (assetId: string, payload: {
    employeeId: string;
    assignedDate?: string;
    notes?: string;
    expectedReturnDate?: string;
  }) =>
    fetchJSON<{ success: boolean; asset: Asset }>(`/assets/${assetId}/assign`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  returnAsset: (assetId: string, payload: {
    returnCondition: 'Excellent' | 'Good' | 'Fair' | 'Damaged' | 'Defective';
    returnDate?: string;
    notes?: string;
  }) =>
    fetchJSON<{ success: boolean; asset: Asset }>(`/assets/${assetId}/return`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  bulkImportAssets: (assets: Partial<Asset>[]) =>
    fetchJSON<{ success: boolean; count: number; imported: Asset[]; errors: string[] }>('/assets/bulk-import', {
      method: 'POST',
      body: JSON.stringify({ assets })
    }),
  importAssets: (assets: Partial<Asset>[]) =>
    fetchJSON<{ success: boolean; count: number; imported: Asset[]; errors: string[] }>('/assets/bulk-import', {
      method: 'POST',
      body: JSON.stringify({ assets })
    }),

  // Employees
  getEmployees: () => fetchJSON<Employee[]>('/employees'),
  getEmployeeById: (id: string) =>
    fetchJSON<Employee & { assignedAssets: Asset[]; pastAssignments: AssetAssignment[] }>(`/employees/${id}`),
  getEmployee: (id: string) =>
    fetchJSON<Employee & { assignedAssets: Asset[]; pastAssignments: AssetAssignment[] }>(`/employees/${id}`),
  createEmployee: (data: Partial<Employee>) =>
    fetchJSON<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateEmployee: (id: string, data: Partial<Employee>) =>
    fetchJSON<Employee>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteEmployee: (id: string) =>
    fetchJSON<{ success: boolean }>(`/employees/${id}`, {
      method: 'DELETE'
    }),

  // Categories
  getCategories: () => fetchJSON<Category[]>('/categories'),
  createCategory: (data: Partial<Category>) =>
    fetchJSON<Category>('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: Partial<Category>) =>
    fetchJSON<Category>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) =>
    fetchJSON<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' }),

  // Locations
  getLocations: () => fetchJSON<Location[]>('/locations'),
  createLocation: (data: Partial<Location>) =>
    fetchJSON<Location>('/locations', { method: 'POST', body: JSON.stringify(data) }),
  updateLocation: (id: string, data: Partial<Location>) =>
    fetchJSON<Location>(`/locations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLocation: (id: string) =>
    fetchJSON<{ success: boolean }>(`/locations/${id}`, { method: 'DELETE' }),

  // Departments
  getDepartments: () => fetchJSON<Department[]>('/departments'),
  createDepartment: (data: Partial<Department>) =>
    fetchJSON<Department>('/departments', { method: 'POST', body: JSON.stringify(data) }),
  updateDepartment: (id: string, data: Partial<Department>) =>
    fetchJSON<Department>(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDepartment: (id: string) =>
    fetchJSON<{ success: boolean }>(`/departments/${id}`, { method: 'DELETE' }),

  // Vendors
  getVendors: () => fetchJSON<Vendor[]>('/vendors'),
  createVendor: (data: Partial<Vendor>) =>
    fetchJSON<Vendor>('/vendors', { method: 'POST', body: JSON.stringify(data) }),
  updateVendor: (id: string, data: Partial<Vendor>) =>
    fetchJSON<Vendor>(`/vendors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVendor: (id: string) =>
    fetchJSON<{ success: boolean }>(`/vendors/${id}`, { method: 'DELETE' }),

  // History & Assignments
  getHistory: (params?: { assetId?: string; userId?: string; action?: string }) => {
    const query = new URLSearchParams();
    if (params?.assetId) query.append('assetId', params.assetId);
    if (params?.userId) query.append('userId', params.userId);
    if (params?.action) query.append('action', params.action);
    const qs = query.toString();
    return fetchJSON<AssetHistory[]>(`/history${qs ? `?${qs}` : ''}`);
  },
  getAssignments: () => fetchJSON<AssetAssignment[]>('/assignments'),

  // Settings
  getSettings: () => fetchJSON<OrganizationSettings>('/settings'),
  updateSettings: (data: Partial<OrganizationSettings>) =>
    fetchJSON<OrganizationSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // System
  resetDemoDatabase: () =>
    fetchJSON<{ success: boolean; message: string }>('/system/reset-demo', { method: 'POST' }),
  resetDatabase: () =>
    fetchJSON<{ success: boolean; message: string }>('/system/reset-demo', { method: 'POST' }),
  restoreDatabase: (data: any) =>
    fetchJSON<{ success: boolean; message: string }>('/system/restore', {
      method: 'POST',
      body: JSON.stringify(data)
    })
};
