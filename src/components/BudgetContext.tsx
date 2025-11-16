import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';

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
  monthlyBudget: number;
  setMonthlyBudget: (budget: number) => void;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  subscriptions: Subscription[];
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  deleteSubscription: (id: string) => void;
  wishlist: WishlistItem[];
  addWishlistItem: (item: Omit<WishlistItem, 'id'>) => void;
  deleteWishlistItem: (id: string) => void;
  categoryCaps: CategoryCap[];
  setCategoryCap: (category: string, limit: number) => void;
  splitPayments: SplitPayment[];
  addSplitPayment: (payment: Omit<SplitPayment, 'id'>) => void;
  getTotalSpent: () => number;
  getCategorySpending: (category: string) => number;
  getSavings: () => number;
  customCategories: string[];
  addCustomCategory: (category: string) => void;
  deleteCustomCategory: (category: string) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within BudgetProvider');
  }
  return context;
};

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [monthlyBudget, setMonthlyBudgetState] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [categoryCaps, setCategoryCaps] = useState<CategoryCap[]>([]);
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedBudget = localStorage.getItem('monthlyBudget');
    const savedExpenses = localStorage.getItem('expenses');
    const savedSubscriptions = localStorage.getItem('subscriptions');
    const savedWishlist = localStorage.getItem('wishlist');
    const savedCategoryCaps = localStorage.getItem('categoryCaps');
    const savedSplitPayments = localStorage.getItem('splitPayments');
    const savedCustomCategories = localStorage.getItem('customCategories');

    if (savedBudget) setMonthlyBudgetState(JSON.parse(savedBudget));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedSubscriptions) setSubscriptions(JSON.parse(savedSubscriptions));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedCategoryCaps) setCategoryCaps(JSON.parse(savedCategoryCaps));
    if (savedSplitPayments) setSplitPayments(JSON.parse(savedSplitPayments));
    if (savedCustomCategories) setCustomCategories(JSON.parse(savedCustomCategories));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('monthlyBudget', JSON.stringify(monthlyBudget));
  }, [monthlyBudget]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('categoryCaps', JSON.stringify(categoryCaps));
  }, [categoryCaps]);

  useEffect(() => {
    localStorage.setItem('splitPayments', JSON.stringify(splitPayments));
  }, [splitPayments]);

  useEffect(() => {
    localStorage.setItem('customCategories', JSON.stringify(customCategories));
  }, [customCategories]);

  // Check subscription alerts
  useEffect(() => {
    const checkSubscriptions = () => {
      subscriptions.forEach((sub) => {
        const nextDate = new Date(sub.nextPaymentDate);
        const today = new Date();
        const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntil <= 2 && daysUntil >= 0) {
          toast.warning(`${sub.name} payment due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`, {
            duration: 5000,
          });
        }
      });
    };

    if (subscriptions.length > 0) {
      checkSubscriptions();
    }
  }, [subscriptions]);

  const setMonthlyBudget = (budget: number) => {
    setMonthlyBudgetState(budget);
    toast.success(`Monthly budget set to ₹${budget}`);
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    setExpenses((prev) => [newExpense, ...prev]);
    
    // Check category cap
    const categorySpending = getCategorySpending(expense.category) + expense.amount;
    const cap = categoryCaps.find((c) => c.category === expense.category);
    
    if (cap && categorySpending > cap.limit) {
      toast.error(`${expense.category} limit exceeded! You've spent ₹${categorySpending} of ₹${cap.limit}`, {
        duration: 5000,
      });
    }

    // Check if can afford wishlist items
    const savings = getSavings() - expense.amount;
    wishlist.forEach((item) => {
      if (savings >= item.price) {
        toast.success(`Good news! Your savings can buy ${item.name} 🎉`, {
          duration: 5000,
        });
      }
    });

    toast.success('Expense added successfully');
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    toast.success('Expense deleted');
  };

  const addSubscription = (subscription: Omit<Subscription, 'id'>) => {
    const newSubscription = { ...subscription, id: Date.now().toString() };
    setSubscriptions((prev) => [newSubscription, ...prev]);
    toast.success('Subscription added successfully');
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
    toast.success('Subscription deleted');
  };

  const addWishlistItem = (item: Omit<WishlistItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    setWishlist((prev) => [newItem, ...prev]);
    
    // Check if can already afford it
    const savings = getSavings();
    if (savings >= item.price) {
      toast.success(`Good news! Your savings can buy ${item.name} 🎉`, {
        duration: 5000,
      });
    }
    
    toast.success('Item added to wishlist');
  };

  const deleteWishlistItem = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
    toast.success('Item removed from wishlist');
  };

  const setCategoryCap = (category: string, limit: number) => {
    setCategoryCaps((prev) => {
      const existing = prev.find((c) => c.category === category);
      if (existing) {
        return prev.map((c) => (c.category === category ? { category, limit } : c));
      }
      return [...prev, { category, limit }];
    });
    toast.success(`${category} limit set to ₹${limit}`);
  };

  const addSplitPayment = (payment: Omit<SplitPayment, 'id'>) => {
    const newPayment = { ...payment, id: Date.now().toString() };
    setSplitPayments((prev) => [newPayment, ...prev]);
    toast.success('Split payment added successfully');
  };

  const addCustomCategory = (category: string) => {
    if (customCategories.includes(category)) {
      toast.error('Category already exists');
      return;
    }
    setCustomCategories((prev) => [...prev, category]);
    toast.success(`${category} category added`);
  };

  const deleteCustomCategory = (category: string) => {
    setCustomCategories((prev) => prev.filter((cat) => cat !== category));
    toast.success(`${category} category removed`);
  };

  const getTotalSpent = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter((exp) => {
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
      .filter((exp) => {
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

  return (
    <BudgetContext.Provider
      value={{
        monthlyBudget,
        setMonthlyBudget,
        expenses,
        addExpense,
        deleteExpense,
        subscriptions,
        addSubscription,
        deleteSubscription,
        wishlist,
        addWishlistItem,
        deleteWishlistItem,
        categoryCaps,
        setCategoryCap,
        splitPayments,
        addSplitPayment,
        getTotalSpent,
        getCategorySpending,
        getSavings,
        customCategories,
        addCustomCategory,
        deleteCustomCategory,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
