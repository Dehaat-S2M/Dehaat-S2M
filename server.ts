import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import type { User } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // In-memory active session user state (default: Super Admin Sarah Jenkins)
  let activeUserId = 'usr-1';

  const getActiveUser = (): User => {
    const user = db.getUserById(activeUserId);
    if (user) return user;
    return db.getUsers()[0];
  };

  // ------------------------------------------------------------
  // AUTH / ROLE SIMULATION API
  // ------------------------------------------------------------
  app.get('/api/auth/me', (req, res) => {
    const user = getActiveUser();
    const allUsers = db.getUsers();
    res.json({ user, availableUsers: allUsers });
  });

  app.post('/api/auth/switch-user', (req, res) => {
    const { userId } = req.body;
    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    activeUserId = userId;
    res.json({ success: true, user });
  });

  // ------------------------------------------------------------
  // DASHBOARD API
  // ------------------------------------------------------------
  app.get('/api/dashboard/stats', (req, res) => {
    try {
      const stats = db.getDashboardStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch stats' });
    }
  });

  // ------------------------------------------------------------
  // ASSETS API
  // ------------------------------------------------------------
  app.get('/api/assets', (req, res) => {
    try {
      const { search, categoryId, locationId, departmentId, status, assignedEmployeeId } = req.query;
      const assets = db.getAssets({
        search: search ? String(search) : undefined,
        categoryId: categoryId ? String(categoryId) : undefined,
        locationId: locationId ? String(locationId) : undefined,
        departmentId: departmentId ? String(departmentId) : undefined,
        status: status ? String(status) : undefined,
        assignedEmployeeId: assignedEmployeeId ? String(assignedEmployeeId) : undefined
      });
      res.json(assets);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch assets' });
    }
  });

  app.get('/api/assets/:id', (req, res) => {
    try {
      const asset = db.getAssetById(req.params.id);
      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      res.json(asset);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch asset' });
    }
  });

  app.post('/api/assets', (req, res) => {
    try {
      const currentUser = getActiveUser();
      if (currentUser.role === 'Viewer') {
        return res.status(403).json({ error: 'Viewer role cannot create assets' });
      }
      const asset = db.createAsset(req.body, currentUser);
      res.status(201).json(asset);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create asset' });
    }
  });

  app.put('/api/assets/:id', (req, res) => {
    try {
      const currentUser = getActiveUser();
      if (currentUser.role === 'Viewer') {
        return res.status(403).json({ error: 'Viewer role cannot modify assets' });
      }
      const asset = db.updateAsset(req.params.id, req.body, currentUser);
      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      res.json(asset);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update asset' });
    }
  });

  app.delete('/api/assets/:id', (req, res) => {
    try {
      const currentUser = getActiveUser();
      if (currentUser.role !== 'Super Admin') {
        return res.status(403).json({ error: 'Only Super Admin can delete assets' });
      }
      const success = db.deleteAsset(req.params.id, currentUser);
      if (!success) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      res.json({ success: true, message: 'Asset deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete asset' });
    }
  });

  // Check-Out / Assign Workflow
  app.post('/api/assets/:id/assign', (req, res) => {
    try {
      const currentUser = getActiveUser();
      if (currentUser.role === 'Viewer') {
        return res.status(403).json({ error: 'Viewer role cannot assign assets' });
      }
      const { employeeId, assignedDate, notes, expectedReturnDate } = req.body;
      if (!employeeId) {
        return res.status(400).json({ error: 'Employee ID is required' });
      }
      const updatedAsset = db.assignAsset(
        req.params.id,
        employeeId,
        assignedDate,
        notes,
        expectedReturnDate,
        currentUser
      );
      res.json({ success: true, asset: updatedAsset });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to assign asset' });
    }
  });

  // Check-In / Return Workflow
  app.post('/api/assets/:id/return', (req, res) => {
    try {
      const currentUser = getActiveUser();
      if (currentUser.role === 'Viewer') {
        return res.status(403).json({ error: 'Viewer role cannot check-in assets' });
      }
      const { returnCondition, returnDate, notes } = req.body;
      const updatedAsset = db.returnAsset(
        req.params.id,
        returnCondition || 'Good',
        returnDate,
        notes,
        currentUser
      );
      res.json({ success: true, asset: updatedAsset });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to return asset' });
    }
  });

  // Bulk Import Assets
  app.post('/api/assets/bulk-import', (req, res) => {
    try {
      const currentUser = getActiveUser();
      if (currentUser.role === 'Viewer') {
        return res.status(403).json({ error: 'Viewer role cannot import assets' });
      }
      const { assets } = req.body;
      if (!Array.isArray(assets) || assets.length === 0) {
        return res.status(400).json({ error: 'No assets provided for import' });
      }

      const imported: any[] = [];
      const errors: string[] = [];

      for (const raw of assets) {
        try {
          const item = db.createAsset({
            assetTag: raw.assetTag || `AST-${Date.now()}-${Math.floor(Math.random() * 100)}`,
            name: raw.name || 'Unnamed Asset',
            categoryId: raw.categoryId || db.getCategories()[0].id,
            brand: raw.brand || 'Generic',
            model: raw.model || 'Standard',
            serialNumber: raw.serialNumber || `SN-${Math.floor(Math.random() * 1000000)}`,
            purchaseDate: raw.purchaseDate || new Date().toISOString().split('T')[0],
            purchaseCost: Number(raw.purchaseCost) || 0,
            warrantyExpiry: raw.warrantyExpiry || new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
            vendorId: raw.vendorId || db.getVendors()[0].id,
            locationId: raw.locationId || db.getLocations()[0].id,
            departmentId: raw.departmentId || db.getDepartments()[0].id,
            status: raw.status || 'Available',
            notes: raw.notes || 'Imported via CSV batch'
          }, currentUser);
          imported.push(item);
        } catch (e: any) {
          errors.push(`Tag "${raw.assetTag || 'Unknown'}": ${e.message}`);
        }
      }

      res.json({
        success: true,
        count: imported.length,
        imported,
        errors
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Import failed' });
    }
  });

  // ------------------------------------------------------------
  // EMPLOYEES API
  // ------------------------------------------------------------
  app.get('/api/employees', (req, res) => {
    try {
      const employees = db.getEmployees();
      res.json(employees);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/employees/:id', (req, res) => {
    try {
      const employee = db.getEmployeeById(req.params.id);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json(employee);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/employees', (req, res) => {
    try {
      const currentUser = getActiveUser();
      if (currentUser.role === 'Viewer') {
        return res.status(403).json({ error: 'Viewer role cannot create employees' });
      }
      const employee = db.createEmployee(req.body, currentUser);
      res.status(201).json(employee);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/employees/:id', (req, res) => {
    try {
      const currentUser = getActiveUser();
      if (currentUser.role === 'Viewer') {
        return res.status(403).json({ error: 'Viewer role cannot modify employees' });
      }
      const employee = db.updateEmployee(req.params.id, req.body, currentUser);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json(employee);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/employees/:id', (req, res) => {
    try {
      const currentUser = getActiveUser();
      if (currentUser.role !== 'Super Admin') {
        return res.status(403).json({ error: 'Only Super Admin can delete employees' });
      }
      const result = db.deleteEmployee(req.params.id);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      res.json({ success: true, message: 'Employee deleted' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------------------------------------------------
  // CATEGORIES API
  // ------------------------------------------------------------
  app.get('/api/categories', (req, res) => {
    res.json(db.getCategories());
  });

  app.post('/api/categories', (req, res) => {
    try {
      const cat = db.createCategory(req.body);
      res.status(201).json(cat);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/categories/:id', (req, res) => {
    try {
      const cat = db.updateCategory(req.params.id, req.body);
      if (!cat) return res.status(404).json({ error: 'Category not found' });
      res.json(cat);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/categories/:id', (req, res) => {
    const success = db.deleteCategory(req.params.id);
    if (!success) {
      return res.status(400).json({ error: 'Cannot delete category with associated assets.' });
    }
    res.json({ success: true });
  });

  // ------------------------------------------------------------
  // LOCATIONS API
  // ------------------------------------------------------------
  app.get('/api/locations', (req, res) => {
    res.json(db.getLocations());
  });

  app.post('/api/locations', (req, res) => {
    try {
      const loc = db.createLocation(req.body);
      res.status(201).json(loc);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/locations/:id', (req, res) => {
    const loc = db.updateLocation(req.params.id, req.body);
    if (!loc) return res.status(404).json({ error: 'Location not found' });
    res.json(loc);
  });

  app.delete('/api/locations/:id', (req, res) => {
    const success = db.deleteLocation(req.params.id);
    if (!success) {
      return res.status(400).json({ error: 'Cannot delete location with associated assets.' });
    }
    res.json({ success: true });
  });

  // ------------------------------------------------------------
  // DEPARTMENTS API
  // ------------------------------------------------------------
  app.get('/api/departments', (req, res) => {
    res.json(db.getDepartments());
  });

  app.post('/api/departments', (req, res) => {
    try {
      const dep = db.createDepartment(req.body);
      res.status(201).json(dep);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/departments/:id', (req, res) => {
    const dep = db.updateDepartment(req.params.id, req.body);
    if (!dep) return res.status(404).json({ error: 'Department not found' });
    res.json(dep);
  });

  app.delete('/api/departments/:id', (req, res) => {
    const success = db.deleteDepartment(req.params.id);
    if (!success) {
      return res.status(400).json({ error: 'Cannot delete department with assigned employees or assets.' });
    }
    res.json({ success: true });
  });

  // ------------------------------------------------------------
  // VENDORS API
  // ------------------------------------------------------------
  app.get('/api/vendors', (req, res) => {
    res.json(db.getVendors());
  });

  app.post('/api/vendors', (req, res) => {
    try {
      const ven = db.createVendor(req.body);
      res.status(201).json(ven);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/vendors/:id', (req, res) => {
    const ven = db.updateVendor(req.params.id, req.body);
    if (!ven) return res.status(404).json({ error: 'Vendor not found' });
    res.json(ven);
  });

  app.delete('/api/vendors/:id', (req, res) => {
    const success = db.deleteVendor(req.params.id);
    if (!success) {
      return res.status(400).json({ error: 'Cannot delete vendor with linked assets.' });
    }
    res.json({ success: true });
  });

  // ------------------------------------------------------------
  // AUDIT HISTORY & ASSIGNMENTS API
  // ------------------------------------------------------------
  app.get('/api/history', (req, res) => {
    const { assetId, userId, action } = req.query;
    const history = db.getHistory({
      assetId: assetId ? String(assetId) : undefined,
      userId: userId ? String(userId) : undefined,
      action: action ? String(action) : undefined
    });
    res.json(history);
  });

  app.get('/api/assignments', (req, res) => {
    res.json(db.getAssignments());
  });

  // ------------------------------------------------------------
  // SETTINGS & SYSTEM BACKUP API
  // ------------------------------------------------------------
  app.get('/api/settings', (req, res) => {
    res.json(db.getSettings());
  });

  app.put('/api/settings', (req, res) => {
    try {
      const currentUser = getActiveUser();
      if (currentUser.role !== 'Super Admin') {
        return res.status(403).json({ error: 'Only Super Admin can edit organization settings' });
      }
      const updated = db.updateSettings(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/system/reset-demo', (req, res) => {
    try {
      const currentUser = getActiveUser();
      if (currentUser.role !== 'Super Admin') {
        return res.status(403).json({ error: 'Only Super Admin can reset system database' });
      }
      const data = db.resetToDemo();
      res.json({ success: true, message: 'Database reset to demo state successfully', data });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/system/backup', (req, res) => {
    try {
      const data = db.getRawData();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=assethub-backup-${new Date().toISOString().split('T')[0]}.json`);
      res.send(JSON.stringify(data, null, 2));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/system/restore', (req, res) => {
    try {
      const currentUser = getActiveUser();
      if (currentUser.role !== 'Super Admin') {
        return res.status(403).json({ error: 'Only Super Admin can restore database' });
      }
      const restored = db.restoreData(req.body);
      if (!restored) {
        return res.status(400).json({ error: 'Invalid database backup structure' });
      }
      res.json({ success: true, message: 'Database restored successfully' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // ------------------------------------------------------------
  // VITE MIDDLEWARE (Development & Production)
  // ------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AssetHub server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
