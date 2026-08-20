import fs from 'fs';
import path from 'path';
import type {
  Asset,
  Employee,
  Category,
  Location,
  Department,
  Vendor,
  AssetAssignment,
  AssetHistory,
  OrganizationSettings,
  User,
  DashboardStats
} from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'assethub-db.json');

export interface DatabaseSchema {
  users: User[];
  categories: Category[];
  locations: Location[];
  departments: Department[];
  vendors: Vendor[];
  employees: Employee[];
  assets: Asset[];
  assignments: AssetAssignment[];
  history: AssetHistory[];
  settings: OrganizationSettings;
}

// Initial realistic seed data
const initialUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@assethub.internal',
    role: 'Super Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-2',
    name: 'Marcus Vance',
    email: 'marcus.vance@assethub.internal',
    role: 'Asset Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-3',
    name: 'Elena Rostova',
    email: 'elena.rostova@assethub.internal',
    role: 'Viewer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Laptop', iconName: 'Laptop', description: 'Portable workstations and ultrabooks', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'cat-2', name: 'Desktop', iconName: 'Monitor', description: 'Stationary PCs and high-performance workstations', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'cat-3', name: 'Monitor', iconName: 'Tv', description: '4K, Curved, and Ultrawide displays', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'cat-4', name: 'Mobile Phone', iconName: 'Smartphone', description: 'Company issued smartphones and eSIM devices', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'cat-5', name: 'Tablet', iconName: 'Tablet', description: 'Design pads and field tablets', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'cat-6', name: 'Network Equipment', iconName: 'Server', description: 'Switches, routers, firewalls, and access points', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'cat-7', name: 'Printer & Scanner', iconName: 'Printer', description: 'Office multifunctional printers and barcode scanners', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'cat-8', name: 'Peripherals & Audio', iconName: 'Headphones', description: 'Headsets, mechanical keyboards, mice, and docks', createdAt: '2024-01-10T08:00:00Z' }
];

const initialLocations: Location[] = [
  { id: 'loc-1', name: 'HQ - San Francisco', building: 'Building Alpha', floor: '4th Floor', room: 'Suite 400 - IT Lab', address: '500 Howard St, San Francisco, CA', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'loc-2', name: 'HQ - Engineering Wing', building: 'Building Alpha', floor: '3rd Floor', room: 'Open Workspace 3B', address: '500 Howard St, San Francisco, CA', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'loc-3', name: 'New York Regional Hub', building: 'Empire Tower', floor: '12th Floor', room: 'Room 1204', address: '350 5th Ave, New York, NY', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'loc-4', name: 'London Tech Center', building: 'Canary Wharf', floor: '8th Floor', room: 'Server Room B', address: '25 Bank St, London, UK', createdAt: '2024-01-10T08:00:00Z' }
];

const initialDepartments: Department[] = [
  { id: 'dep-1', name: 'Information Technology', code: 'IT', headName: 'Sarah Jenkins', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'dep-2', name: 'Engineering & Product', code: 'ENG', headName: 'Alex Chen', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'dep-3', name: 'Design & Creative', code: 'DES', headName: 'Maya Lin', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'dep-4', name: 'Finance & Accounting', code: 'FIN', headName: 'Robert Martinez', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'dep-5', name: 'People & HR', code: 'HR', headName: 'Clara Oswald', createdAt: '2024-01-10T08:00:00Z' }
];

const initialVendors: Vendor[] = [
  { id: 'ven-1', name: 'Apple Enterprise Direct', contactPerson: 'David Miller', email: 'enterprise-sales@apple.com', phone: '+1 (800) 692-7753', address: '1 Apple Park Way, Cupertino, CA', website: 'https://apple.com/business', notes: 'Primary supplier for macOS hardware and iPads', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'ven-2', name: 'Dell Premier Solutions', contactPerson: 'Karen Brody', email: 'sales@dell.com', phone: '+1 (800) 456-3355', address: '1 Dell Way, Round Rock, TX', website: 'https://dell.com', notes: 'Supplier for XPS laptops, Precision towers, and UltraSharp monitors', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'ven-3', name: 'CDW Corporate Direct', contactPerson: 'Thomas Wright', email: 'twright@cdw.com', phone: '+1 (847) 465-6000', address: '200 N Milwaukee Ave, Vernon Hills, IL', website: 'https://cdw.com', notes: 'General IT hardware, Cisco switches, and peripherals', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'ven-4', name: 'Lenovo Enterprise Partner', contactPerson: 'Rachel Kim', email: 'rachel.kim@lenovopartner.com', phone: '+1 (855) 253-6686', address: '1009 Think Place, Morrisville, NC', website: 'https://lenovo.com', notes: 'ThinkPad laptops and ThinkCentre tiny desktops', createdAt: '2024-01-10T08:00:00Z' }
];

const initialEmployees: Employee[] = [
  { id: 'emp-1', employeeId: 'EMP-1001', fullName: 'Alexander Chen', email: 'alex.chen@assethub.com', phone: '+1 (415) 555-0142', departmentId: 'dep-2', jobTitle: 'Principal Software Architect', locationId: 'loc-2', joiningDate: '2022-03-15', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', createdAt: '2022-03-15T09:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'emp-2', employeeId: 'EMP-1002', fullName: 'Maya Lin', email: 'maya.lin@assethub.com', phone: '+1 (415) 555-0188', departmentId: 'dep-3', jobTitle: 'Lead UX/UI Designer', locationId: 'loc-2', joiningDate: '2022-06-01', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', createdAt: '2022-06-01T09:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'emp-3', employeeId: 'EMP-1003', fullName: 'Marcus Vance', email: 'marcus.vance@assethub.com', phone: '+1 (415) 555-0199', departmentId: 'dep-1', jobTitle: 'Senior IT Asset Administrator', locationId: 'loc-1', joiningDate: '2021-08-10', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', createdAt: '2021-08-10T09:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'emp-4', employeeId: 'EMP-1004', fullName: 'Clara Oswald', email: 'clara.oswald@assethub.com', phone: '+1 (212) 555-0133', departmentId: 'dep-5', jobTitle: 'People Operations Manager', locationId: 'loc-3', joiningDate: '2023-01-09', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', createdAt: '2023-01-09T09:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'emp-5', employeeId: 'EMP-1005', fullName: 'Robert Martinez', email: 'robert.martinez@assethub.com', phone: '+1 (212) 555-0167', departmentId: 'dep-4', jobTitle: 'Financial Controller', locationId: 'loc-3', joiningDate: '2021-11-20', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', createdAt: '2021-11-20T09:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'emp-6', employeeId: 'EMP-1006', fullName: 'Sophia Nakamura', email: 'sophia.nakamura@assethub.com', phone: '+44 20 7946 0912', departmentId: 'dep-2', jobTitle: 'Senior DevOps Engineer', locationId: 'loc-4', joiningDate: '2023-04-18', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', createdAt: '2023-04-18T09:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'emp-7', employeeId: 'EMP-1007', fullName: 'David Sterling', email: 'david.sterling@assethub.com', phone: '+1 (415) 555-0111', departmentId: 'dep-2', jobTitle: 'Full-Stack Developer', locationId: 'loc-2', joiningDate: '2023-09-01', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', createdAt: '2023-09-01T09:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'emp-8', employeeId: 'EMP-1008', fullName: 'Zoe Washington', email: 'zoe.washington@assethub.com', phone: '+1 (415) 555-0149', departmentId: 'dep-3', jobTitle: 'Brand Designer & Illustrator', locationId: 'loc-2', joiningDate: '2023-10-15', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80', createdAt: '2023-10-15T09:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'emp-9', employeeId: 'EMP-1009', fullName: 'Lucas Gallagher', email: 'lucas.gallagher@assethub.com', phone: '+1 (212) 555-0177', departmentId: 'dep-4', jobTitle: 'Financial Analyst', locationId: 'loc-3', joiningDate: '2024-02-01', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', createdAt: '2024-02-01T09:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  { id: 'emp-10', employeeId: 'EMP-1010', fullName: 'Hannah Schmidt', email: 'hannah.schmidt@assethub.com', phone: '+44 20 7946 0999', departmentId: 'dep-1', jobTitle: 'IT Support Specialist', locationId: 'loc-4', joiningDate: '2024-01-05', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', createdAt: '2024-01-05T09:00:00Z', updatedAt: '2024-01-05T10:00:00Z' }
];

const initialAssets: Asset[] = [
  {
    id: 'ast-1',
    assetTag: 'AST-2024-001',
    name: 'MacBook Pro 16" M3 Max (64GB / 1TB)',
    categoryId: 'cat-1',
    brand: 'Apple',
    model: 'MacBook Pro M3 Max 16-inch Space Black',
    serialNumber: 'C02G8721MD6T',
    purchaseDate: '2024-01-15',
    purchaseCost: 3899.00,
    warrantyExpiry: '2027-01-15',
    vendorId: 'ven-1',
    locationId: 'loc-2',
    departmentId: 'dep-2',
    status: 'Assigned',
    assignedEmployeeId: 'emp-1',
    assignedDate: '2024-01-18',
    notes: 'Primary developer machine with AppleCare+ for Enterprise',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z'
  },
  {
    id: 'ast-2',
    assetTag: 'AST-2024-002',
    name: 'MacBook Pro 14" M3 Pro (36GB / 512GB)',
    categoryId: 'cat-1',
    brand: 'Apple',
    model: 'MacBook Pro M3 Pro 14-inch Silver',
    serialNumber: 'C02H1189MD7L',
    purchaseDate: '2024-01-15',
    purchaseCost: 2399.00,
    warrantyExpiry: '2027-01-15',
    vendorId: 'ven-1',
    locationId: 'loc-2',
    departmentId: 'dep-3',
    status: 'Assigned',
    assignedEmployeeId: 'emp-2',
    assignedDate: '2024-01-19',
    notes: 'Equipped with Figma Design enterprise profile',
    imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format&fit=crop&q=80',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-19T09:15:00Z'
  },
  {
    id: 'ast-3',
    assetTag: 'AST-2024-003',
    name: 'Dell XPS 15 9530 (i9-13900H / 32GB)',
    categoryId: 'cat-1',
    brand: 'Dell',
    model: 'XPS 15 9530 OLED Touch',
    serialNumber: '8FK912L01',
    purchaseDate: '2023-11-10',
    purchaseCost: 2499.00,
    warrantyExpiry: '2026-11-10',
    vendorId: 'ven-2',
    locationId: 'loc-3',
    departmentId: 'dep-4',
    status: 'Assigned',
    assignedEmployeeId: 'emp-5',
    assignedDate: '2023-11-20',
    notes: 'Finance workstation with Windows 11 Enterprise BitLocker',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80',
    createdAt: '2023-11-10T11:00:00Z',
    updatedAt: '2023-11-20T16:00:00Z'
  },
  {
    id: 'ast-4',
    assetTag: 'AST-2024-004',
    name: 'ThinkPad X1 Carbon Gen 11',
    categoryId: 'cat-1',
    brand: 'Lenovo',
    model: 'ThinkPad X1 Carbon Ultralight',
    serialNumber: 'PF3K98M1',
    purchaseDate: '2024-02-05',
    purchaseCost: 1850.00,
    warrantyExpiry: '2027-02-05',
    vendorId: 'ven-4',
    locationId: 'loc-1',
    departmentId: 'dep-1',
    status: 'Available',
    assignedEmployeeId: null,
    notes: 'Configured and imaged. Ready for new hire in IT/DevOps',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80',
    createdAt: '2024-02-05T09:00:00Z',
    updatedAt: '2024-02-05T09:00:00Z'
  },
  {
    id: 'ast-5',
    assetTag: 'AST-2024-005',
    name: 'Dell UltraSharp 32" 4K USB-C Hub Monitor',
    categoryId: 'cat-3',
    brand: 'Dell',
    model: 'U3223QE 4K IPS Black',
    serialNumber: 'CN-0N891X-74261',
    purchaseDate: '2024-01-20',
    purchaseCost: 899.00,
    warrantyExpiry: '2027-01-20',
    vendorId: 'ven-2',
    locationId: 'loc-2',
    departmentId: 'dep-2',
    status: 'Assigned',
    assignedEmployeeId: 'emp-1',
    assignedDate: '2024-01-22',
    notes: 'Desk 42 docking monitor with 90W power delivery',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80',
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z'
  },
  {
    id: 'ast-6',
    assetTag: 'AST-2024-006',
    name: 'Apple Studio Display 27" 5K (Nano-Texture)',
    categoryId: 'cat-3',
    brand: 'Apple',
    model: 'Studio Display MK0U3LL/A',
    serialNumber: 'H19K2848MD6M',
    purchaseDate: '2023-08-14',
    purchaseCost: 1899.00,
    warrantyExpiry: '2026-08-14',
    vendorId: 'ven-1',
    locationId: 'loc-2',
    departmentId: 'dep-3',
    status: 'Assigned',
    assignedEmployeeId: 'emp-2',
    assignedDate: '2023-08-15',
    notes: 'Includes tilt-and-height adjustable stand',
    imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&auto=format&fit=crop&q=80',
    createdAt: '2023-08-14T09:00:00Z',
    updatedAt: '2023-08-15T11:00:00Z'
  },
  {
    id: 'ast-7',
    assetTag: 'AST-2024-007',
    name: 'iPhone 15 Pro 256GB Natural Titanium',
    categoryId: 'cat-4',
    brand: 'Apple',
    model: 'iPhone 15 Pro (A2848)',
    serialNumber: 'DN6L9890M6TN',
    purchaseDate: '2023-10-01',
    purchaseCost: 1099.00,
    warrantyExpiry: '2025-10-01',
    vendorId: 'ven-1',
    locationId: 'loc-3',
    departmentId: 'dep-5',
    status: 'Assigned',
    assignedEmployeeId: 'emp-4',
    assignedDate: '2023-10-05',
    notes: 'Managed via Apple Business Manager & Intune MDM',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80',
    createdAt: '2023-10-01T10:00:00Z',
    updatedAt: '2023-10-05T15:00:00Z'
  },
  {
    id: 'ast-8',
    assetTag: 'AST-2024-008',
    name: 'iPad Pro 12.9" M2 Wi-Fi + 5G Cellular',
    categoryId: 'cat-5',
    brand: 'Apple',
    model: 'iPad Pro 6th Gen 256GB Space Gray',
    serialNumber: 'DMP892019MN0',
    purchaseDate: '2023-09-12',
    purchaseCost: 1399.00,
    warrantyExpiry: '2026-09-12',
    vendorId: 'ven-1',
    locationId: 'loc-2',
    departmentId: 'dep-3',
    status: 'Assigned',
    assignedEmployeeId: 'emp-8',
    assignedDate: '2023-10-16',
    notes: 'Paired with Apple Pencil 2 and Magic Keyboard',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80',
    createdAt: '2023-09-12T13:00:00Z',
    updatedAt: '2023-10-16T10:30:00Z'
  },
  {
    id: 'ast-9',
    assetTag: 'AST-2024-009',
    name: 'Cisco Catalyst 9300 48-Port PoE+ Switch',
    categoryId: 'cat-6',
    brand: 'Cisco',
    model: 'C9300-48P-A Gigabit Switch',
    serialNumber: 'FOC244199LX',
    purchaseDate: '2022-05-10',
    purchaseCost: 4500.00,
    warrantyExpiry: '2027-05-10',
    vendorId: 'ven-3',
    locationId: 'loc-1',
    departmentId: 'dep-1',
    status: 'Available',
    assignedEmployeeId: null,
    notes: 'Rack 2, Unit 14 in SF Server Room. Cisco SMARTnet active',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80',
    createdAt: '2022-05-10T08:00:00Z',
    updatedAt: '2024-01-10T12:00:00Z'
  },
  {
    id: 'ast-10',
    assetTag: 'AST-2024-010',
    name: 'HP LaserJet Enterprise Flow MFP M630',
    categoryId: 'cat-7',
    brand: 'HP',
    model: 'Enterprise Flow MFP M630z',
    serialNumber: 'CNB1982736',
    purchaseDate: '2022-08-20',
    purchaseCost: 2850.00,
    warrantyExpiry: '2025-08-20',
    vendorId: 'ven-3',
    locationId: 'loc-3',
    departmentId: 'dep-4',
    status: 'Available',
    assignedEmployeeId: null,
    notes: 'NY Office Central Copy Station. Network IP: 10.20.4.15',
    imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&auto=format&fit=crop&q=80',
    createdAt: '2022-08-20T10:00:00Z',
    updatedAt: '2023-12-01T09:00:00Z'
  },
  {
    id: 'ast-11',
    assetTag: 'AST-2024-011',
    name: 'MacBook Pro 16" M2 Max (32GB / 1TB)',
    categoryId: 'cat-1',
    brand: 'Apple',
    model: 'MacBook Pro 16-inch M2 Max',
    serialNumber: 'C02F9812MD5K',
    purchaseDate: '2023-04-10',
    purchaseCost: 3499.00,
    warrantyExpiry: '2026-04-10',
    vendorId: 'ven-1',
    locationId: 'loc-4',
    departmentId: 'dep-2',
    status: 'Assigned',
    assignedEmployeeId: 'emp-6',
    assignedDate: '2023-04-20',
    notes: 'Deployed in London DevOps cluster',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80',
    createdAt: '2023-04-10T09:00:00Z',
    updatedAt: '2023-04-20T11:00:00Z'
  },
  {
    id: 'ast-12',
    assetTag: 'AST-2024-012',
    name: 'Dell Precision 7780 Mobile Workstation',
    categoryId: 'cat-1',
    brand: 'Dell',
    model: 'Precision 7780 RTX 4000 64GB',
    serialNumber: '7KL918B09',
    purchaseDate: '2023-07-22',
    purchaseCost: 4200.00,
    warrantyExpiry: '2026-07-22',
    vendorId: 'ven-2',
    locationId: 'loc-2',
    departmentId: 'dep-2',
    status: 'Assigned',
    assignedEmployeeId: 'emp-7',
    assignedDate: '2023-09-02',
    notes: 'Heavy computation & AI local test runner',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80',
    createdAt: '2023-07-22T10:00:00Z',
    updatedAt: '2023-09-02T14:00:00Z'
  },
  {
    id: 'ast-13',
    assetTag: 'AST-2024-013',
    name: 'Sony WH-1000XM5 Noise Canceling Headset',
    categoryId: 'cat-8',
    brand: 'Sony',
    model: 'WH-1000XM5 Silver',
    serialNumber: 'SN-9182740',
    purchaseDate: '2024-01-10',
    purchaseCost: 399.00,
    warrantyExpiry: '2025-01-10',
    vendorId: 'ven-3',
    locationId: 'loc-2',
    departmentId: 'dep-2',
    status: 'Assigned',
    assignedEmployeeId: 'emp-1',
    assignedDate: '2024-01-18',
    notes: 'Standard IT executive peripheral bundle',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80',
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z'
  },
  {
    id: 'ast-14',
    assetTag: 'AST-2024-014',
    name: 'Dell UltraSharp 27" 4K USB-C Hub Monitor',
    categoryId: 'cat-3',
    brand: 'Dell',
    model: 'U2723QE 4K IPS',
    serialNumber: 'CN-0N812Z-99124',
    purchaseDate: '2024-02-10',
    purchaseCost: 599.00,
    warrantyExpiry: '2027-02-10',
    vendorId: 'ven-2',
    locationId: 'loc-1',
    departmentId: 'dep-1',
    status: 'Available',
    assignedEmployeeId: null,
    notes: 'In stock in IT Hardware cage',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80',
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-02-10T09:00:00Z'
  },
  {
    id: 'ast-15',
    assetTag: 'AST-2024-015',
    name: 'Fortinet FortiGate 100F Security Gateway',
    categoryId: 'cat-6',
    brand: 'Fortinet',
    model: 'FG-100F-BDL-950-60',
    serialNumber: 'FGT100FT2001928',
    purchaseDate: '2022-03-01',
    purchaseCost: 3600.00,
    warrantyExpiry: '2025-03-01',
    vendorId: 'ven-3',
    locationId: 'loc-1',
    departmentId: 'dep-1',
    status: 'Available',
    assignedEmployeeId: null,
    notes: 'Edge Firewall for SF Headquarters. Annual license renewed',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=80',
    createdAt: '2022-03-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'ast-16',
    assetTag: 'AST-2024-016',
    name: 'MacBook Pro 13" M1 (16GB / 512GB)',
    categoryId: 'cat-1',
    brand: 'Apple',
    model: 'MacBook Pro 13-inch M1 2020',
    serialNumber: 'C02D1982MD4T',
    purchaseDate: '2021-02-15',
    purchaseCost: 1699.00,
    warrantyExpiry: '2024-02-15',
    vendorId: 'ven-1',
    locationId: 'loc-1',
    departmentId: 'dep-1',
    status: 'Under Maintenance',
    assignedEmployeeId: null,
    notes: 'Battery service required (battery health at 74%). Scheduled at Apple Store Genius Bar',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80',
    createdAt: '2021-02-15T09:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z'
  },
  {
    id: 'ast-17',
    assetTag: 'AST-2024-017',
    name: 'ThinkPad T14s Gen 3 AMD',
    categoryId: 'cat-1',
    brand: 'Lenovo',
    model: 'ThinkPad T14s Ryzen 7 Pro',
    serialNumber: 'PF2L8810K',
    purchaseDate: '2022-09-01',
    purchaseCost: 1450.00,
    warrantyExpiry: '2025-09-01',
    vendorId: 'ven-4',
    locationId: 'loc-3',
    departmentId: 'dep-4',
    status: 'Assigned',
    assignedEmployeeId: 'emp-9',
    assignedDate: '2024-02-02',
    notes: 'Assigned to Finance team for spreadsheet modeling',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80',
    createdAt: '2022-09-01T10:00:00Z',
    updatedAt: '2024-02-02T14:00:00Z'
  },
  {
    id: 'ast-18',
    assetTag: 'AST-2024-018',
    name: 'Dell PowerEdge R750 Rack Server',
    categoryId: 'cat-2',
    brand: 'Dell',
    model: 'PowerEdge R750 2x Xeon Silver 128GB',
    serialNumber: '9M81K02',
    purchaseDate: '2022-06-15',
    purchaseCost: 7800.00,
    warrantyExpiry: '2027-06-15',
    vendorId: 'ven-2',
    locationId: 'loc-4',
    departmentId: 'dep-1',
    status: 'Available',
    assignedEmployeeId: null,
    notes: 'London private staging cluster server. VMware ESXi 8.0 installed',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80',
    createdAt: '2022-06-15T09:00:00Z',
    updatedAt: '2023-11-01T10:00:00Z'
  },
  {
    id: 'ast-19',
    assetTag: 'AST-2024-019',
    name: 'Logitech MX Master 3S Wireless Mouse',
    categoryId: 'cat-8',
    brand: 'Logitech',
    model: 'MX Master 3S Graphite',
    serialNumber: '2234LZ09',
    purchaseDate: '2024-01-12',
    purchaseCost: 99.00,
    warrantyExpiry: '2026-01-12',
    vendorId: 'ven-3',
    locationId: 'loc-2',
    departmentId: 'dep-3',
    status: 'Assigned',
    assignedEmployeeId: 'emp-2',
    assignedDate: '2024-01-19',
    notes: 'Design team ergonomically approved accessory',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80',
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-19T09:15:00Z'
  },
  {
    id: 'ast-20',
    assetTag: 'AST-2024-020',
    name: 'MacBook Air 13" M2 (8GB / 256GB)',
    categoryId: 'cat-1',
    brand: 'Apple',
    model: 'MacBook Air M2 Midnight',
    serialNumber: 'C02J8192MD3P',
    purchaseDate: '2022-10-10',
    purchaseCost: 1199.00,
    warrantyExpiry: '2023-10-10',
    vendorId: 'ven-1',
    locationId: 'loc-1',
    departmentId: 'dep-1',
    status: 'Damaged',
    assignedEmployeeId: null,
    notes: 'Liquid spill on keyboard and logic board. Awaiting scrap write-off',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80',
    createdAt: '2022-10-10T09:00:00Z',
    updatedAt: '2024-01-10T16:00:00Z'
  },
  {
    id: 'ast-21',
    assetTag: 'AST-2024-021',
    name: 'Dell OptiPlex 7090 Micro Desktop',
    categoryId: 'cat-2',
    brand: 'Dell',
    model: 'OptiPlex 7090 Micro Core i7',
    serialNumber: '4LK910P01',
    purchaseDate: '2020-05-18',
    purchaseCost: 1150.00,
    warrantyExpiry: '2023-05-18',
    vendorId: 'ven-2',
    locationId: 'loc-1',
    departmentId: 'dep-1',
    status: 'Retired',
    assignedEmployeeId: null,
    notes: 'Replaced during 2024 IT lifecycle refresh. Drive wiped (DoD 5220.22-M)',
    imageUrl: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&auto=format&fit=crop&q=80',
    createdAt: '2020-05-18T09:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z'
  },
  {
    id: 'ast-22',
    assetTag: 'AST-2024-022',
    name: 'Zebra ZT411 Industrial Label Printer',
    categoryId: 'cat-7',
    brand: 'Zebra',
    model: 'ZT411 300 DPI Thermal',
    serialNumber: 'ZBR99182341',
    purchaseDate: '2023-03-15',
    purchaseCost: 1750.00,
    warrantyExpiry: '2026-03-15',
    vendorId: 'ven-3',
    locationId: 'loc-1',
    departmentId: 'dep-1',
    status: 'Available',
    assignedEmployeeId: null,
    notes: 'Used for barcode & asset tag physical label printing',
    imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&auto=format&fit=crop&q=80',
    createdAt: '2023-03-15T11:00:00Z',
    updatedAt: '2023-03-15T11:00:00Z'
  }
];

const initialAssignments: AssetAssignment[] = [
  {
    id: 'asg-1',
    assetId: 'ast-1',
    assetTag: 'AST-2024-001',
    assetName: 'MacBook Pro 16" M3 Max (64GB / 1TB)',
    employeeId: 'emp-1',
    employeeName: 'Alexander Chen',
    assignedDate: '2024-01-18',
    assignedByUserId: 'usr-1',
    assignedByUserName: 'Sarah Jenkins',
    assignmentNotes: 'Assigned for engineering leadership tasks',
    status: 'Active',
    createdAt: '2024-01-18T14:30:00Z'
  },
  {
    id: 'asg-2',
    assetId: 'ast-2',
    assetTag: 'AST-2024-002',
    assetName: 'MacBook Pro 14" M3 Pro (36GB / 512GB)',
    employeeId: 'emp-2',
    employeeName: 'Maya Lin',
    assignedDate: '2024-01-19',
    assignedByUserId: 'usr-2',
    assignedByUserName: 'Marcus Vance',
    assignmentNotes: 'Assigned for UI/UX product design work',
    status: 'Active',
    createdAt: '2024-01-19T09:15:00Z'
  },
  {
    id: 'asg-3',
    assetId: 'ast-3',
    assetTag: 'AST-2024-003',
    assetName: 'Dell XPS 15 9530 (i9-13900H / 32GB)',
    employeeId: 'emp-5',
    employeeName: 'Robert Martinez',
    assignedDate: '2023-11-20',
    assignedByUserId: 'usr-2',
    assignedByUserName: 'Marcus Vance',
    assignmentNotes: 'Primary finance laptop with ERP access',
    status: 'Active',
    createdAt: '2023-11-20T16:00:00Z'
  },
  {
    id: 'asg-4',
    assetId: 'ast-5',
    assetTag: 'AST-2024-005',
    assetName: 'Dell UltraSharp 32" 4K USB-C Hub Monitor',
    employeeId: 'emp-1',
    employeeName: 'Alexander Chen',
    assignedDate: '2024-01-22',
    assignedByUserId: 'usr-1',
    assignedByUserName: 'Sarah Jenkins',
    assignmentNotes: 'Desk dual display setup',
    status: 'Active',
    createdAt: '2024-01-22T10:00:00Z'
  },
  {
    id: 'asg-5',
    assetId: 'ast-4',
    assetTag: 'AST-2024-004',
    assetName: 'ThinkPad X1 Carbon Gen 11',
    employeeId: 'emp-10',
    employeeName: 'Hannah Schmidt',
    assignedDate: '2024-01-08',
    returnedDate: '2024-02-04',
    returnCondition: 'Excellent',
    assignedByUserId: 'usr-2',
    assignedByUserName: 'Marcus Vance',
    assignmentNotes: 'Temporary loaner laptop during onboarding',
    returnNotes: 'Returned in pristine condition, reset and ready for next user',
    status: 'Returned',
    createdAt: '2024-01-08T10:00:00Z'
  }
];

const initialHistory: AssetHistory[] = [
  {
    id: 'hist-1',
    assetId: 'ast-1',
    assetTag: 'AST-2024-001',
    assetName: 'MacBook Pro 16" M3 Max (64GB / 1TB)',
    timestamp: '2024-01-15T10:00:00Z',
    userId: 'usr-1',
    userName: 'Sarah Jenkins',
    action: 'Created',
    notes: 'Asset logged and barcode tagged AST-2024-001'
  },
  {
    id: 'hist-2',
    assetId: 'ast-1',
    assetTag: 'AST-2024-001',
    assetName: 'MacBook Pro 16" M3 Max (64GB / 1TB)',
    timestamp: '2024-01-18T14:30:00Z',
    userId: 'usr-1',
    userName: 'Sarah Jenkins',
    action: 'Assigned',
    fieldChanged: 'Assigned Employee',
    previousValue: 'Unassigned (Available)',
    newValue: 'Alexander Chen (EMP-1001)',
    notes: 'Checked out to Principal Software Architect'
  },
  {
    id: 'hist-3',
    assetId: 'ast-2',
    assetTag: 'AST-2024-002',
    assetName: 'MacBook Pro 14" M3 Pro (36GB / 512GB)',
    timestamp: '2024-01-19T09:15:00Z',
    userId: 'usr-2',
    userName: 'Marcus Vance',
    action: 'Assigned',
    fieldChanged: 'Assigned Employee',
    previousValue: 'Unassigned',
    newValue: 'Maya Lin (EMP-1002)',
    notes: 'Assigned to Design department'
  },
  {
    id: 'hist-4',
    assetId: 'ast-4',
    assetTag: 'AST-2024-004',
    assetName: 'ThinkPad X1 Carbon Gen 11',
    timestamp: '2024-02-04T16:20:00Z',
    userId: 'usr-2',
    userName: 'Marcus Vance',
    action: 'Returned',
    fieldChanged: 'Assigned Employee',
    previousValue: 'Hannah Schmidt (EMP-1010)',
    newValue: 'Unassigned (Available)',
    notes: 'Returned in Excellent condition with power adapter'
  },
  {
    id: 'hist-5',
    assetId: 'ast-16',
    assetTag: 'AST-2024-016',
    assetName: 'MacBook Pro 13" M1 (16GB / 512GB)',
    timestamp: '2024-02-10T11:00:00Z',
    userId: 'usr-1',
    userName: 'Sarah Jenkins',
    action: 'Maintenance',
    fieldChanged: 'Status',
    previousValue: 'Available',
    newValue: 'Under Maintenance',
    notes: 'Battery degradation diagnosis dispatched to Apple Authorized Service'
  },
  {
    id: 'hist-6',
    assetId: 'ast-21',
    assetTag: 'AST-2024-021',
    assetName: 'Dell OptiPlex 7090 Micro Desktop',
    timestamp: '2024-01-05T14:00:00Z',
    userId: 'usr-1',
    userName: 'Sarah Jenkins',
    action: 'Retired',
    fieldChanged: 'Status',
    previousValue: 'Available',
    newValue: 'Retired',
    notes: 'End of 4-year lifecycle reached. Certificate of data destruction generated'
  }
];

const initialSettings: OrganizationSettings = {
  organizationName: 'Acme Global Enterprises',
  organizationLogoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&auto=format&fit=crop&q=80',
  address: '500 Howard Street, Suite 400, San Francisco, CA 94105',
  email: 'it-assets@acmeglobal.com',
  phone: '+1 (415) 555-0100',
  defaultCurrency: 'USD',
  currencySymbol: '$',
  dateFormat: 'YYYY-MM-DD',
  timeZone: 'America/Los_Angeles'
};

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (err) {
        console.error('Failed to create data dir:', err);
      }
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read DB file, using fresh seed data:', err);
    }

    const defaultData: DatabaseSchema = {
      users: initialUsers,
      categories: initialCategories,
      locations: initialLocations,
      departments: initialDepartments,
      vendors: initialVendors,
      employees: initialEmployees,
      assets: initialAssets,
      assignments: initialAssignments,
      history: initialHistory,
      settings: initialSettings
    };

    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      const data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving data to database file:', err);
    }
  }

  public resetToDemo(): DatabaseSchema {
    this.data = {
      users: initialUsers,
      categories: initialCategories,
      locations: initialLocations,
      departments: initialDepartments,
      vendors: initialVendors,
      employees: initialEmployees,
      assets: initialAssets,
      assignments: initialAssignments,
      history: initialHistory,
      settings: initialSettings
    };
    this.saveData();
    return this.data;
  }

  public getRawData(): DatabaseSchema {
    return this.data;
  }

  public restoreData(newData: DatabaseSchema): boolean {
    if (newData && Array.isArray(newData.assets) && Array.isArray(newData.employees)) {
      this.data = newData;
      this.saveData();
      return true;
    }
    return false;
  }

  // Users & Auth
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  // Settings
  public getSettings(): OrganizationSettings {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<OrganizationSettings>): OrganizationSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.saveData();
    return this.data.settings;
  }

  // Categories
  public getCategories(): Category[] {
    return this.data.categories.map(c => ({
      ...c,
      assetCount: this.data.assets.filter(a => a.categoryId === c.id).length
    }));
  }

  public createCategory(cat: Omit<Category, 'id' | 'createdAt'>): Category {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.categories.push(newCat);
    this.saveData();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.saveData();
    return this.data.categories[idx];
  }

  public deleteCategory(id: string): boolean {
    const hasAssets = this.data.assets.some(a => a.categoryId === id);
    if (hasAssets) return false;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    this.saveData();
    return true;
  }

  // Locations
  public getLocations(): Location[] {
    return this.data.locations.map(l => ({
      ...l,
      assetCount: this.data.assets.filter(a => a.locationId === l.id).length
    }));
  }

  public createLocation(loc: Omit<Location, 'id' | 'createdAt'>): Location {
    const newLoc: Location = {
      ...loc,
      id: `loc-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.locations.push(newLoc);
    this.saveData();
    return newLoc;
  }

  public updateLocation(id: string, updates: Partial<Location>): Location | null {
    const idx = this.data.locations.findIndex(l => l.id === id);
    if (idx === -1) return null;
    this.data.locations[idx] = { ...this.data.locations[idx], ...updates };
    this.saveData();
    return this.data.locations[idx];
  }

  public deleteLocation(id: string): boolean {
    const hasAssets = this.data.assets.some(a => a.locationId === id);
    if (hasAssets) return false;
    this.data.locations = this.data.locations.filter(l => l.id !== id);
    this.saveData();
    return true;
  }

  // Departments
  public getDepartments(): Department[] {
    return this.data.departments.map(d => ({
      ...d,
      employeeCount: this.data.employees.filter(e => e.departmentId === d.id).length,
      assetCount: this.data.assets.filter(a => a.departmentId === d.id).length
    }));
  }

  public createDepartment(dep: Omit<Department, 'id' | 'createdAt'>): Department {
    const newDep: Department = {
      ...dep,
      id: `dep-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.departments.push(newDep);
    this.saveData();
    return newDep;
  }

  public updateDepartment(id: string, updates: Partial<Department>): Department | null {
    const idx = this.data.departments.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.data.departments[idx] = { ...this.data.departments[idx], ...updates };
    this.saveData();
    return this.data.departments[idx];
  }

  public deleteDepartment(id: string): boolean {
    const hasEmployees = this.data.employees.some(e => e.departmentId === id);
    const hasAssets = this.data.assets.some(a => a.departmentId === id);
    if (hasEmployees || hasAssets) return false;
    this.data.departments = this.data.departments.filter(d => d.id !== id);
    this.saveData();
    return true;
  }

  // Vendors
  public getVendors(): Vendor[] {
    return this.data.vendors.map(v => ({
      ...v,
      assetCount: this.data.assets.filter(a => a.vendorId === v.id).length
    }));
  }

  public createVendor(ven: Omit<Vendor, 'id' | 'createdAt'>): Vendor {
    const newVen: Vendor = {
      ...ven,
      id: `ven-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.vendors.push(newVen);
    this.saveData();
    return newVen;
  }

  public updateVendor(id: string, updates: Partial<Vendor>): Vendor | null {
    const idx = this.data.vendors.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.data.vendors[idx] = { ...this.data.vendors[idx], ...updates };
    this.saveData();
    return this.data.vendors[idx];
  }

  public deleteVendor(id: string): boolean {
    const hasAssets = this.data.assets.some(a => a.vendorId === id);
    if (hasAssets) return false;
    this.data.vendors = this.data.vendors.filter(v => v.id !== id);
    this.saveData();
    return true;
  }

  // Employees
  public getEmployees(): Employee[] {
    return this.data.employees.map(e => this.enrichEmployee(e));
  }

  public getEmployeeById(id: string): (Employee & { assignedAssets: Asset[]; pastAssignments: AssetAssignment[] }) | null {
    const emp = this.data.employees.find(e => e.id === id || e.employeeId === id);
    if (!emp) return null;

    const enriched = this.enrichEmployee(emp);
    const assignedAssets = this.data.assets
      .filter(a => a.assignedEmployeeId === emp.id)
      .map(a => this.enrichAsset(a));
    const pastAssignments = this.data.assignments
      .filter(asg => asg.employeeId === emp.id);

    return {
      ...enriched,
      assignedAssets,
      pastAssignments
    };
  }

  public createEmployee(empData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>, actorUser?: User): Employee {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.employees.push(newEmp);
    this.saveData();
    return this.enrichEmployee(newEmp);
  }

  public updateEmployee(id: string, updates: Partial<Employee>, actorUser?: User): Employee | null {
    const idx = this.data.employees.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.data.employees[idx] = {
      ...this.data.employees[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    return this.enrichEmployee(this.data.employees[idx]);
  }

  public deleteEmployee(id: string): { success: boolean; error?: string } {
    const assignedAssets = this.data.assets.filter(a => a.assignedEmployeeId === id);
    if (assignedAssets.length > 0) {
      return { success: false, error: `Cannot delete employee with ${assignedAssets.length} currently assigned assets. Check them in first.` };
    }
    this.data.employees = this.data.employees.filter(e => e.id !== id);
    this.saveData();
    return { success: true };
  }

  private enrichEmployee(emp: Employee): Employee {
    const dep = this.data.departments.find(d => d.id === emp.departmentId);
    const loc = this.data.locations.find(l => l.id === emp.locationId);
    return {
      ...emp,
      departmentName: dep ? dep.name : emp.departmentName || 'Unknown Department',
      locationName: loc ? loc.name : emp.locationName || 'Unknown Location'
    };
  }

  // Assets
  public getAssets(filters?: {
    search?: string;
    categoryId?: string;
    locationId?: string;
    departmentId?: string;
    status?: string;
    assignedEmployeeId?: string;
  }): Asset[] {
    let assets = this.data.assets.map(a => this.enrichAsset(a));

    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        assets = assets.filter(a =>
          a.name.toLowerCase().includes(q) ||
          a.assetTag.toLowerCase().includes(q) ||
          a.serialNumber.toLowerCase().includes(q) ||
          a.brand.toLowerCase().includes(q) ||
          a.model.toLowerCase().includes(q) ||
          (a.assignedEmployeeName && a.assignedEmployeeName.toLowerCase().includes(q))
        );
      }
      if (filters.categoryId && filters.categoryId !== 'all') {
        assets = assets.filter(a => a.categoryId === filters.categoryId);
      }
      if (filters.locationId && filters.locationId !== 'all') {
        assets = assets.filter(a => a.locationId === filters.locationId);
      }
      if (filters.departmentId && filters.departmentId !== 'all') {
        assets = assets.filter(a => a.departmentId === filters.departmentId);
      }
      if (filters.status && filters.status !== 'all') {
        assets = assets.filter(a => a.status === filters.status);
      }
      if (filters.assignedEmployeeId) {
        assets = assets.filter(a => a.assignedEmployeeId === filters.assignedEmployeeId);
      }
    }

    return assets;
  }

  public getAssetById(id: string): (Asset & { history: AssetHistory[]; activeAssignment?: AssetAssignment }) | null {
    const asset = this.data.assets.find(a => a.id === id || a.assetTag === id);
    if (!asset) return null;

    const enriched = this.enrichAsset(asset);
    const history = this.data.history
      .filter(h => h.assetId === asset.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const activeAssignment = this.data.assignments.find(asg => asg.assetId === asset.id && asg.status === 'Active');

    return {
      ...enriched,
      history,
      activeAssignment
    };
  }

  public createAsset(assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>, actorUser: User): Asset {
    // Ensure tag uniqueness
    const exists = this.data.assets.some(a => a.assetTag.toLowerCase() === assetData.assetTag.toLowerCase());
    if (exists) {
      throw new Error(`Asset Tag "${assetData.assetTag}" is already in use.`);
    }

    const newAsset: Asset = {
      ...assetData,
      id: `ast-${Date.now()}`,
      status: assetData.status || (assetData.assignedEmployeeId ? 'Assigned' : 'Available'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.assets.push(newAsset);

    // Record creation history
    this.addHistory({
      assetId: newAsset.id,
      assetTag: newAsset.assetTag,
      assetName: newAsset.name,
      userId: actorUser.id,
      userName: actorUser.name,
      action: 'Created',
      notes: `Asset logged with initial status "${newAsset.status}"`
    });

    // If initially assigned, create assignment record
    if (newAsset.assignedEmployeeId) {
      const emp = this.data.employees.find(e => e.id === newAsset.assignedEmployeeId);
      if (emp) {
        this.addAssignment({
          assetId: newAsset.id,
          assetTag: newAsset.assetTag,
          assetName: newAsset.name,
          employeeId: emp.id,
          employeeName: emp.fullName,
          assignedDate: newAsset.assignedDate || new Date().toISOString().split('T')[0],
          assignedByUserId: actorUser.id,
          assignedByUserName: actorUser.name,
          assignmentNotes: newAsset.notes || 'Initial assignment on creation'
        });
      }
    }

    this.saveData();
    return this.enrichAsset(newAsset);
  }

  public updateAsset(id: string, updates: Partial<Asset>, actorUser: User): Asset | null {
    const idx = this.data.assets.findIndex(a => a.id === id);
    if (idx === -1) return null;

    const oldAsset = this.data.assets[idx];

    // Check unique tag if modified
    if (updates.assetTag && updates.assetTag !== oldAsset.assetTag) {
      const exists = this.data.assets.some(a => a.id !== id && a.assetTag.toLowerCase() === updates.assetTag!.toLowerCase());
      if (exists) {
        throw new Error(`Asset Tag "${updates.assetTag}" is already in use.`);
      }
    }

    // Detect changes for history log
    const changedFields: string[] = [];
    if (updates.name && updates.name !== oldAsset.name) changedFields.push(`Name: "${oldAsset.name}" -> "${updates.name}"`);
    if (updates.status && updates.status !== oldAsset.status) {
      changedFields.push(`Status: "${oldAsset.status}" -> "${updates.status}"`);
      this.addHistory({
        assetId: id,
        assetTag: oldAsset.assetTag,
        assetName: updates.name || oldAsset.name,
        userId: actorUser.id,
        userName: actorUser.name,
        action: 'Status Changed',
        fieldChanged: 'Status',
        previousValue: oldAsset.status,
        newValue: updates.status,
        notes: `Status updated by ${actorUser.name}`
      });
    }
    if (updates.locationId && updates.locationId !== oldAsset.locationId) {
      const oldLoc = this.data.locations.find(l => l.id === oldAsset.locationId)?.name || 'Unknown';
      const newLoc = this.data.locations.find(l => l.id === updates.locationId)?.name || 'Unknown';
      changedFields.push(`Location: "${oldLoc}" -> "${newLoc}"`);
    }

    if (changedFields.length > 0 && (!updates.status || updates.status === oldAsset.status)) {
      this.addHistory({
        assetId: id,
        assetTag: updates.assetTag || oldAsset.assetTag,
        assetName: updates.name || oldAsset.name,
        userId: actorUser.id,
        userName: actorUser.name,
        action: 'Updated',
        notes: `Fields changed: ${changedFields.join(', ')}`
      });
    }

    this.data.assets[idx] = {
      ...oldAsset,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveData();
    return this.enrichAsset(this.data.assets[idx]);
  }

  public deleteAsset(id: string, actorUser: User): boolean {
    const asset = this.data.assets.find(a => a.id === id);
    if (!asset) return false;

    // Record deletion event before removal
    this.addHistory({
      assetId: asset.id,
      assetTag: asset.assetTag,
      assetName: asset.name,
      userId: actorUser.id,
      userName: actorUser.name,
      action: 'Deleted',
      notes: `Asset removed from registry by ${actorUser.name}`
    });

    this.data.assets = this.data.assets.filter(a => a.id !== id);
    this.saveData();
    return true;
  }

  // Check-Out / Assign Workflow
  public assignAsset(
    assetId: string,
    employeeId: string,
    assignedDate: string,
    notes: string | undefined,
    expectedReturnDate: string | undefined,
    actorUser: User
  ): Asset {
    const asset = this.data.assets.find(a => a.id === assetId);
    if (!asset) throw new Error('Asset not found');

    if (asset.status === 'Assigned' && asset.assignedEmployeeId) {
      throw new Error(`Asset is already assigned. Please check it in first.`);
    }

    const employee = this.data.employees.find(e => e.id === employeeId);
    if (!employee) throw new Error('Employee not found');

    const previousStatus = asset.status;

    // Update asset
    asset.status = 'Assigned';
    asset.assignedEmployeeId = employee.id;
    asset.assignedDate = assignedDate || new Date().toISOString().split('T')[0];
    asset.updatedAt = new Date().toISOString();

    // Create assignment entry
    const assignment: AssetAssignment = {
      id: `asg-${Date.now()}`,
      assetId: asset.id,
      assetTag: asset.assetTag,
      assetName: asset.name,
      employeeId: employee.id,
      employeeName: employee.fullName,
      assignedDate: asset.assignedDate,
      expectedReturnDate,
      assignedByUserId: actorUser.id,
      assignedByUserName: actorUser.name,
      assignmentNotes: notes,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    this.data.assignments.push(assignment);

    // Record audit history
    this.addHistory({
      assetId: asset.id,
      assetTag: asset.assetTag,
      assetName: asset.name,
      userId: actorUser.id,
      userName: actorUser.name,
      action: 'Assigned',
      fieldChanged: 'Assigned Employee',
      previousValue: `Unassigned (${previousStatus})`,
      newValue: `${employee.fullName} (${employee.employeeId})`,
      notes: notes ? `Assigned with note: ${notes}` : `Assigned to ${employee.fullName}`
    });

    this.saveData();
    return this.enrichAsset(asset);
  }

  // Check-In / Return Workflow
  public returnAsset(
    assetId: string,
    returnCondition: 'Excellent' | 'Good' | 'Fair' | 'Damaged' | 'Defective',
    returnDate: string,
    notes: string | undefined,
    actorUser: User
  ): Asset {
    const asset = this.data.assets.find(a => a.id === assetId);
    if (!asset) throw new Error('Asset not found');

    const empId = asset.assignedEmployeeId;
    const emp = this.data.employees.find(e => e.id === empId);
    const empName = emp ? emp.fullName : 'Previous Employee';

    // Mark active assignment as returned
    const activeAssignment = this.data.assignments.find(a => a.assetId === assetId && a.status === 'Active');
    if (activeAssignment) {
      activeAssignment.status = 'Returned';
      activeAssignment.returnedDate = returnDate || new Date().toISOString().split('T')[0];
      activeAssignment.returnCondition = returnCondition;
      activeAssignment.returnNotes = notes;
    }

    // Determine new status based on condition
    let newStatus: Asset['status'] = 'Available';
    if (returnCondition === 'Damaged' || returnCondition === 'Defective') {
      newStatus = 'Under Maintenance';
    }

    asset.status = newStatus;
    asset.assignedEmployeeId = null;
    asset.assignedDate = null;
    asset.updatedAt = new Date().toISOString();

    // Record audit history
    this.addHistory({
      assetId: asset.id,
      assetTag: asset.assetTag,
      assetName: asset.name,
      userId: actorUser.id,
      userName: actorUser.name,
      action: 'Returned',
      fieldChanged: 'Status & Assignment',
      previousValue: `Assigned to ${empName}`,
      newValue: `${newStatus} (Condition: ${returnCondition})`,
      notes: notes ? `Returned by ${empName}. Notes: ${notes}` : `Returned by ${empName} in ${returnCondition} condition.`
    });

    this.saveData();
    return this.enrichAsset(asset);
  }

  private addHistory(event: Omit<AssetHistory, 'id' | 'timestamp'>) {
    const record: AssetHistory = {
      ...event,
      id: `hist-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    this.data.history.unshift(record);
  }

  private addAssignment(asg: Omit<AssetAssignment, 'id' | 'status' | 'createdAt'>) {
    const record: AssetAssignment = {
      ...asg,
      id: `asg-${Date.now()}`,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    this.data.assignments.push(record);
  }

  public getHistory(filters?: { assetId?: string; userId?: string; action?: string }): AssetHistory[] {
    let history = [...this.data.history];
    if (filters) {
      if (filters.assetId) history = history.filter(h => h.assetId === filters.assetId);
      if (filters.userId) history = history.filter(h => h.userId === filters.userId);
      if (filters.action && filters.action !== 'all') history = history.filter(h => h.action === filters.action);
    }
    return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public getAssignments(): AssetAssignment[] {
    return this.data.assignments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  private enrichAsset(asset: Asset): Asset {
    const cat = this.data.categories.find(c => c.id === asset.categoryId);
    const ven = this.data.vendors.find(v => v.id === asset.vendorId);
    const loc = this.data.locations.find(l => l.id === asset.locationId);
    const dep = this.data.departments.find(d => d.id === asset.departmentId);
    const emp = asset.assignedEmployeeId ? this.data.employees.find(e => e.id === asset.assignedEmployeeId) : null;

    return {
      ...asset,
      categoryName: cat ? cat.name : 'Uncategorized',
      vendorName: ven ? ven.name : 'Unknown Vendor',
      locationName: loc ? loc.name : 'Unknown Location',
      departmentName: dep ? dep.name : 'Unknown Department',
      assignedEmployeeName: emp ? emp.fullName : (asset.assignedEmployeeName || null),
      assignedEmployeeEmail: emp ? emp.email : (asset.assignedEmployeeEmail || null)
    };
  }

  public getDashboardStats(): DashboardStats {
    const assets = this.data.assets;
    const employees = this.data.employees;

    const totalAssets = assets.length;
    const availableAssets = assets.filter(a => a.status === 'Available').length;
    const assignedAssets = assets.filter(a => a.status === 'Assigned').length;
    const maintenanceAssets = assets.filter(a => a.status === 'Under Maintenance').length;
    const retiredAssets = assets.filter(a => a.status === 'Retired').length;
    const lostAssets = assets.filter(a => a.status === 'Lost').length;
    const damagedAssets = assets.filter(a => a.status === 'Damaged').length;
    const totalEmployees = employees.length;

    const totalAssetValue = assets.reduce((sum, a) => sum + (Number(a.purchaseCost) || 0), 0);

    const categoryMap: { [key: string]: { name: string; count: number; value: number } } = {};
    this.data.categories.forEach(c => {
      categoryMap[c.id] = { name: c.name, count: 0, value: 0 };
    });
    assets.forEach(a => {
      if (categoryMap[a.categoryId]) {
        categoryMap[a.categoryId].count++;
        categoryMap[a.categoryId].value += Number(a.purchaseCost) || 0;
      }
    });

    const locationMap: { [key: string]: { name: string; count: number } } = {};
    this.data.locations.forEach(l => {
      locationMap[l.id] = { name: l.name, count: 0 };
    });
    assets.forEach(a => {
      if (locationMap[a.locationId]) {
        locationMap[a.locationId].count++;
      }
    });

    const departmentMap: { [key: string]: { name: string; count: number } } = {};
    this.data.departments.forEach(d => {
      departmentMap[d.id] = { name: d.name, count: 0 };
    });
    assets.forEach(a => {
      if (departmentMap[a.departmentId]) {
        departmentMap[a.departmentId].count++;
      }
    });

    const statusColors: Record<string, string> = {
      'Available': '#10b981',
      'Assigned': '#3b82f6',
      'Under Maintenance': '#f59e0b',
      'Lost': '#ef4444',
      'Damaged': '#ec4899',
      'Retired': '#6b7280'
    };

    const assetsByStatus = [
      { name: 'Available', count: availableAssets, color: statusColors['Available'] },
      { name: 'Assigned', count: assignedAssets, color: statusColors['Assigned'] },
      { name: 'Under Maintenance', count: maintenanceAssets, color: statusColors['Under Maintenance'] },
      { name: 'Damaged', count: damagedAssets, color: statusColors['Damaged'] },
      { name: 'Retired', count: retiredAssets, color: statusColors['Retired'] },
      { name: 'Lost', count: lostAssets, color: statusColors['Lost'] }
    ].filter(s => s.count > 0);

    const recentActivity = this.getHistory().slice(0, 10);

    // Expiring warranties in next 180 days
    const now = new Date();
    const future180 = new Date();
    future180.setDate(now.getDate() + 180);

    const expiringWarranties = assets
      .filter(a => {
        if (!a.warrantyExpiry) return false;
        const exp = new Date(a.warrantyExpiry);
        return exp >= now && exp <= future180;
      })
      .map(a => this.enrichAsset(a))
      .slice(0, 5);

    return {
      totalAssets,
      availableAssets,
      assignedAssets,
      maintenanceAssets,
      retiredAssets,
      lostAssets,
      damagedAssets,
      totalEmployees,
      totalAssetValue,
      assetsByCategory: Object.values(categoryMap).filter(c => c.count > 0),
      assetsByLocation: Object.values(locationMap).filter(l => l.count > 0),
      assetsByDepartment: Object.values(departmentMap).filter(d => d.count > 0),
      assetsByStatus,
      recentActivity,
      expiringWarranties
    };
  }
}

export const db = new DatabaseManager();
