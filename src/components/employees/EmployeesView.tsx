import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Download,
  Search,
  Eye,
  Edit2,
  Trash2,
  Boxes,
  Mail,
  Phone,
  Building,
  MapPin,
  ArrowUpDown
} from 'lucide-react';
import type { Employee, Department, Location, User as AuthUser } from '../../types';
import { StatusBadge } from '../common/Badge';
import { exportToCSV, formatDate } from '../../lib/utils';

interface EmployeesViewProps {
  employees: Employee[];
  departments: Department[];
  locations: Location[];
  currentUser: AuthUser | null;
  onAddEmployee: () => void;
  onEditEmployee: (emp: Employee) => void;
  onDeleteEmployee: (emp: Employee) => void;
  onViewEmployee: (emp: Employee) => void;
  globalSearch: string;
}

export function EmployeesView({
  employees,
  departments,
  locations,
  currentUser,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onViewEmployee,
  globalSearch
}: EmployeesViewProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [sortField, setSortField] = useState<keyof Employee>('fullName');
  const [sortAsc, setSortAsc] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const effectiveSearch = (globalSearch || localSearch).trim().toLowerCase();

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees
      .filter(emp => {
        if (effectiveSearch) {
          const matchName = emp.fullName.toLowerCase().includes(effectiveSearch);
          const matchId = emp.employeeId.toLowerCase().includes(effectiveSearch);
          const matchEmail = emp.email.toLowerCase().includes(effectiveSearch);
          const matchTitle = (emp.jobTitle || '').toLowerCase().includes(effectiveSearch);
          const matchDept = (emp.departmentName || '').toLowerCase().includes(effectiveSearch);
          if (!matchName && !matchId && !matchEmail && !matchTitle && !matchDept) return false;
        }

        if (departmentFilter !== 'all' && emp.departmentId !== departmentFilter) return false;
        if (locationFilter !== 'all' && emp.locationId !== locationFilter) return false;
        if (statusFilter !== 'all' && emp.status !== statusFilter) return false;

        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (valA === undefined || valA === null) valA = '';
        if (valB === undefined || valB === null) valB = '';

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }

        const comp = String(valA).localeCompare(String(valB));
        return sortAsc ? comp : -comp;
      });
  }, [employees, effectiveSearch, departmentFilter, locationFilter, statusFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  const handleExportCSV = () => {
    const rows = filteredEmployees.map(e => ({
      'Employee ID': e.employeeId,
      'Full Name': e.fullName,
      'Email': e.email,
      'Phone': e.phone || '',
      'Job Title': e.jobTitle || '',
      'Department': e.departmentName || '',
      'Location': e.locationName || '',
      'Status': e.status,
      'Active Assets': e.assignedAssetCount || 0,
      'Joining Date': e.joiningDate || ''
    }));

    exportToCSV(`assethub_employees_${new Date().toISOString().split('T')[0]}`, rows);
  };

  const canEdit = currentUser?.role !== 'Viewer';
  const canDelete = currentUser?.role === 'Super Admin';

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Employees & Custodians Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage company personnel, assign hardware, and track employee-issued equipment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>

          {canEdit && (
            <button
              onClick={onAddEmployee}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium shadow-md shadow-purple-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, title..."
              value={localSearch}
              onChange={e => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={departmentFilter}
              onChange={e => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={locationFilter}
              onChange={e => {
                setLocationFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Locations</option>
              {locations.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th
                  onClick={() => handleSort('employeeId')}
                  className="py-3 px-4 cursor-pointer hover:text-purple-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('departmentName')}
                  className="py-3 px-4 cursor-pointer hover:text-purple-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Department</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('locationName')}
                  className="py-3 px-4 cursor-pointer hover:text-purple-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Office Location</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Assigned Fleet</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold">No employees found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try changing your filters or create a new employee profile.</p>
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map(emp => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* Employee Profile */}
                    <td className="py-3 px-4">
                      <div
                        onClick={() => onViewEmployee(emp)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <img
                          src={emp.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={emp.fullName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-purple-200 dark:ring-purple-900 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors block truncate">
                            {emp.fullName}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                            {emp.jobTitle} • {emp.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* ID */}
                    <td className="py-3 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {emp.employeeId}
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {emp.departmentName}
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {emp.locationName}
                    </td>

                    {/* Assigned Asset Count */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold ${
                          (emp.assignedAssetCount || 0) > 0
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <Boxes className="w-3 h-3" />
                        {emp.assignedAssetCount || 0} Assets
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <StatusBadge status={emp.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewEmployee(emp)}
                          title="View Employee Profile & Assigned Assets"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {canEdit && (
                          <button
                            onClick={() => onEditEmployee(emp)}
                            title="Edit Employee"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => onDeleteEmployee(emp)}
                            title="Delete Employee"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400">
          <div>
            Showing <strong>{filteredEmployees.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * pageSize, filteredEmployees.length)}</strong> of{' '}
            <strong>{filteredEmployees.length}</strong> total employees
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            >
              Previous
            </button>
            <span className="px-2 font-semibold text-slate-800 dark:text-slate-200">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
