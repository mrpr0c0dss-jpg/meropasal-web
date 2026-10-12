import {
  ProductModel,
  CustomerModel,
  SupplierModel,
  ExpenseModel,
  SaleModel,
  ShopModel,
  StaffMemberModel,
  PaymentQRModel,
  PrinterSettingsModel,
} from './types';

export const initialShop: ShopModel = {
  id: '',
  name: '',
  ownerName: '',
  phone: '',
  email: '',
  address: '',
  panVat: '',
  currency: 'NPR',
  shopCode: '',
  logoUrl: '/transparentlogo.png',
  themeColor: '#0284c7',
  bannerUrl: '',
  bannerTag: '',
  bannerTitle: 'Welcome to Our Store',
  bannerSubtitle: 'Browse our catalog and order directly via WhatsApp or phone.',
  bannerBtnText: 'Browse Catalog',
  showBanner: false,
  announcementText: '',
  showAnnouncement: false,
  aboutStory: '',
  storeHours: '9:00 AM – 8:00 PM',
  deliveryArea: '',
  showFaq: false,
  faqs: [],
  addToCartBtnText: 'Add to Cart',
  cartLabel: 'Cart',
  checkoutBtnText: 'View Cart & Checkout',
  whatsappOrderBtnText: 'Send Order via WhatsApp',
  productLayout: 'gallery',
  headerLayout: 'classic',
  productCardStyle: 'border',
  corners: 'soft',
  productImageShape: 'portrait',
  productsPerRowDesktop: '4',
  productsPerPage: '12',
  hideSearchBar: false,
  hideSortingMenu: false,
  hideCategoryFilters: false,
  removeCreateStoreFooter: true,
  createdAt: new Date().toISOString(),
};

export const getProductImageUrl = (product: { name?: string; category?: string; imageUrl?: string }): string => {
  if (product.imageUrl) return product.imageUrl;
  return '/transparentlogo.png';
};

// Real empty defaults — zero fake demo items
export const initialProducts: ProductModel[] = [];
export const initialCustomers: CustomerModel[] = [];
export const initialSales: SaleModel[] = [];
export const initialSuppliers: SupplierModel[] = [];
export const initialExpenses: ExpenseModel[] = [];
export const initialStaff: StaffMemberModel[] = [];

export const initialPaymentQR: PaymentQRModel = {
  shopId: 'shop_001',
  esewaId: '',
  khaltiId: '',
  fonepayMerchantCode: '',
};

export const initialPrinterSettings: PrinterSettingsModel = {
  paperSize: '58mm',
  autoPrintOnSale: false,
  showShopHeader: true,
  showShopFooter: true,
  footerMessage: 'Thank You! Visit Again',
};
