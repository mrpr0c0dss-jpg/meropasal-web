'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  StaffMemberModel,
  UserRole,
  StaffDepartment,
  EmploymentType,
  AttendanceStatus,
  PayrollRecord,
  SalaryAdvanceRecord,
  StaffSalaryStructure,
  StaffPermissions,
} from '@/lib/types';
import {
  Users,
  UserPlus,
  Clock,
  Calendar,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Printer,
  Search,
  Building2,
  Phone,
  Mail,
  Check,
  Copy,
  Plus,
  Edit2,
  Trash2,
  Sliders,
  TrendingUp,
  Percent,
  Coins,
  History,
  FileSpreadsheet,
  X,
  Receipt,
  UserCheck,
  Award,
  Wallet,
} from 'lucide-react';

type StaffTab = 'directory' | 'attendance' | 'payroll' | 'permissions' | 'performance';

export const StaffView: React.FC = () => {
  const {
    staff,
    addStaff,
    updateStaff,
    deleteStaff,
    toggleStaffStatus,
    updateStaffSalary,
    updateStaffPermissions,
    attendance,
    recordClockIn,
    recordClockOut,
    addAttendanceRecord,
    updateAttendanceRecord,
    salaryAdvances,
    addSalaryAdvance,
    payrolls,
    generateMonthlyPayroll,
    markPayrollPaid,
    sales,
    shop,
    formatCurrency,
  } = useApp();

  const [activeTab, setActiveTab] = useState<StaffTab>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedShift, setSelectedShift] = useState<string>('ALL');

  // Modals
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [isPaySalaryModalOpen, setIsPaySalaryModalOpen] = useState(false);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [isManualAttendanceOpen, setIsManualAttendanceOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMemberModel | null>(null);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Selected Date for Attendance Roster (default today)
  const todayDateStr = new Date().toISOString().split('T')[0];
  const [attendanceDate, setAttendanceDate] = useState(todayDateStr);

  // Selected Month for Payroll
  const [payrollMonth, setPayrollMonth] = useState('2026-10');
  const [payrollMonthName, setPayrollMonthName] = useState('Kartik 2083 / Oct 2026');

  // New Staff Form State
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'cashier' as UserRole,
    department: 'POS Billing' as StaffDepartment,
    employmentType: 'Full-Time' as EmploymentType,
    shift: 'Day (10AM-6PM)' as 'Morning (7AM-3PM)' | 'Day (10AM-6PM)' | 'Evening (2PM-10PM)' | 'Custom',
    baseSalary: 24000,
    foodAllowance: 3000,
    transportAllowance: 2000,
    otherAllowance: 1000,
    overtimeHourlyRate: 160,
    pfDeduction: 1200,
    taxTdsPercent: 1,
    maxDiscountPercent: 10,
    canGiveDiscount: true,
    canCancelBill: false,
    canViewCostPrice: false,
    canManageExpenses: false,
    canAccessUdharo: true,
    canEditProductPrice: false,
    bankName: 'Nabil Bank',
    accountNumber: '',
    accountHolderName: '',
  });

  // Salary Edit Form State
  const [salaryForm, setSalaryForm] = useState<StaffSalaryStructure>({
    salaryType: 'monthly',
    baseSalary: 24000,
    foodAllowance: 3000,
    transportAllowance: 2000,
    otherAllowance: 1000,
    overtimeHourlyRate: 160,
    pfDeduction: 1200,
    taxTdsPercent: 1,
  });

  // Advance Form State
  const [advanceForm, setAdvanceForm] = useState({
    staffId: '',
    amount: 5000,
    reason: '',
    date: todayDateStr,
    approvedBy: shop.ownerName || 'Ramesh Adhikari',
  });

  // Pay Salary Form State
  const [paymentForm, setPaymentForm] = useState({
    method: 'Bank Transfer' as 'Bank Transfer' | 'Cash' | 'eSewa' | 'Fonepay',
    transactionRef: '',
  });

  // Manual Attendance Form State
  const [manualAttForm, setManualAttForm] = useState({
    staffId: '',
    date: todayDateStr,
    clockIn: '09:00 AM',
    clockOut: '06:00 PM',
    status: 'present' as AttendanceStatus,
    workHours: 8,
    overtimeHours: 0,
    notes: '',
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(shop.shopCode || 'MP8294');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Filtered staff
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery) ||
        (s.employeeCode && s.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchDept = selectedDept === 'ALL' || s.department === selectedDept;
      const matchShift = selectedShift === 'ALL' || s.shift === selectedShift;
      return matchSearch && matchDept && matchShift;
    });
  }, [staff, searchQuery, selectedDept, selectedShift]);

  // Attendance Records for the Selected Date
  const dateAttendanceMap = useMemo(() => {
    const map = new Map<string, (typeof attendance)[0]>();
    attendance.forEach((a) => {
      if (a.date === attendanceDate) {
        map.set(a.staffId, a);
      }
    });
    return map;
  }, [attendance, attendanceDate]);

  // Today's Key Metrics
  const activeStaffCount = staff.filter((s) => s.isActive).length;
  const todayPresentCount = attendance.filter(
    (a) => a.date === todayDateStr && (a.status === 'present' || a.status === 'late')
  ).length;
  const todayLateCount = attendance.filter(
    (a) => a.date === todayDateStr && a.status === 'late'
  ).length;
  const totalMonthlyPayrollLiability = staff
    .filter((s) => s.isActive)
    .reduce((acc, s) => {
      const b = s.salaryStructure?.baseSalary || 20000;
      const f = s.salaryStructure?.foodAllowance || 0;
      const t = s.salaryStructure?.transportAllowance || 0;
      return acc + b + f + t;
    }, 0);

  // Sales per staff member
  const staffSalesStats = useMemo(() => {
    const stats: Record<string, { totalAmount: number; billCount: number }> = {};
    sales.forEach((sale) => {
      const key = sale.billedByName || 'Cashier Counter';
      if (!stats[key]) stats[key] = { totalAmount: 0, billCount: 0 };
      stats[key].totalAmount += sale.total;
      stats[key].billCount += 1;
    });
    return stats;
  }, [sales]);

  // Handle Add Staff Submit
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.name.trim() || !newStaffForm.phone.trim()) return;

    addStaff({
      employeeCode: `EMP-${1000 + staff.length + 1}`,
      name: newStaffForm.name.trim(),
      phone: newStaffForm.phone.trim(),
      email: newStaffForm.email.trim() || `${newStaffForm.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      role: newStaffForm.role,
      department: newStaffForm.department,
      employmentType: newStaffForm.employmentType,
      shift: newStaffForm.shift,
      isActive: true,
      bankAccount: {
        bankName: newStaffForm.bankName,
        accountNumber: newStaffForm.accountNumber || '0120101990123',
        accountHolderName: newStaffForm.accountHolderName || newStaffForm.name,
      },
      salaryStructure: {
        salaryType: 'monthly',
        baseSalary: Number(newStaffForm.baseSalary),
        foodAllowance: Number(newStaffForm.foodAllowance),
        transportAllowance: Number(newStaffForm.transportAllowance),
        otherAllowance: Number(newStaffForm.otherAllowance),
        overtimeHourlyRate: Number(newStaffForm.overtimeHourlyRate),
        pfDeduction: Number(newStaffForm.pfDeduction),
        taxTdsPercent: Number(newStaffForm.taxTdsPercent),
      },
      permissions: {
        canGiveDiscount: newStaffForm.canGiveDiscount,
        maxDiscountPercent: Number(newStaffForm.maxDiscountPercent),
        canCancelBill: newStaffForm.canCancelBill,
        canViewCostPrice: newStaffForm.canViewCostPrice,
        canManageExpenses: newStaffForm.canManageExpenses,
        canAccessUdharo: newStaffForm.canAccessUdharo,
        canEditProductPrice: newStaffForm.canEditProductPrice,
      },
    });

    setIsAddStaffOpen(false);
  };

  // Open Salary Edit Modal
  const openSalaryModal = (member: StaffMemberModel) => {
    setSelectedStaff(member);
    if (member.salaryStructure) {
      setSalaryForm(member.salaryStructure);
    }
    setIsSalaryModalOpen(true);
  };

  // Save Salary Edit
  const handleSaveSalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;
    updateStaffSalary(selectedStaff.id, salaryForm);
    setIsSalaryModalOpen(false);
  };

  // Open Advance Modal
  const openAdvanceModal = (member?: StaffMemberModel) => {
    if (member) {
      setAdvanceForm((prev) => ({ ...prev, staffId: member.id }));
    } else if (staff.length > 0) {
      setAdvanceForm((prev) => ({ ...prev, staffId: staff[0].id }));
    }
    setIsAdvanceModalOpen(true);
  };

  // Save Advance
  const handleSaveAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    const st = staff.find((s) => s.id === advanceForm.staffId);
    if (!st) return;

    addSalaryAdvance({
      staffId: st.id,
      staffName: st.name,
      amount: Number(advanceForm.amount),
      date: advanceForm.date,
      reason: advanceForm.reason.trim() || 'Salary advance requested',
      approvedBy: advanceForm.approvedBy,
      deductedInPayrollMonth: payrollMonth,
    });

    setIsAdvanceModalOpen(false);
  };

  // Open Pay Salary Modal
  const openPaySalaryModal = (payroll: PayrollRecord) => {
    setSelectedPayroll(payroll);
    setPaymentForm({
      method: 'Bank Transfer',
      transactionRef: `TRX-${Date.now().toString().slice(-6)}`,
    });
    setIsPaySalaryModalOpen(true);
  };

  // Submit Pay Salary
  const handleConfirmSalaryPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayroll) return;
    markPayrollPaid(selectedPayroll.id, paymentForm.method, paymentForm.transactionRef);
    setIsPaySalaryModalOpen(false);
  };

  // Save Manual Attendance
  const handleSaveManualAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const st = staff.find((s) => s.id === manualAttForm.staffId);
    if (!st) return;

    addAttendanceRecord({
      staffId: st.id,
      staffName: st.name,
      date: manualAttForm.date,
      clockInTime: manualAttForm.clockIn,
      clockOutTime: manualAttForm.clockOut,
      status: manualAttForm.status,
      workHours: Number(manualAttForm.workHours),
      overtimeHours: Number(manualAttForm.overtimeHours),
      notes: manualAttForm.notes,
    });

    setIsManualAttendanceOpen(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* ── TOP HEADER & QUICK STATS ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Staff, Attendance &amp; Payroll
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Enterprise HRM
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Complete mall workforce management: attendance shifts, salary structures, advances, and payroll
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => openAdvanceModal()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            <Coins className="w-4 h-4" />
            <span>Record Advance (पेश्की)</span>
          </button>

          <button
            onClick={() => setIsAddStaffOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* ── KPI METRICS STRIP ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Staff</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {staff.length} <span className="text-xs font-normal text-slate-400">({activeStaffCount} active)</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            All counters staffed
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">On-Duty Today</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {todayPresentCount} <span className="text-xs font-normal text-slate-400">/ {activeStaffCount}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {todayLateCount > 0 ? (
              <span className="text-amber-500 font-bold">{todayLateCount} late arrivals</span>
            ) : (
              '100% on-time check-in'
            )}
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Pending Advances</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            Rs.{' '}
            {salaryAdvances
              .filter((a) => !a.isDeducted)
              .reduce((acc, a) => acc + a.amount, 0)
              .toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">To deduct in next payroll</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Monthly Payroll Est.</span>
            <Wallet className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            Rs. {totalMonthlyPayrollLiability.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Basic + Allowances</p>
        </div>
      </div>

      {/* ── SHOP JOIN CODE BANNER ────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">Cashier Self-Registration &amp; Mobile App Code</h3>
          </div>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Staff can download the MeroPasal app on Android/iOS, sign up, and enter this shop join code to access their POS counter.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 pl-4 rounded-2xl border border-white/20 shrink-0">
          <span className="font-mono font-black text-xl tracking-widest">{shop.shopCode || 'MP8294'}</span>
          <button
            onClick={handleCopyCode}
            className="p-2.5 bg-white text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* ── TAB NAVIGATION ───────────────────────────────────── */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shrink-0 ${
            activeTab === 'directory'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff Directory ({staff.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shrink-0 ${
            activeTab === 'attendance'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Daily Attendance &amp; Shifts</span>
          {todayPresentCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('payroll')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shrink-0 ${
            activeTab === 'payroll'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Salary &amp; Payroll</span>
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shrink-0 ${
            activeTab === 'permissions'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Role Permissions</span>
        </button>

        <button
          onClick={() => setActiveTab('performance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shrink-0 ${
            activeTab === 'performance'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Counter Performance</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 1. STAFF DIRECTORY TAB                                    */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Search & Department Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name, phone, code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-hidden cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                <option value="POS Billing">POS Billing</option>
                <option value="Inventory & Store">Inventory &amp; Store</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Floor Operations">Floor Operations</option>
                <option value="Accounts & Finance">Accounts &amp; Finance</option>
              </select>

              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="px-3 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-hidden cursor-pointer"
              >
                <option value="ALL">All Shifts</option>
                <option value="Morning (7AM-3PM)">Morning (7AM-3PM)</option>
                <option value="Day (10AM-6PM)">Day (10AM-6PM)</option>
                <option value="Evening (2PM-10PM)">Evening (2PM-10PM)</option>
              </select>
            </div>
          </div>

          {/* Staff Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map((member) => {
              const todayAtt = dateAttendanceMap.get(member.id);
              const isClockedIn = todayAtt && todayAtt.clockInTime && !todayAtt.clockOutTime;
              const struct = member.salaryStructure;

              return (
                <div
                  key={member.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-all space-y-4"
                >
                  <div>
                    {/* Top Header: Avatar, Name, Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20 relative">
                          {member.name.charAt(0)}
                          <span
                            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                              isClockedIn ? 'bg-emerald-500 animate-pulse' : member.isActive ? 'bg-slate-400' : 'bg-rose-500'
                            }`}
                            title={isClockedIn ? 'On Duty' : 'Off Duty'}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                              {member.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-mono font-bold text-slate-400">
                              {member.employeeCode || 'EMP-1000'}
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                              {member.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleStaffStatus(member.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                          member.isActive
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {member.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    {/* Department, Shift, & Salary info */}
                    <div className="pt-3.5 space-y-2 text-xs border-t border-slate-100 dark:border-slate-800/80 mt-3.5">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>Dept:</span>
                        </span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {member.department || 'POS Billing'}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Shift:</span>
                        </span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {member.shift || 'Day Shift'}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          <span>Base Salary:</span>
                        </span>
                        <strong className="text-blue-600 dark:text-blue-400 font-mono">
                          Rs. {(struct?.baseSalary || 24000).toLocaleString()}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>Contact:</span>
                        </span>
                        <a href={`tel:${member.phone}`} className="font-mono hover:underline text-slate-700 dark:text-slate-300">
                          {member.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Clock-in/Clock-out + Salary Edit + Advance */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    {/* Clock In / Out Quick Button */}
                    {isClockedIn ? (
                      <button
                        onClick={() => recordClockOut(member.id)}
                        className="flex-1 py-2 px-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                        title="Clock Out this staff member"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Clock Out</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => recordClockIn(member.id)}
                        className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                        title="Clock In this staff member"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Clock In</span>
                      </button>
                    )}

                    <button
                      onClick={() => openSalaryModal(member)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Edit Salary Structure"
                    >
                      <CreditCard className="w-4 h-4 text-blue-500" />
                    </button>

                    <button
                      onClick={() => openAdvanceModal(member)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Give Salary Advance"
                    >
                      <Coins className="w-4 h-4 text-amber-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 2. DAILY ATTENDANCE & SHIFTS TAB                          */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          {/* Date Picker Header */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Attendance Roster for {attendanceDate === todayDateStr ? "Today's Shift" : attendanceDate}
                </h3>
                <p className="text-xs text-slate-400">
                  Daily clock-ins, late arrivals, shift hours, and overtime records
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setAttendanceDate(todayDateStr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  attendanceDate === todayDateStr
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Today
              </button>

              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white outline-hidden cursor-pointer"
              />

              <button
                onClick={() => setIsManualAttendanceOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Manual Entry</span>
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/75 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 sm:px-6">Staff Member</th>
                    <th className="py-3.5 px-3">Shift</th>
                    <th className="py-3.5 px-3">Clock In</th>
                    <th className="py-3.5 px-3">Clock Out</th>
                    <th className="py-3.5 px-3">Hours Worked</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {staff.map((member) => {
                    const rec = dateAttendanceMap.get(member.id);
                    const status = rec?.status || 'absent';

                    return (
                      <tr key={member.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                        {/* Staff name & code */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                {member.name}
                              </div>
                              <span className="text-[10px] font-mono text-slate-400">
                                {member.employeeCode} • {member.department}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Shift */}
                        <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                          {member.shift}
                        </td>

                        {/* Clock In */}
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {rec?.clockInTime || '—'}
                        </td>

                        {/* Clock Out */}
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {rec?.clockOutTime || '—'}
                        </td>

                        {/* Hours & Overtime */}
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {rec?.workHours ? `${rec.workHours} hrs` : '0 hrs'}
                          </div>
                          {rec?.overtimeHours && rec.overtimeHours > 0 ? (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                              +{rec.overtimeHours}h OT
                            </span>
                          ) : null}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              status === 'present'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : status === 'late'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                : status === 'half_day'
                                ? 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300'
                                : status === 'on_leave'
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                status === 'present'
                                  ? 'bg-emerald-500'
                                  : status === 'late'
                                  ? 'bg-amber-500'
                                  : status === 'on_leave'
                                  ? 'bg-blue-500'
                                  : 'bg-slate-400'
                              }`}
                            />
                            <span className="capitalize">{status.replace('_', ' ')}</span>
                          </span>
                        </td>

                        {/* Action buttons */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!rec?.clockInTime ? (
                              <button
                                onClick={() => recordClockIn(member.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer"
                              >
                                Clock In
                              </button>
                            ) : !rec?.clockOutTime ? (
                              <button
                                onClick={() => recordClockOut(member.id)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition cursor-pointer"
                              >
                                Clock Out
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 font-semibold">Completed</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 3. SALARY, ADVANCES & PAYROLL TAB                         */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          {/* Payroll Generator Header */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Monthly Payroll for {payrollMonthName}
                </h3>
                <p className="text-xs text-slate-400">
                  Automatic calculation of basic pay, overtime, advance deductions, and payslips
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <select
                value={payrollMonth}
                onChange={(e) => {
                  setPayrollMonth(e.target.value);
                  setPayrollMonthName(
                    e.target.value === '2026-10'
                      ? 'Kartik 2083 / Oct 2026'
                      : e.target.value === '2026-09'
                      ? 'Ashwin 2083 / Sep 2026'
                      : 'Bhadra 2083 / Aug 2026'
                  );
                }}
                className="px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white cursor-pointer outline-hidden"
              >
                <option value="2026-10">Kartik 2083 / Oct 2026 (Current)</option>
                <option value="2026-09">Ashwin 2083 / Sep 2026</option>
                <option value="2026-08">Bhadra 2083 / Aug 2026</option>
              </select>

              <button
                onClick={() => generateMonthlyPayroll(payrollMonth, payrollMonthName)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Calculate &amp; Generate Payroll</span>
              </button>
            </div>
          </div>

          {/* Payroll List Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Generated Paysheets ({payrolls.filter((p) => p.month === payrollMonth).length})
              </h4>
              <span className="text-xs text-slate-400">
                Total Net Payable: Rs.{' '}
                {payrolls
                  .filter((p) => p.month === payrollMonth)
                  .reduce((acc, p) => acc + p.netPayableSalary, 0)
                  .toLocaleString()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/75 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 sm:px-6">Employee</th>
                    <th className="py-3.5 px-3">Base Pay</th>
                    <th className="py-3.5 px-3">Days / OT</th>
                    <th className="py-3.5 px-3">Gross Salary</th>
                    <th className="py-3.5 px-3 text-rose-500">Advance Deduct</th>
                    <th className="py-3.5 px-3 font-black text-blue-600">Net Payable</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3 text-right">Payslip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {payrolls
                    .filter((p) => p.month === payrollMonth)
                    .map((payroll) => (
                      <tr key={payroll.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {payroll.staffName}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {payroll.employeeCode}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 font-mono">
                          Rs. {payroll.baseSalary.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-3 font-semibold text-slate-600 dark:text-slate-300">
                          {payroll.totalDaysPresent}d{' '}
                          {payroll.totalOvertimeHours > 0 && (
                            <span className="text-amber-500 font-bold">({payroll.totalOvertimeHours}h OT)</span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          Rs. {payroll.grossSalary.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-3 font-mono font-bold text-rose-500">
                          -Rs. {payroll.advanceDeductions.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-3 font-mono font-black text-sm text-blue-600 dark:text-blue-400">
                          Rs. {payroll.netPayableSalary.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-3">
                          {payroll.status === 'paid' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span>Paid ({payroll.paymentMethod})</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => openPaySalaryModal(payroll)}
                              className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs cursor-pointer transition"
                            >
                              Pay Now
                            </button>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedPayroll(payroll);
                              setIsPayslipModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Payslip</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Salary Advance Ledger Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Coins className="w-5 h-5 text-amber-500" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Salary Advance &amp; Loan Ledger (पेश्की खाता)
                </h4>
              </div>

              <button
                onClick={() => openAdvanceModal()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Issue Advance</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {salaryAdvances.map((adv) => (
                <div key={adv.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{adv.staffName}</span>
                      <span className="font-mono text-slate-400">({adv.date})</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{adv.reason}</p>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-sm text-rose-500 font-mono">
                      Rs. {adv.amount.toLocaleString()}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        adv.isDeducted ? 'text-slate-400' : 'text-amber-500'
                      }`}
                    >
                      {adv.isDeducted ? 'Deducted in Payroll' : 'Pending Deduction'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 4. ROLE PERMISSIONS MATRIX TAB                            */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === 'permissions' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              POS Cashier &amp; Staff Security Permissions Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Control granular access limits for discounts, bill voiding, product price editing, and expense logging
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/75 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 sm:px-6">Staff Member</th>
                    <th className="py-3.5 px-3">Role</th>
                    <th className="py-3.5 px-3 text-center">Give Discount</th>
                    <th className="py-3.5 px-3 text-center">Max Discount %</th>
                    <th className="py-3.5 px-3 text-center">Cancel / Void Bill</th>
                    <th className="py-3.5 px-3 text-center">View Cost Price</th>
                    <th className="py-3.5 px-3 text-center">Access Udharo</th>
                    <th className="py-3.5 px-3 text-center">Edit Prices</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {staff.map((member) => {
                    const p = member.permissions || {
                      canGiveDiscount: true,
                      maxDiscountPercent: 10,
                      canCancelBill: false,
                      canViewCostPrice: false,
                      canManageExpenses: false,
                      canAccessUdharo: true,
                      canEditProductPrice: false,
                    };

                    return (
                      <tr key={member.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="font-bold text-slate-900 dark:text-white">{member.name}</div>
                          <span className="text-[10px] font-mono text-slate-400">{member.employeeCode}</span>
                        </td>

                        <td className="py-3.5 px-3 font-semibold uppercase text-[10px] text-blue-600">
                          {member.role}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={p.canGiveDiscount}
                            onChange={(e) =>
                              updateStaffPermissions(member.id, { canGiveDiscount: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                          />
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {p.maxDiscountPercent}%
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={p.canCancelBill}
                            onChange={(e) =>
                              updateStaffPermissions(member.id, { canCancelBill: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                          />
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={p.canViewCostPrice}
                            onChange={(e) =>
                              updateStaffPermissions(member.id, { canViewCostPrice: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                          />
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={p.canAccessUdharo}
                            onChange={(e) =>
                              updateStaffPermissions(member.id, { canAccessUdharo: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                          />
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={p.canEditProductPrice}
                            onChange={(e) =>
                              updateStaffPermissions(member.id, { canEditProductPrice: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 5. COUNTER PERFORMANCE TAB                                */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === 'performance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {staff.map((member) => {
              const stat = staffSalesStats[member.name] || {
                totalAmount: member.role === 'owner' ? 24500 : 18400,
                billCount: member.role === 'owner' ? 18 : 12,
              };
              const avgBill = stat.billCount > 0 ? Math.round(stat.totalAmount / stat.billCount) : 0;

              return (
                <div
                  key={member.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {member.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {member.employeeCode} • {member.department}
                      </span>
                    </div>
                    <Award className="w-5 h-5 text-amber-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Sales Volume
                      </span>
                      <strong className="text-sm font-black text-blue-600 dark:text-blue-400 font-mono">
                        Rs. {stat.totalAmount.toLocaleString()}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Bills Billed
                      </span>
                      <strong className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono">
                        {stat.billCount} invoices
                      </strong>
                    </div>
                  </div>

                  <div className="pt-1 text-xs text-slate-500 flex items-center justify-between">
                    <span>Average Ticket Size:</span>
                    <strong className="text-slate-700 dark:text-slate-300 font-mono">
                      Rs. {avgBill.toLocaleString()}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MODAL 1: ADD STAFF MEMBER                                  */}
      {/* ══════════════════════════════════════════════════════════ */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>Add New Employee / Cashier</span>
              </h3>
              <button
                onClick={() => setIsAddStaffOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunil Shrestha"
                    value={newStaffForm.name}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="98XXXXXXXX"
                    value={newStaffForm.phone}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                  <select
                    value={newStaffForm.department}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, department: e.target.value as StaffDepartment })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden"
                  >
                    <option value="POS Billing">POS Billing</option>
                    <option value="Inventory & Store">Inventory & Store</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Floor Operations">Floor Operations</option>
                    <option value="Accounts & Finance">Accounts & Finance</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Shift</label>
                  <select
                    value={newStaffForm.shift}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, shift: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden"
                  >
                    <option value="Morning (7AM-3PM)">Morning (7AM-3PM)</option>
                    <option value="Day (10AM-6PM)">Day (10AM-6PM)</option>
                    <option value="Evening (2PM-10PM)">Evening (2PM-10PM)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Role</label>
                  <select
                    value={newStaffForm.role}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value as UserRole })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden"
                  >
                    <option value="cashier">Cashier</option>
                    <option value="manager">Manager</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
              </div>

              {/* Salary Structure Fields */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900 space-y-3">
                <span className="font-bold text-blue-900 dark:text-blue-300 block">
                  Salary &amp; Compensation Setup (NPR)
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">Base Salary</label>
                    <input
                      type="number"
                      value={newStaffForm.baseSalary}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, baseSalary: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">Food Allowance</label>
                    <input
                      type="number"
                      value={newStaffForm.foodAllowance}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, foodAllowance: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">Transport</label>
                    <input
                      type="number"
                      value={newStaffForm.transportAllowance}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, transportAllowance: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MODAL 2: EDIT SALARY STRUCTURE                            */}
      {/* ══════════════════════════════════════════════════════════ */}
      {isSalaryModalOpen && selectedStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Salary Structure: {selectedStaff.name}
                </h3>
                <span className="text-xs text-slate-400 font-mono">{selectedStaff.employeeCode}</span>
              </div>
              <button onClick={() => setIsSalaryModalOpen(false)} className="p-1.5 rounded-lg text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSalary} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Monthly Basic Salary (NPR)
                </label>
                <input
                  type="number"
                  required
                  value={salaryForm.baseSalary}
                  onChange={(e) => setSalaryForm({ ...salaryForm, baseSalary: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Food Allowance</label>
                  <input
                    type="number"
                    value={salaryForm.foodAllowance}
                    onChange={(e) => setSalaryForm({ ...salaryForm, foodAllowance: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">Transport Allowance</label>
                  <input
                    type="number"
                    value={salaryForm.transportAllowance}
                    onChange={(e) => setSalaryForm({ ...salaryForm, transportAllowance: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">OT Rate / Hour</label>
                  <input
                    type="number"
                    value={salaryForm.overtimeHourlyRate}
                    onChange={(e) => setSalaryForm({ ...salaryForm, overtimeHourlyRate: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">PF Deduction</label>
                  <input
                    type="number"
                    value={salaryForm.pfDeduction}
                    onChange={(e) => setSalaryForm({ ...salaryForm, pfDeduction: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSalaryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Update Salary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MODAL 3: RECORD SALARY ADVANCE (पेश्की)                    */}
      {/* ══════════════════════════════════════════════════════════ */}
      {isAdvanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <span>Issue Salary Advance (पेश्की निकासा)</span>
              </h3>
              <button onClick={() => setIsAdvanceModalOpen(false)} className="p-1.5 rounded-lg text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdvance} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Staff Member</label>
                <select
                  value={advanceForm.staffId}
                  onChange={(e) => setAdvanceForm({ ...advanceForm, staffId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Advance Amount (NPR) *</label>
                <input
                  type="number"
                  required
                  min={500}
                  step={500}
                  value={advanceForm.amount}
                  onChange={(e) => setAdvanceForm({ ...advanceForm, amount: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-black text-sm text-blue-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Reason / Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Medical emergency / Dashain shopping"
                  value={advanceForm.reason}
                  onChange={(e) => setAdvanceForm({ ...advanceForm, reason: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdvanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md"
                >
                  Approve &amp; Issue Advance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MODAL 4: PAY SALARY MODAL                                  */}
      {/* ══════════════════════════════════════════════════════════ */}
      {isPaySalaryModalOpen && selectedPayroll && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Pay Salary: {selectedPayroll.staffName}
                </h3>
                <span className="text-xs text-slate-400 font-mono">{selectedPayroll.monthName}</span>
              </div>
              <button onClick={() => setIsPaySalaryModalOpen(false)} className="p-1.5 rounded-lg text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSalaryPayment} className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-1">
                <span className="text-slate-500 block text-[11px]">Net Payable Amount:</span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                  Rs. {selectedPayroll.netPayableSalary.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Bank Transfer', 'eSewa', 'Cash', 'Fonepay'] as const).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setPaymentForm({ ...paymentForm, method: m })}
                      className={`p-2.5 rounded-xl font-bold transition text-center cursor-pointer ${
                        paymentForm.method === m
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Bank Reference / Transaction ID
                </label>
                <input
                  type="text"
                  required
                  value={paymentForm.transactionRef}
                  onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaySalaryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  Confirm &amp; Disburse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MODAL 5: PRINTABLE PAYSLIP (तलब भरपाई)                    */}
      {/* ══════════════════════════════════════════════════════════ */}
      {isPayslipModalOpen && selectedPayroll && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            {/* Payslip Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">{shop.name}</h3>
                <p className="text-xs text-slate-500">{shop.address}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">PAN: {shop.panVat || '601239845'}</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-black text-xs uppercase tracking-wider">
                  Payslip / तलब सिट
                </span>
                <p className="text-xs text-slate-400 font-mono mt-1">{selectedPayroll.monthName}</p>
              </div>
            </div>

            {/* Employee Details */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Employee Name:</span>
                <strong className="text-slate-900 dark:text-white text-sm">{selectedPayroll.staffName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Employee ID:</span>
                <strong className="text-slate-900 dark:text-white font-mono">{selectedPayroll.employeeCode}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Attendance / Days:</span>
                <strong className="text-slate-900 dark:text-white font-mono">
                  {selectedPayroll.totalDaysPresent} Days Present
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Overtime:</span>
                <strong className="text-slate-900 dark:text-white font-mono">
                  {selectedPayroll.totalOvertimeHours} Hours Worked
                </strong>
              </div>
            </div>

            {/* Earnings & Deductions Breakdown */}
            <div className="space-y-2 text-xs border-y border-slate-100 dark:border-slate-800 py-3">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Basic Pay (आधारभूत तलब):</span>
                <span className="font-mono">Rs. {selectedPayroll.baseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Allowances (खाजा तथा यातायात):</span>
                <span className="font-mono">+Rs. {selectedPayroll.allowancesTotal.toLocaleString()}</span>
              </div>
              {selectedPayroll.overtimePay > 0 && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Overtime Pay (थप समय):</span>
                  <span className="font-mono">+Rs. {selectedPayroll.overtimePay.toLocaleString()}</span>
                </div>
              )}
              {selectedPayroll.advanceDeductions > 0 && (
                <div className="flex justify-between text-rose-500 font-semibold">
                  <span>Salary Advance Deducted (पेश्की कटौति):</span>
                  <span className="font-mono">-Rs. {selectedPayroll.advanceDeductions.toLocaleString()}</span>
                </div>
              )}
              {selectedPayroll.pfDeductions > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Provident Fund (पीएफ):</span>
                  <span className="font-mono">-Rs. {selectedPayroll.pfDeductions.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Net Payable (खुद तलब):</span>
                <span className="text-blue-600 text-base font-mono">
                  Rs. {selectedPayroll.netPayableSalary.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Signature & Print Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[10px] text-slate-400 space-y-1">
                <p>Status: <strong className="text-emerald-600 uppercase">{selectedPayroll.status}</strong></p>
                {selectedPayroll.transactionRef && (
                  <p className="font-mono">Ref: {selectedPayroll.transactionRef}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPayslipModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MODAL 6: MANUAL ATTENDANCE ENTRY                          */}
      {/* ══════════════════════════════════════════════════════════ */}
      {isManualAttendanceOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Manual Attendance Entry</span>
              </h3>
              <button onClick={() => setIsManualAttendanceOpen(false)} className="p-1.5 rounded-lg text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveManualAttendance} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Employee</label>
                <select
                  value={manualAttForm.staffId}
                  onChange={(e) => setManualAttForm({ ...manualAttForm, staffId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="">Select Employee...</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Date</label>
                  <input
                    type="date"
                    value={manualAttForm.date}
                    onChange={(e) => setManualAttForm({ ...manualAttForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                  <select
                    value={manualAttForm.status}
                    onChange={(e) => setManualAttForm({ ...manualAttForm, status: e.target.value as AttendanceStatus })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="present">Present</option>
                    <option value="late">Late</option>
                    <option value="half_day">Half Day</option>
                    <option value="on_leave">On Leave</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Clock In Time</label>
                  <input
                    type="text"
                    value={manualAttForm.clockIn}
                    onChange={(e) => setManualAttForm({ ...manualAttForm, clockIn: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Clock Out Time</label>
                  <input
                    type="text"
                    value={manualAttForm.clockOut}
                    onChange={(e) => setManualAttForm({ ...manualAttForm, clockOut: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Remarks / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Retroactive entry for Sunday morning"
                  value={manualAttForm.notes}
                  onChange={(e) => setManualAttForm({ ...manualAttForm, notes: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualAttendanceOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
