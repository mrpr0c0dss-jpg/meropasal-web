'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  UserModel,
  UdharoTransactionModel,
  SaleItemModel,
  PaymentMethod,
} from './types';
import {
  initialShop,
  initialProducts,
  initialCustomers,
  initialSales,
  initialSuppliers,
  initialExpenses,
  initialStaff,
  initialPaymentQR,
  initialPrinterSettings,
} from './mockData';
import { Language, translations } from './translations';
import { audioFeedback } from './audioFeedback';
import { db, rtdb, auth } from './firebase';
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {
  ref,
  onValue,
  set as setRtdb,
  remove as removeRtdb,
} from 'firebase/database';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface AppContextType {
  // Localization & Theme & Privacy
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
  formatCurrency: (amount: number, hideSymbol?: boolean) => string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Active User & Shop
  user: UserModel | null;
  authInitialized: boolean;
  hasShop: boolean;
  setHasShop: (hasShop: boolean) => void;
  shop: ShopModel;
  updateShop: (updates: Partial<ShopModel>) => void;
  setUser: (user: UserModel | null) => void;
  logout: () => Promise<void>;

  // Products
  products: ProductModel[];
  addProduct: (product: Omit<ProductModel, 'id' | 'shopId' | 'createdAt' | 'updatedAt'>) => ProductModel;
  updateProduct: (id: string, updates: Partial<ProductModel>) => void;
  deleteProduct: (id: string) => void;
  restockProduct: (id: string, quantityToAdd: number) => void;

  // Customers & Udharo Ledger
  customers: CustomerModel[];
  udharoTransactions: UdharoTransactionModel[];
  addCustomer: (customer: Omit<CustomerModel, 'id' | 'shopId' | 'totalDue' | 'totalPurchases' | 'createdAt'>) => CustomerModel;
  updateCustomer: (id: string, updates: Partial<CustomerModel>) => void;
  recordRepayment: (customerId: string, amount: number, paymentMethod: string, notes?: string) => void;

  // Sales & POS Cart
  sales: SaleModel[];
  cart: SaleItemModel[];
  addToCart: (product: ProductModel, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQty: (productId: string, quantity: number) => void;
  updateCartItemDiscount: (productId: string, discount: number) => void;
  clearCart: () => void;
  completeSale: (saleData: {
    paymentMethod: PaymentMethod;
    paidAmount: number;
    dueAmount: number;
    vatRate: number;
    discount: number;
    customerName?: string;
    customerPhone?: string;
    customerAddress?: string;
    customerId?: string;
  }) => SaleModel;
  cancelSale: (saleId: string, reason: string) => void;

  // Suppliers
  suppliers: SupplierModel[];
  addSupplier: (supplier: Omit<SupplierModel, 'id' | 'shopId' | 'createdAt'>) => void;
  updateSupplier: (id: string, updates: Partial<SupplierModel>) => void;
  deleteSupplier: (id: string) => void;

  // Expenses
  expenses: ExpenseModel[];
  addExpense: (expense: Omit<ExpenseModel, 'id' | 'shopId' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;

  // Staff
  staff: StaffMemberModel[];
  addStaff: (staffMember: Omit<StaffMemberModel, 'id' | 'shopId' | 'joinedAt'>) => void;
  toggleStaffStatus: (id: string) => void;

  // Settings
  paymentQR: PaymentQRModel;
  updatePaymentQR: (updates: Partial<PaymentQRModel>) => void;
  printerSettings: PrinterSettingsModel;
  updatePrinterSettings: (updates: Partial<PrinterSettingsModel>) => void;

  // Sync / Offline & Reset
  isOnline: boolean;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANGUAGE: 'mp_lang',
  PRIVACY: 'mp_privacy',
  THEME: 'mp_theme',
  SHOP: 'mp_shop',
  PRODUCTS: 'mp_products',
  CUSTOMERS: 'mp_customers',
  UDHARO_TXNS: 'mp_udharo_txns',
  SALES: 'mp_sales',
  SUPPLIERS: 'mp_suppliers',
  EXPENSES: 'mp_expenses',
  STAFF: 'mp_staff',
  PAYMENT_QR: 'mp_qr',
  PRINTER: 'mp_printer',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [language, setLanguageState] = useState<Language>('en');
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isOnline] = useState(true);

  const [user, setUser] = useState<UserModel | null>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  const [hasShop, setHasShop] = useState<boolean>(false);
  const [shop, setShop] = useState<ShopModel>(initialShop);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [udharoTransactions, setUdharoTransactions] = useState<UdharoTransactionModel[]>([]);
  const [sales, setSales] = useState<SaleModel[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
  const [expenses, setExpenses] = useState<ExpenseModel[]>([]);
  const [staff, setStaff] = useState<StaffMemberModel[]>([]);
  const [paymentQR, setPaymentQR] = useState<PaymentQRModel>(initialPaymentQR);
  const [printerSettings, setPrinterSettings] = useState<PrinterSettingsModel>(initialPrinterSettings);

  // Cart state
  const [cart, setCart] = useState<SaleItemModel[]>([]);

  // Load from local storage on client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
      if (savedLang && (savedLang === 'en' || savedLang === 'ne')) setLanguageState(savedLang);

      const savedPrivacy = localStorage.getItem(STORAGE_KEYS.PRIVACY);
      if (savedPrivacy !== null) setIsPrivacyMode(savedPrivacy === 'true');

      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark';
      if (savedTheme) setTheme(savedTheme);

      // Auto-purge any stale demo products from localStorage if found
      const savedProductsStr = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProductsStr) {
        try {
          const parsed = JSON.parse(savedProductsStr);
          const hasDemo = Array.isArray(parsed) && parsed.some((p: any) => p.id === 'prod_1' || p.name?.includes('Wai Wai'));
          if (hasDemo) {
            localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
            localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
            localStorage.removeItem(STORAGE_KEYS.UDHARO_TXNS);
            localStorage.removeItem(STORAGE_KEYS.SALES);
            localStorage.removeItem(STORAGE_KEYS.SUPPLIERS);
            localStorage.removeItem(STORAGE_KEYS.EXPENSES);
            localStorage.removeItem(STORAGE_KEYS.STAFF);
            localStorage.removeItem(STORAGE_KEYS.SHOP);
          } else if (Array.isArray(parsed)) {
            setProducts(parsed);
          }
        } catch {}
      }

      const savedShop = localStorage.getItem(STORAGE_KEYS.SHOP);
      if (savedShop) {
        try {
          const parsedShop = JSON.parse(savedShop);
          if (
            parsedShop &&
            parsedShop.name &&
            parsedShop.name !== 'My Store' &&
            parsedShop.name !== 'Mero Pasal Kirana & General Store' &&
            parsedShop.id &&
            parsedShop.id !== 'shop_001'
          ) {
            setShop(parsedShop);
            setHasShop(true);
          } else {
            localStorage.removeItem(STORAGE_KEYS.SHOP);
          }
        } catch {}
      }

      const savedCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (savedCustomers) {
        try {
          const parsed = JSON.parse(savedCustomers);
          if (Array.isArray(parsed) && !parsed.some((c: any) => c.id === 'cust_1')) {
            setCustomers(parsed);
          }
        } catch {}
      }

      const savedUdharoTx = localStorage.getItem(STORAGE_KEYS.UDHARO_TXNS);
      if (savedUdharoTx) {
        try {
          const parsed = JSON.parse(savedUdharoTx);
          if (Array.isArray(parsed) && !parsed.some((t: any) => t.id === 'tx_1')) {
            setUdharoTransactions(parsed);
          }
        } catch {}
      }

      const savedSales = localStorage.getItem(STORAGE_KEYS.SALES);
      if (savedSales) {
        try {
          const parsed = JSON.parse(savedSales);
          if (Array.isArray(parsed) && !parsed.some((s: any) => s.id === 'sale_101')) {
            setSales(parsed);
          }
        } catch {}
      }

      const savedSuppliers = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      if (savedSuppliers) {
        try {
          const parsed = JSON.parse(savedSuppliers);
          if (Array.isArray(parsed) && !parsed.some((s: any) => s.id === 'supp_1')) {
            setSuppliers(parsed);
          }
        } catch {}
      }

      const savedExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (savedExpenses) {
        try {
          const parsed = JSON.parse(savedExpenses);
          if (Array.isArray(parsed) && !parsed.some((e: any) => e.id === 'exp_1')) {
            setExpenses(parsed);
          }
        } catch {}
      }

      const savedStaff = localStorage.getItem(STORAGE_KEYS.STAFF);
      if (savedStaff) {
        try {
          const parsed = JSON.parse(savedStaff);
          if (Array.isArray(parsed) && !parsed.some((m: any) => m.id === 'staff_1')) {
            setStaff(parsed);
          }
        } catch {}
      }

      const savedQr = localStorage.getItem(STORAGE_KEYS.PAYMENT_QR);
      if (savedQr) setPaymentQR(JSON.parse(savedQr));

      const savedPrinter = localStorage.getItem(STORAGE_KEYS.PRINTER);
      if (savedPrinter) setPrinterSettings(JSON.parse(savedPrinter));
    } catch {
      // Ignore
    }

    // ── FIREBASE REALTIME CLOUD SYNC (FIRESTORE & RTDB) ──
    const unsubs: (() => void)[] = [];

    try {
      // 1. Listen to Cloud Firestore for Shop Profile & Settings
      const shopRef = doc(db, 'shops', 'main_shop');
      unsubs.push(
        onSnapshot(
          shopRef,
          (snap) => {
            if (snap.exists()) {
              const remoteShop = snap.data() as ShopModel;
              setShop((curr) => ({ ...curr, ...remoteShop }));
            }
          },
          (err) => console.warn('Firestore shop sync notice:', err.message)
        )
      );

      // 2. Listen to Cloud Firestore for Products
      const productsCol = collection(db, 'products');
      unsubs.push(
        onSnapshot(
          productsCol,
          (snap) => {
            if (!snap.empty) {
              const list: ProductModel[] = [];
              snap.forEach((d) => {
                const data = d.data() as ProductModel;
                if (data.id !== 'prod_1' && !data.name?.includes('Wai Wai')) {
                  list.push(data);
                }
              });
              setProducts(list);
            } else {
              setProducts([]);
            }
          },
          (err) => console.warn('Firestore products sync notice:', err.message)
        )
      );

      // 3. Listen to Cloud Firestore for Customers
      const customersCol = collection(db, 'customers');
      unsubs.push(
        onSnapshot(
          customersCol,
          (snap) => {
            if (!snap.empty) {
              const list: CustomerModel[] = [];
              snap.forEach((d) => {
                const data = d.data() as CustomerModel;
                if (data.id !== 'cust_1') {
                  list.push(data);
                }
              });
              setCustomers(list);
            } else {
              setCustomers([]);
            }
          },
          (err) => console.warn('Firestore customers sync notice:', err.message)
        )
      );

      // 4. Listen to Cloud Firestore for Sales
      const salesCol = collection(db, 'sales');
      unsubs.push(
        onSnapshot(
          salesCol,
          (snap) => {
            if (!snap.empty) {
              const list: SaleModel[] = [];
              snap.forEach((d) => {
                const data = d.data() as SaleModel;
                if (data.id !== 'sale_101') {
                  list.push(data);
                }
              });
              list.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
              setSales(list);
            } else {
              setSales([]);
            }
          },
          (err) => console.warn('Firestore sales sync notice:', err.message)
        )
      );

      // 5. Listen to Cloud Firestore for Udharo Transactions
      const udharoCol = collection(db, 'udharo_txns');
      unsubs.push(
        onSnapshot(
          udharoCol,
          (snap) => {
            if (!snap.empty) {
              const list: UdharoTransactionModel[] = [];
              snap.forEach((d) => {
                const data = d.data() as UdharoTransactionModel;
                if (data.id !== 'tx_1' && data.id !== 'tx_2') {
                  list.push(data);
                }
              });
              list.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
              setUdharoTransactions(list);
            } else {
              setUdharoTransactions([]);
            }
          },
          (err) => console.warn('Firestore udharo sync notice:', err.message)
        )
      );

      // 6. Listen to Cloud Firestore for Expenses
      const expensesCol = collection(db, 'expenses');
      unsubs.push(
        onSnapshot(
          expensesCol,
          (snap) => {
            if (!snap.empty) {
              const list: ExpenseModel[] = [];
              snap.forEach((d) => {
                const data = d.data() as ExpenseModel;
                if (data.id !== 'exp_1' && data.id !== 'exp_2') {
                  list.push(data);
                }
              });
              list.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
              setExpenses(list);
            } else {
              setExpenses([]);
            }
          },
          (err) => console.warn('Firestore expenses sync notice:', err.message)
        )
      );

      // 7. Listen to Cloud Firestore for Suppliers
      const suppliersCol = collection(db, 'suppliers');
      unsubs.push(
        onSnapshot(
          suppliersCol,
          (snap) => {
            if (!snap.empty) {
              const list: SupplierModel[] = [];
              snap.forEach((d) => {
                const data = d.data() as SupplierModel;
                if (data.id !== 'supp_1' && data.id !== 'supp_2') {
                  list.push(data);
                }
              });
              setSuppliers(list);
            } else {
              setSuppliers([]);
            }
          },
          (err) => console.warn('Firestore suppliers sync notice:', err.message)
        )
      );

      // 8. Listen to Realtime Database for ultra-low latency updates
      const rtdbShopRef = ref(rtdb, 'shops/main_shop');
      const rtdbUnsub = onValue(
        rtdbShopRef,
        (snap) => {
          const val = snap.val();
          if (val) {
            setShop((curr) => ({ ...curr, ...val }));
          }
        },
        (err) => console.warn('Realtime Database listener notice:', err.message)
      );
      unsubs.push(() => {
        if (typeof rtdbUnsub === 'function') rtdbUnsub();
      });

      // 9. Listen to Real Firebase Auth state & auto-resolve shop matching Flutter
      const authUnsub = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const userObj: UserModel = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || '',
            phoneNumber: fbUser.phoneNumber || '',
            shopId: '',
            role: 'owner',
            createdAt: new Date().toISOString(),
          };

          let foundShop = false;

          try {
            // Check user doc in users/{uid}
            const uDoc = await getDoc(doc(db, 'users', fbUser.uid));
            if (uDoc.exists()) {
              const uData = uDoc.data();
              if (uData.currentShopId) userObj.shopId = uData.currentShopId;
              if (uData.role) userObj.role = uData.role;
              if (uData.name) userObj.displayName = uData.name;
              if (uData.phone) userObj.phoneNumber = uData.phone;
            }

            // Query shops collection where memberIds contains user.uid (same as Flutter watchShopByUserId)
            let resolvedShopDoc: any = null;
            if (userObj.shopId && userObj.shopId !== 'shop_001') {
              const directShopDoc = await getDoc(doc(db, 'shops', userObj.shopId));
              if (directShopDoc.exists()) resolvedShopDoc = directShopDoc;
            }

            if (!resolvedShopDoc) {
              const memberQuery = query(collection(db, 'shops'), where('memberIds', 'array-contains', fbUser.uid));
              const memberSnap = await getDocs(memberQuery);
              if (!memberSnap.empty) {
                // Prefer canonical shop ID over legacy placeholder IDs (main_shop, shop_001)
                resolvedShopDoc = memberSnap.docs.find(d => d.id !== 'main_shop' && d.id !== 'shop_001') || memberSnap.docs[0];
              } else {
                const ownerQuery = query(collection(db, 'shops'), where('ownerId', '==', fbUser.uid));
                const ownerSnap = await getDocs(ownerQuery);
                if (!ownerSnap.empty) {
                  resolvedShopDoc = ownerSnap.docs.find(d => d.id !== 'main_shop' && d.id !== 'shop_001') || ownerSnap.docs[0];
                }
              }
            }

            // Cleanup duplicate ghost docs (main_shop, shop_001) if owned by this user
            if (resolvedShopDoc && resolvedShopDoc.id !== 'main_shop' && resolvedShopDoc.id !== 'shop_001') {
              try {
                deleteDoc(doc(db, 'shops', 'main_shop')).catch(() => {});
                deleteDoc(doc(db, 'shops', 'shop_001')).catch(() => {});
              } catch {}
            }

            if (resolvedShopDoc) {
              foundShop = true;
              const sData = resolvedShopDoc.data();
              userObj.shopId = resolvedShopDoc.id;
              setShop((curr) => ({
                ...curr,
                ...sData,
                id: resolvedShopDoc.id,
                name: sData.shopName || sData.name || curr.name,
                shopName: sData.shopName || sData.name || curr.shopName,
                ownerName: sData.ownerName || curr.ownerName,
                phone: sData.phone || curr.phone,
                email: sData.email || curr.email,
                address: sData.address || curr.address,
                panVat: sData.panNumber || sData.panVat || curr.panVat,
                panNumber: sData.panNumber || sData.panVat || curr.panNumber,
                shopCode: sData.inviteCode || sData.shopCode || curr.shopCode,
                inviteCode: sData.inviteCode || sData.shopCode || curr.inviteCode,
              }));

              // Listen to Flutter scoped subcollection shops/{shopId}/products
              const scopedProductsCol = collection(db, 'shops', resolvedShopDoc.id, 'products');
              unsubs.push(
                onSnapshot(
                  scopedProductsCol,
                  (snap) => {
                    if (!snap.empty) {
                      const list: ProductModel[] = [];
                      snap.forEach((d) => {
                        const data = d.data() as ProductModel;
                        if (data.id !== 'prod_1' && !data.name?.includes('Wai Wai')) {
                          list.push(data);
                        }
                      });
                      if (list.length > 0) setProducts(list);
                    }
                  },
                  (err) => console.warn('Scoped products listener notice:', err.message)
                )
              );

              // Listen to Flutter scoped subcollection shops/{shopId}/sales
              const scopedSalesCol = collection(db, 'shops', resolvedShopDoc.id, 'sales');
              unsubs.push(
                onSnapshot(
                  scopedSalesCol,
                  (snap) => {
                    if (!snap.empty) {
                      const list: SaleModel[] = [];
                      snap.forEach((d) => {
                        const data = d.data() as SaleModel;
                        if (data.id !== 'sale_101') list.push(data);
                      });
                      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                      if (list.length > 0) setSales(list);
                    }
                  },
                  (err) => console.warn('Scoped sales listener notice:', err.message)
                )
              );
            } else {
              // New user for our server: no store exists yet
              foundShop = false;
              setShop((curr) => ({
                ...curr,
                id: '',
                name: '',
                shopName: '',
                ownerName: userObj.displayName || '',
                email: userObj.email || '',
                phone: userObj.phoneNumber || '',
              }));
            }
          } catch (err) {
            console.warn('Shop resolution notice:', err);
          }

          setHasShop(foundShop);
          setUser(userObj);
        } else {
          setHasShop(false);
          setUser(null);
        }
        setAuthInitialized(true);
      });
      unsubs.push(authUnsub);
    } catch (e) {
      console.warn('Firebase sync initialization notice:', e);
    }

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.SHOP && e.newValue) {
        try {
          setShop(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      unsubs.forEach((unsub) => {
        try {
          unsub();
        } catch {}
      });
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      if (hasShop && shop.name) {
        localStorage.setItem(STORAGE_KEYS.SHOP, JSON.stringify(shop));
      } else {
        localStorage.removeItem(STORAGE_KEYS.SHOP);
      }
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
      localStorage.setItem(STORAGE_KEYS.UDHARO_TXNS, JSON.stringify(udharoTransactions));
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
      localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
      localStorage.setItem(STORAGE_KEYS.PAYMENT_QR, JSON.stringify(paymentQR));
      localStorage.setItem(STORAGE_KEYS.PRINTER, JSON.stringify(printerSettings));
    } catch {
      // Ignore
    }
  }, [isMounted, shop, products, customers, udharoTransactions, sales, suppliers, expenses, staff, paymentQR, printerSettings]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch {
      // Ignore
    }
  }, []);

  const togglePrivacyMode = useCallback(() => {
    setIsPrivacyMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.PRIVACY, String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEYS.THEME, next);
        if (typeof document !== 'undefined') {
          if (next === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
          }
        }
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  // Sync theme with documentElement on mount & state changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    }
  }, [theme]);

  const t = translations[language];

  const formatCurrency = useCallback(
    (amount: number, hideSymbol = false) => {
      if (isPrivacyMode) {
        return hideSymbol ? '••••••' : `${t.currencySymbol} ••••••`;
      }
      const formatted = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);

      return hideSymbol ? formatted : `${t.currencySymbol} ${formatted}`;
    },
    [isPrivacyMode, t.currencySymbol]
  );

  // Cloud sync to both root and Flutter subcollection paths (shops/{shopId}/...)
  const syncToCloud = useCallback((collectionName: string, docId: string, data: any, merge = true) => {
    try {
      setDoc(doc(db, collectionName, docId), data, { merge }).catch(() => {});
      if (shop.id) {
        setDoc(doc(db, 'shops', shop.id, collectionName, docId), data, { merge }).catch(() => {});
      }
    } catch {}
  }, [shop.id]);

  const deleteFromCloud = useCallback((collectionName: string, docId: string) => {
    try {
      deleteDoc(doc(db, collectionName, docId)).catch(() => {});
      if (shop.id) {
        deleteDoc(doc(db, 'shops', shop.id, collectionName, docId)).catch(() => {});
      }
    } catch {}
  }, [shop.id]);

  const updateShop = useCallback((updates: Partial<ShopModel>) => {
    setShop((prev) => {
      const merged = { ...prev, ...updates };
      // Push live update to Firebase Firestore & Realtime Database
      try {
        const targetId = merged.id || shop.id;
        if (targetId) {
          setDoc(doc(db, 'shops', targetId), merged, { merge: true }).catch((e) => {
            console.warn('Firestore write warning:', e?.message || e);
          });
          setRtdb(ref(rtdb, `shops/${targetId}`), merged).catch(() => {});
        }
      } catch (err) {
        console.warn('Firebase updateShop error:', err);
      }
      return merged;
    });
  }, []);

  // Products CRUD
  const addProduct = useCallback(
    (productData: Omit<ProductModel, 'id' | 'shopId' | 'createdAt' | 'updatedAt'>) => {
      const newProduct: ProductModel = {
        ...productData,
        id: `prod_${Date.now()}`,
        shopId: shop.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      // Real Cloud Firestore (root & Flutter shops/{shopId}/products) & RTDB sync
      syncToCloud('products', newProduct.id, newProduct);
      setRtdb(ref(rtdb, `products/${newProduct.id}`), newProduct).catch(() => {});
      setRtdb(ref(rtdb, `shops/main_shop/products/${newProduct.id}`), newProduct).catch(() => {});
      return newProduct;
    },
    [shop.id, syncToCloud]
  );

  const updateProduct = useCallback((id: string, updates: Partial<ProductModel>) => {
    const updatedAt = new Date().toISOString();
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt } : p
      )
    );
    // Real Cloud Firestore & RTDB sync
    syncToCloud('products', id, { ...updates, updatedAt });
    setRtdb(ref(rtdb, `products/${id}`), updates).catch(() => {});
  }, [syncToCloud]);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Real Cloud Firestore & RTDB delete
    deleteFromCloud('products', id);
    removeRtdb(ref(rtdb, `products/${id}`)).catch(() => {});
  }, [deleteFromCloud]);

  const restockProduct = useCallback((id: string, quantityToAdd: number) => {
    const updatedAt = new Date().toISOString();
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newQty = Math.max(0, p.quantity + quantityToAdd);
          syncToCloud('products', id, { quantity: newQty, updatedAt });
          return {
            ...p,
            quantity: newQty,
            updatedAt,
          };
        }
        return p;
      })
    );
    audioFeedback.playScanBeep();
  }, [syncToCloud]);

  // Customers & Udharo
  const addCustomer = useCallback(
    (customerData: Omit<CustomerModel, 'id' | 'shopId' | 'totalDue' | 'totalPurchases' | 'createdAt'>) => {
      const newCustomer: CustomerModel = {
        ...customerData,
        id: `cust_${Date.now()}`,
        shopId: shop.id,
        totalDue: 0,
        totalPurchases: 0,
        createdAt: new Date().toISOString(),
      };
      setCustomers((prev) => [newCustomer, ...prev]);
      // Real Cloud Firestore sync (root & Flutter subcollection)
      syncToCloud('customers', newCustomer.id, newCustomer);
      return newCustomer;
    },
    [shop.id, syncToCloud]
  );

  const updateCustomer = useCallback((id: string, updates: Partial<CustomerModel>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    // Real Cloud Firestore sync
    syncToCloud('customers', id, updates);
  }, [syncToCloud]);

  const recordRepayment = useCallback(
    (customerId: string, amount: number, paymentMethod: string, notes?: string) => {
      const customer = customers.find((c) => c.id === customerId);
      if (!customer) return;

      const newDue = Math.max(0, customer.totalDue - amount);

      setCustomers((prev) =>
        prev.map((c) => (c.id === customerId ? { ...c, totalDue: newDue } : c))
      );

      const txn: UdharoTransactionModel = {
        id: `tx_${Date.now()}`,
        customerId,
        shopId: shop.id,
        type: 'payment_repaid',
        amount,
        balanceAfter: newDue,
        notes: notes || `Repayment received via ${paymentMethod}`,
        paymentMethod,
        createdAt: new Date().toISOString(),
      };

      setUdharoTransactions((prev) => [txn, ...prev]);
      // Real Cloud Firestore sync for repayment transaction and customer balance
      syncToCloud('udharo_txns', txn.id, txn);
      syncToCloud('customers', customerId, { totalDue: newDue });
      audioFeedback.playCashRegisterChime();
    },
    [customers, shop.id, syncToCloud]
  );

  // Cart Management
  const addToCart = useCallback((product: ProductModel, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + qty,
                total: (item.quantity + qty) * item.price - (item.discount || 0),
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity: qty,
          price: product.sellingPrice,
          purchasePrice: product.purchasePrice,
          unit: product.unit,
          discount: 0,
          total: qty * product.sellingPrice,
        },
      ];
    });
    audioFeedback.playScanBeep();
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateCartItemQty = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              total: quantity * item.price - (item.discount || 0),
            }
          : item
      )
    );
  }, [removeFromCart]);

  const updateCartItemDiscount = useCallback((productId: string, discount: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              discount: Math.max(0, discount),
              total: Math.max(0, item.quantity * item.price - Math.max(0, discount)),
            }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Complete Sale
  const completeSale = useCallback(
    (saleData: {
      paymentMethod: PaymentMethod;
      paidAmount: number;
      dueAmount: number;
      vatRate: number;
      discount: number;
      customerName?: string;
      customerPhone?: string;
      customerAddress?: string;
      customerId?: string;
    }) => {
      const subtotal = cart.reduce((acc, item) => acc + item.total, 0);
      const vatAmount = subtotal * (saleData.vatRate || 0);
      const grandTotal = Math.max(0, subtotal + vatAmount - saleData.discount);

      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(sales.length + 101).padStart(5, '0')}`;

      const newSale: SaleModel = {
        id: `sale_${Date.now()}`,
        shopId: shop.id,
        invoiceNumber,
        items: [...cart],
        subtotal,
        vatRate: saleData.vatRate,
        vatAmount,
        discount: saleData.discount,
        total: grandTotal,
        paymentMethod: saleData.paymentMethod,
        paidAmount: saleData.paidAmount,
        dueAmount: saleData.dueAmount,
        customerName: saleData.customerName || (saleData.customerId ? customers.find((c) => c.id === saleData.customerId)?.name : 'Walk-in Customer'),
        customerPhone: saleData.customerPhone,
        customerAddress: saleData.customerAddress,
        customerId: saleData.customerId,
        status: 'completed',
        billedByName: user?.displayName || shop.ownerName,
        billedByUid: user?.uid,
        createdAt: new Date().toISOString(),
      };

      // 1. Add to sales list & Cloud Firestore
      setSales((prev) => [newSale, ...prev]);
      syncToCloud('sales', newSale.id, newSale);
      setRtdb(ref(rtdb, `sales/${newSale.id}`), newSale).catch(() => {});
      setRtdb(ref(rtdb, `shops/main_shop/sales/${newSale.id}`), newSale).catch(() => {});

      // 2. Reduce product inventory & sync to Firestore
      setProducts((prev) =>
        prev.map((p) => {
          const cartItem = cart.find((item) => item.productId === p.id);
          if (cartItem) {
            const newQty = Math.max(0, p.quantity - cartItem.quantity);
            const updatedAt = new Date().toISOString();
            syncToCloud('products', p.id, { quantity: newQty, updatedAt });
            return {
              ...p,
              quantity: newQty,
              updatedAt,
            };
          }
          return p;
        })
      );

      // 3. If credit or partial credit, update customer Udharo ledger & Firestore
      if (saleData.dueAmount > 0 && saleData.customerId) {
        const customer = customers.find((c) => c.id === saleData.customerId);
        if (customer) {
          const newDue = customer.totalDue + saleData.dueAmount;
          const newPurchases = customer.totalPurchases + grandTotal;

          setCustomers((prev) =>
            prev.map((c) =>
              c.id === saleData.customerId
                ? {
                    ...c,
                    totalDue: newDue,
                    totalPurchases: newPurchases,
                    lastPurchaseDate: newSale.createdAt,
                  }
                : c
            )
          );
          syncToCloud('customers', saleData.customerId, {
            totalDue: newDue,
            totalPurchases: newPurchases,
            lastPurchaseDate: newSale.createdAt,
          });

          const udharoTxn: UdharoTransactionModel = {
            id: `tx_${Date.now()}`,
            customerId: saleData.customerId,
            shopId: shop.id,
            type: 'sale_credit',
            amount: saleData.dueAmount,
            balanceAfter: newDue,
            invoiceNumber,
            createdAt: newSale.createdAt,
          };
          setUdharoTransactions((prev) => [udharoTxn, ...prev]);
          syncToCloud('udharo_txns', udharoTxn.id, udharoTxn);
        }
      }

      // 4. Play sound & clear cart
      audioFeedback.playCashRegisterChime();
      setCart([]);

      return newSale;
    },
    [cart, customers, sales.length, shop.id, shop.ownerName, syncToCloud, user?.displayName, user?.uid]
  );

  const cancelSale = useCallback(
    (saleId: string, reason: string) => {
      const targetSale = sales.find((s) => s.id === saleId);
      if (!targetSale) return;

      const cancelledAt = new Date().toISOString();
      // 1. Mark sale as cancelled & sync to Firestore
      setSales((prev) =>
        prev.map((s) =>
          s.id === saleId
            ? {
                ...s,
                status: 'cancelled',
                isCancelled: true,
                cancellationReason: reason,
                cancelledAt,
              }
            : s
        )
      );
      syncToCloud('sales', saleId, {
        status: 'cancelled',
        isCancelled: true,
        cancellationReason: reason,
        cancelledAt,
      });

      // 2. Restock products back into inventory & Firestore
      setProducts((prev) =>
        prev.map((p) => {
          const saleItem = targetSale.items.find((item) => item.productId === p.id);
          if (saleItem) {
            const restockedQty = p.quantity + saleItem.quantity;
            const updatedAt = new Date().toISOString();
            syncToCloud('products', p.id, { quantity: restockedQty, updatedAt });
            return {
              ...p,
              quantity: restockedQty,
              updatedAt,
            };
          }
          return p;
        })
      );

      // 3. If it had due balance, reverse Udharo & Firestore
      if (targetSale.dueAmount > 0 && targetSale.customerId) {
        const customer = customers.find((c) => c.id === targetSale.customerId);
        if (customer) {
          const newDue = Math.max(0, customer.totalDue - targetSale.dueAmount);
          setCustomers((prev) =>
            prev.map((c) => (c.id === targetSale.customerId ? { ...c, totalDue: newDue } : c))
          );
          syncToCloud('customers', targetSale.customerId, { totalDue: newDue });
        }
      }

      audioFeedback.playErrorTone();
    },
    [customers, sales, syncToCloud]
  );

  // Suppliers CRUD
  const addSupplier = useCallback(
    (supplierData: Omit<SupplierModel, 'id' | 'shopId' | 'createdAt'>) => {
      const newSupplier: SupplierModel = {
        ...supplierData,
        id: `supp_${Date.now()}`,
        shopId: shop.id,
        createdAt: new Date().toISOString(),
      };
      setSuppliers((prev) => [newSupplier, ...prev]);
      syncToCloud('suppliers', newSupplier.id, newSupplier);
    },
    [shop.id, syncToCloud]
  );

  const updateSupplier = useCallback((id: string, updates: Partial<SupplierModel>) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    syncToCloud('suppliers', id, updates);
  }, [syncToCloud]);

  const deleteSupplier = useCallback((id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    deleteFromCloud('suppliers', id);
  }, [deleteFromCloud]);

  // Expenses CRUD
  const addExpense = useCallback(
    (expenseData: Omit<ExpenseModel, 'id' | 'shopId' | 'createdAt'>) => {
      const newExpense: ExpenseModel = {
        ...expenseData,
        id: `exp_${Date.now()}`,
        shopId: shop.id,
        createdAt: new Date().toISOString(),
      };
      setExpenses((prev) => [newExpense, ...prev]);
      syncToCloud('expenses', newExpense.id, newExpense);
      audioFeedback.playCashRegisterChime();
    },
    [shop.id, syncToCloud]
  );

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    deleteFromCloud('expenses', id);
  }, [deleteFromCloud]);

  // Staff
  const addStaff = useCallback(
    (staffData: Omit<StaffMemberModel, 'id' | 'shopId' | 'joinedAt'>) => {
      const newStaff: StaffMemberModel = {
        ...staffData,
        id: `staff_${Date.now()}`,
        shopId: shop.id,
        joinedAt: new Date().toISOString(),
      };
      setStaff((prev) => [newStaff, ...prev]);
      syncToCloud('staff', newStaff.id, newStaff);
    },
    [shop.id, syncToCloud]
  );

  const toggleStaffStatus = useCallback((id: string) => {
    setStaff((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, isActive: !m.isActive };
          syncToCloud('staff', id, { isActive: updated.isActive });
          return updated;
        }
        return m;
      })
    );
  }, [syncToCloud]);

  // Settings
  const updatePaymentQR = useCallback((updates: Partial<PaymentQRModel>) => {
    setPaymentQR((prev) => {
      const merged = { ...prev, ...updates };
      syncToCloud('shops', 'payment_qr', merged);
      return merged;
    });
  }, [syncToCloud]);

  const updatePrinterSettings = useCallback((updates: Partial<PrinterSettingsModel>) => {
    setPrinterSettings((prev) => {
      const merged = { ...prev, ...updates };
      syncToCloud('shops', 'printer_settings', merged);
      return merged;
    });
  }, [syncToCloud]);

  const resetToDemoData = useCallback(() => {
    setShop(initialShop);
    setProducts(initialProducts);
    setCustomers(initialCustomers);
    setSales(initialSales);
    setSuppliers(initialSuppliers);
    setExpenses(initialExpenses);
    setStaff(initialStaff);
    setPaymentQR(initialPaymentQR);
    setPrinterSettings(initialPrinterSettings);
    setCart([]);
    try {
      localStorage.clear();
    } catch {
      // Ignore
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    setUser(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isPrivacyMode,
        togglePrivacyMode,
        formatCurrency,
        theme,
        toggleTheme,
        user,
        authInitialized,
        hasShop,
        setHasShop,
        setUser,
        logout,
        shop,
        updateShop,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        restockProduct,
        customers,
        udharoTransactions,
        addCustomer,
        updateCustomer,
        recordRepayment,
        sales,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQty,
        updateCartItemDiscount,
        clearCart,
        completeSale,
        cancelSale,
        suppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        expenses,
        addExpense,
        deleteExpense,
        staff,
        addStaff,
        toggleStaffStatus,
        paymentQR,
        updatePaymentQR,
        printerSettings,
        updatePrinterSettings,
        isOnline,
        resetToDemoData,
      }}
    >
      <div className={theme === 'dark' ? 'dark' : ''}>{children}</div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
