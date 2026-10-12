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
}

export interface ProductModel {
  id: string;
  shopId: string;
  name: string;
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

export interface StaffMemberModel {
  id: string;
  shopId: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  joinedAt: string;
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
