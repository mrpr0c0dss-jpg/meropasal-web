export type UserRole = 'owner' | 'manager' | 'cashier';

export interface UserModel {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  shopId?: string;
  role: UserRole;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ShopModel {
  id: string;
  name: string;
  shopName?: string;
  ownerName: string;
  ownerId?: string;
  phone: string;
  email: string;
  address: string;
  panVat?: string;
  panNumber?: string | null;
  category?: string;
  memberIds?: string[];
  inviteCode?: string;
  logoUrl?: string;
  currency: string;
  shopCode: string;
  createdAt: string;
  themeColor?: string;
  bannerUrl?: string;
  bannerTitle?: string;
  bannerTag?: string;
  bannerSubtitle?: string;
  bannerBtnText?: string;
  showBanner?: boolean;
  announcementText?: string;
  showAnnouncement?: boolean;
  // About & Hours
  aboutStory?: string;
  storeHours?: string;
  deliveryArea?: string;
  // Storefront FAQ
  faqs?: FAQItem[];
  showFaq?: boolean;
  // Button & Label Text
  addToCartBtnText?: string;
  cartLabel?: string;
  checkoutBtnText?: string;
  whatsappOrderBtnText?: string;
  // Storefront Appearance (WAStore)
  productLayout?: 'grid' | 'list' | 'gallery' | 'compact';
  headerLayout?: 'classic' | 'centered' | 'minimal';
  productCardStyle?: 'border' | 'shadow' | 'flat';
  corners?: 'soft' | 'rounded' | 'sharp';
  productImageShape?: 'portrait' | 'square' | 'landscape';
  productsPerRowDesktop?: '2' | '3' | '4' | '5';
  productsPerPage?: string;
  hideSearchBar?: boolean;
  hideSortingMenu?: boolean;
  hideCategoryFilters?: boolean;
  removeCreateStoreFooter?: boolean;

  // Delivery & Pricing (WAStore)
  flatDeliveryFee?: number;
  freeShippingOver?: number;
  minimumOrderAmount?: number;
  deliveryZones?: DeliveryZone[];

  // Notifications (WAStore)
  orderWhatsAppNumber?: string;
  orderNotificationEmail?: string;
  soundAlertOnOrder?: boolean;
  orderReceiptTemplate?: string;
  lowStockAlerts?: boolean;
  dailySummaryAlert?: boolean;

  // SEO (WAStore)
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  socialShareImage?: string;
  googleSiteVerification?: string;
  faviconUrl?: string;

  // Analytics & Pixels (WAStore)
  facebookPixelId?: string;
  googleAnalyticsId?: string;
  tiktokPixelId?: string;
  googleTagManagerId?: string;
  trackWhatsAppEvents?: boolean;
  trackAddToCartEvents?: boolean;

  // Custom Domain (WAStore)
  customDomain?: string;
  subdomain?: string;
  domainStatus?: 'pending' | 'active' | 'unverified';

  // Payment Options (WAStore)
  codEnabled?: boolean;
  onlinePaymentEnabled?: boolean;
  bankTransferEnabled?: boolean;
  bankDetails?: string;
  whatsappPaymentEnabled?: boolean;

  // Billing & Subscription (WAStore)
  billingPlan?: 'Starter Free' | 'Pro Merchant' | 'Enterprise Mall';
  billingCycle?: 'monthly' | 'yearly';
  billingRenewalDate?: string;

  // Advanced & Custom Code
  customHeaderCode?: string;
  customFooterCode?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  deliveryFee: number;
  freeOver?: number;
  minOrder?: number;
  agreeWithCustomerLater?: boolean;
}

export interface ProductModel {
  id: string;
  shopId: string;
  name: string;
  description?: string;
  barcode?: string;
  imageUrl?: string;
  quantity: number;
  minStockLevel: number;
  purchasePrice: number;
  sellingPrice: number;
  unit: string; // 'pieces' | 'kg' | 'liter' | 'box' | 'packet' | 'dozen' | 'meter'
  category: string;
  expiryDate?: string;
  batchNumber?: string;
  soldCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItemModel {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  purchasePrice?: number;
  unit?: string;
  discount?: number;
  total: number;
}

export type PaymentMethod = 'Cash' | 'eSewa' | 'Khalti' | 'Fonepay' | 'Credit' | 'Split';

export interface SaleModel {
  id: string;
  shopId: string;
  invoiceNumber: string;
  items: SaleItemModel[];
  subtotal: number;
  vatRate: number; // 0.0, 0.05, 0.13
  vatAmount: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paidAmount: number;
  dueAmount: number;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerId?: string;
  status: 'completed' | 'cancelled';
  isCancelled?: boolean;
  cancellationReason?: string;
  cancelledAt?: string;
  billedByName?: string;
  billedByUid?: string;
  createdAt: string;
}

export interface CustomerModel {
  id: string;
  shopId: string;
  name: string;
  phone: string;
  address?: string;
  totalDue: number;
  totalPurchases: number;
  lastPurchaseDate?: string;
  createdAt: string;
}

export interface UdharoTransactionModel {
  id: string;
  customerId: string;
  shopId: string;
  type: 'sale_credit' | 'payment_repaid';
  amount: number;
  balanceAfter: number;
  invoiceNumber?: string;
  notes?: string;
  paymentMethod?: string;
  createdAt: string;
}

export interface SupplierModel {
  id: string;
  shopId: string;
  name: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  address?: string;
  balanceOwed: number;
  createdAt: string;
}

export interface ExpenseModel {
  id: string;
  shopId: string;
  title: string;
  amount: number;
  category: 'Rent' | 'Electricity & Water' | 'Salary' | 'Transport' | 'Tea & Refreshments' | 'Maintenance' | 'Miscellaneous';
  date: string;
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
}

export type StaffDepartment =
  | 'POS Billing'
  | 'Inventory & Store'
  | 'Customer Support'
  | 'Floor Operations'
  | 'Accounts & Finance'
  | 'Security & Maintenance';

export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Shift-Based' | 'Contract';

export type AttendanceStatus = 'present' | 'late' | 'half_day' | 'absent' | 'on_leave';

export interface StaffPermissions {
  canGiveDiscount: boolean;
  maxDiscountPercent: number;
  canCancelBill: boolean;
  canViewCostPrice: boolean;
  canManageExpenses: boolean;
  canAccessUdharo: boolean;
  canEditProductPrice: boolean;
}

export interface StaffSalaryStructure {
  salaryType: 'monthly' | 'hourly' | 'daily';
  baseSalary: number;
  foodAllowance: number;
  transportAllowance: number;
  otherAllowance: number;
  overtimeHourlyRate: number;
  pfDeduction: number;
  taxTdsPercent: number;
}

export interface StaffBankAccount {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branchName?: string;
}

export interface StaffMemberModel {
  id: string;
  employeeCode: string;
  shopId: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  department: StaffDepartment;
  employmentType: EmploymentType;
  shift: 'Morning (7AM-3PM)' | 'Day (10AM-6PM)' | 'Evening (2PM-10PM)' | 'Custom';
  panNumber?: string;
  citizenshipNo?: string;
  emergencyContact?: string;
  bankAccount?: StaffBankAccount;
  isActive: boolean;
  joinedAt: string;
  salaryStructure: StaffSalaryStructure;
  permissions: StaffPermissions;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  date: string; // YYYY-MM-DD
  clockInTime?: string; // HH:MM
  clockOutTime?: string; // HH:MM
  status: AttendanceStatus;
  workHours: number;
  overtimeHours: number;
  notes?: string;
}

export interface SalaryAdvanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  amount: number;
  date: string;
  reason: string;
  approvedBy: string;
  isDeducted: boolean;
  deductedInPayrollMonth?: string;
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  staffName: string;
  employeeCode: string;
  month: string; // YYYY-MM
  monthName: string; // e.g. "Kartik 2083 / Oct 2026"
  baseSalary: number;
  totalDaysPresent: number;
  totalOvertimeHours: number;
  overtimePay: number;
  allowancesTotal: number;
  bonusOrCommission: number;
  grossSalary: number;
  advanceDeductions: number;
  taxDeductions: number;
  pfDeductions: number;
  netPayableSalary: number;
  status: 'paid' | 'pending';
  paymentDate?: string;
  paymentMethod?: 'Bank Transfer' | 'Cash' | 'eSewa' | 'Fonepay';
  transactionRef?: string;
  generatedAt: string;
}

export interface PaymentQRModel {
  shopId: string;
  esewaQrUrl?: string;
  esewaId?: string;
  khaltiQrUrl?: string;
  khaltiId?: string;
  fonepayQrUrl?: string;
  fonepayMerchantCode?: string;
  generalQrUrl?: string;
}

export interface PrinterSettingsModel {
  paperSize: '58mm' | '80mm';
  autoPrintOnSale: boolean;
  showShopHeader: boolean;
  showShopFooter: boolean;
  footerMessage: string;
}

// ── CMS (Content Management System) Types ────────────────────

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  isPublished: boolean;
  showInHeader: boolean;
  showInFooter: boolean;
  footerColumn?: 'company' | 'customer_care' | 'quick_links';
  seoTitle?: string;
  seoDescription?: string;
  category?: 'company' | 'policy' | 'guide' | 'custom';
  views?: number;
  lastUpdated: string;
  createdAt: string;
}

export interface CMSBanner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  position: 'hero' | 'promo_card';
  isActive: boolean;
  sortOrder: number;
}

export interface CMSAnnouncement {
  id: string;
  text: string;
  badge: string;
  linkText?: string;
  linkUrl?: string;
  isActive: boolean;
  bgColor: string;
  textColor: string;
  isMarquee?: boolean;
}

export interface CMSBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  isPublished: boolean;
  tags: string[];
  readTimeMinutes: number;
}

export interface CMSTestimonial {
  id: string;
  customerName: string;
  area: string;
  rating: number;
  comment: string;
  avatarUrl?: string;
  isVerified: boolean;
  date: string;
}

export interface CMSTrustBadge {
  id: string;
  icon: 'Truck' | 'ShieldCheck' | 'MessageCircle' | 'CreditCard' | 'Clock' | 'Award' | 'Sparkles';
  title: string;
  description: string;
  color?: string;
}

export type CMSSectionType =
  | 'announcement'
  | 'hero_slider'
  | 'trust_badges'
  | 'categories'
  | 'featured_products'
  | 'promo_grid'
  | 'testimonials'
  | 'faq'
  | 'blog'
  | 'whatsapp_banner';

export interface CMSHomepageSection {
  id: string;
  name: string;
  type: CMSSectionType;
  title: string;
  subtitle?: string;
  isEnabled: boolean;
  order: number;
}

export interface CMSNavigationItem {
  id: string;
  label: string;
  targetType: 'page' | 'category' | 'link' | 'catalog';
  targetValue: string;
  isExternal?: boolean;
}

export interface CMSSettings {
  headerNavItems: CMSNavigationItem[];
  trustBadges: CMSTrustBadge[];
  socialLinks: {
    whatsapp?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    mapsUrl?: string;
  };
  contactEmail?: string;
  contactAddress?: string;
  emergencyPhone?: string;
}

