import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { expenseService } from '../services/expenseService';
import { subscriptionService } from '../services/subscriptionService';
import { wishlistService } from '../services/wishlistService';
import { categoryService } from '../services/categoryService';
import { splitPaymentService } from '../services/splitPaymentService';
import { feedbackService } from '../services/feedbackService';
import { storageService } from '../services/storageService';

export interface Expense {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  paymentMethod: string;
  isRecurring?: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: string;
  nextPaymentDate: string;
  paymentMethod: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  priority: string;
}

export interface CategoryCap {
  category: string;
  limit: number;
}

export interface SplitPayment {
  id: string;
  name: string;
  totalAmount: number;
  friends: { name: string; amount: number }[];
  date: string;
}

interface BudgetContextType {
  // Auth
  user: any;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
  
  // Budget
  monthlyBudget: number;
  setMonthlyBudget: (budget: number) => Promise<void>;
  
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  getTotalSpent: () => number;
  getCategorySpending: (category: string) => number;
  getSavings: () => number;
  
  // Subscriptions
  subscriptions: Subscription[];
  addSubscription: (subscription: Omit<Subscription, 'id'>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  
  // Wishlist
  wishlist: WishlistItem[];
  addWishlistItem: (item: Omit<WishlistItem, 'id'>) => Promise<void>;
  deleteWishlistItem: (id: string) => Promise<void>;
  
  // Categories
  categoryCaps: CategoryCap[];
  setCategoryCap: (category: string, limit: number) => Promise<void>;
  customCategories: string[];
  addCustomCategory: (category: string) => Promise<void>;
  deleteCustomCategory: (category: string) => Promise<void>;
  
  // Split Payments
  splitPayments: SplitPayment[];
  addSplitPayment: (payment: Omit<SplitPayment, 'id'>) => Promise<void>;
  
  // Feedback
  submitFeedback: (type: string, message?: string) => Promise<void>;
  
  // Storage
  uploadTransactionPhoto: (file: File) => Promise<any>;
  getTransactionPhotos: () => Promise<any[]>;
  deleteTransactionPhoto: (id: string, fileName: string) => Promise<boolean>;
  exportDataToCSV: () => Promise<void>;
  
  // Loading states
  loading: boolean;
  refreshData: () => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within BudgetProvider');
  }
  return context;
};

export const SupabaseBudgetProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [monthlyBudget, setMonthlyBudgetState] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [categoryCaps, setCategoryCaps] = useState<CategoryCap[]>([]);
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { profile } = await authService.getCurrentUser();
          if (profile) {
            setUser(session.user);
            setIsAuthenticated(true);
            setMonthlyBudgetState(profile.monthly_budget || 0);
            await loadUserData();
          }
        }
      } catch (error) {
        console.error('Init auth error:', error);
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { profile } = await authService.getCurrentUser();
        if (profile) {
          setUser(session.user);
          setIsAuthenticated(true);
          setMonthlyBudgetState(profile.monthly_budget || 0);
          await loadUserData();
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        clearData();
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Load all user data
  const loadUserData = async () => {
    try {
      const [
        expensesData,
        subscriptionsData,
        wishlistData,
        categoryCapsData,
        splitPaymentsData,
        customCategoriesData
      ] = await Promise.all([
        expenseService.getExpenses(),
        subscriptionService.getSubscriptions(),
        wishlistService.getWishlistItems(),
        categoryService.getCategoryCaps(),
        splitPaymentService.getSplitPayments(),
        categoryService.getCustomCategories()
      ]);

      setExpenses(expensesData);
      setSubscriptions(subscriptionsData);
      setWishlist(wishlistData);
      setCategoryCaps(categoryCapsData);
      setSplitPayments(splitPaymentsData);
      setCustomCategories(customCategoriesData);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  // Clear all data
  const clearData = () => {
    setMonthlyBudgetState(0);
    setExpenses([]);
    setSubscriptions([]);
    setWishlist([]);
    setCategoryCaps([]);
    setSplitPayments([]);
    setCustomCategories([]);
  };

  // Auth methods
  const signIn = async (email: string, password: string): Promise<boolean> => {
    const { user, error } = await authService.signIn(email, password);
    return !error && !!user;
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    const { user, error } = await authService.signUp(email, password, name);
    return !error && !!user;
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    const { data, error } = await authService.signInWithGoogle();
    return !error && !!data;
  };

  const signOut = async (): Promise<void> => {
    await authService.signOut();
  };

  // Budget methods
  const setMonthlyBudget = async (budget: number): Promise<void> => {
    await authService.updateProfile({ monthly_budget: budget });
    setMonthlyBudgetState(budget);
    toast.success(`Monthly budget set to ₹${budget}`);
  };

  // Expense methods
  const addExpense = async (expense: Omit<Expense, 'id'>): Promise<void> => {
    const newExpense = await expenseService.addExpense(expense);
    if (newExpense) {
      setExpenses(prev => [newExpense, ...prev]);
      
      // Check category cap
      const categorySpending = getCategorySpending(expense.category) + expense.amount;
      const cap = categoryCaps.find(c => c.category === expense.category);
      
      if (cap && categorySpending > cap.limit) {
        toast.error(`${expense.category} limit exceeded! You've spent ₹${categorySpending} of ₹${cap.limit}`, {
          duration: 5000,
        });
      }

      // Check if can afford wishlist items
      const savings = getSavings() - expense.amount;
      wishlist.forEach(item => {
        if (savings >= item.price) {
          toast.success(`Good news! Your savings can buy ${item.name} 🎉`, {
            duration: 5000,
          });
        }
      });
    }
  };

  const deleteExpense = async (id: string): Promise<void> => {
    const success = await expenseService.deleteExpense(id);
    if (success) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    }
  };

  // Subscription methods
  const addSubscription = async (subscription: Omit<Subscription, 'id'>): Promise<void> => {
    const newSubscription = await subscriptionService.addSubscription(subscription);
    if (newSubscription) {
      setSubscriptions(prev => [newSubscription, ...prev]);
    }
  };

  const deleteSubscription = async (id: string): Promise<void> => {
    const success = await subscriptionService.deleteSubscription(id);
    if (success) {
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    }
  };

  // Wishlist methods
  const addWishlistItem = async (item: Omit<WishlistItem, 'id'>): Promise<void> => {
    const newItem = await wishlistService.addWishlistItem(item);
    if (newItem) {
      setWishlist(prev => [newItem, ...prev]);
      
      // Check if can already afford it
      const savings = getSavings();
      if (savings >= item.price) {
        toast.success(`Good news! Your savings can buy ${item.name} 🎉`, {
          duration: 5000,
        });
      }
    }
  };

  const deleteWishlistItem = async (id: string): Promise<void> => {
    const success = await wishlistService.deleteWishlistItem(id);
    if (success) {
      setWishlist(prev => prev.filter(item => item.id !== id));
    }
  };

  // Category methods
  const setCategoryCap = async (category: string, limit: number): Promise<void> => {
    const success = await categoryService.setCategoryCap(category, limit);
    if (success) {
      setCategoryCaps(prev => {
        const existing = prev.find(c => c.category === category);
        if (existing) {
          return prev.map(c => c.category === category ? { category, limit } : c);
        }
        return [...prev, { category, limit }];
      });
    }
  };

  const addCustomCategory = async (category: string): Promise<void> => {
    if (customCategories.includes(category)) {
      toast.error('Category already exists');
      return;
    }
    const success = await categoryService.addCustomCategory(category);
    if (success) {
      setCustomCategories(prev => [...prev, category]);
    }
  };

  const deleteCustomCategory = async (category: string): Promise<void> => {
    const success = await categoryService.deleteCustomCategory(category);
    if (success) {
      setCustomCategories(prev => prev.filter(cat => cat !== category));
    }
  };

  // Split payment methods
  const addSplitPayment = async (payment: Omit<SplitPayment, 'id'>): Promise<void> => {
    const newPayment = await splitPaymentService.addSplitPayment(payment);
    if (newPayment) {
      setSplitPayments(prev => [newPayment, ...prev]);
    }
  };

  // Feedback methods
  const submitFeedback = async (type: string, message?: string): Promise<void> => {
    await feedbackService.submitFeedback(type, message);
  };

  // Storage methods
  const uploadTransactionPhoto = async (file: File) => {
    return await storageService.uploadTransactionPhoto(file);
  };

  const getTransactionPhotos = async () => {
    return await storageService.getTransactionPhotos();
  };

  const deleteTransactionPhoto = async (id: string, fileName: string): Promise<boolean> => {
    return await storageService.deleteTransactionPhoto(id, fileName);
  };

  const exportDataToCSV = async (): Promise<void> => {
    await storageService.exportDataToCSV();
  };

  // Calculation methods
  const getTotalSpent = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getCategorySpending = (category: string) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return (
          exp.category === category &&
          expDate.getMonth() === currentMonth &&
          expDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getSavings = () => {
    return monthlyBudget - getTotalSpent();
  };

  const refreshData = async (): Promise<void> => {
    await loadUserData();
  };

  return (
    <BudgetContext.Provider
      value={{
        // Auth
        user,
        isAuthenticated,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        
        // Budget
        monthlyBudget,
        setMonthlyBudget,
        
        // Expenses
        expenses,
        addExpense,
        deleteExpense,
        getTotalSpent,
        getCategorySpending,
        getSavings,
        
        // Subscriptions
        subscriptions,
        addSubscription,
        deleteSubscription,
        
        // Wishlist
        wishlist,
        addWishlistItem,
        deleteWishlistItem,
        
        // Categories
        categoryCaps,
        setCategoryCap,
        customCategories,
        addCustomCategory,
        deleteCustomCategory,
        
        // Split Payments
        splitPayments,
        addSplitPayment,
        
        // Feedback
        submitFeedback,
        
        // Storage
        uploadTransactionPhoto,
        getTransactionPhotos,
        deleteTransactionPhoto,
        exportDataToCSV,
        
        // Loading
        loading,
        refreshData,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};