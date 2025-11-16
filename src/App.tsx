import { useState, useEffect } from 'react';
import { BudgetProvider } from './components/BudgetContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import CategoryQuickAdd from './components/CategoryQuickAdd';
import CategoryDetail from './components/CategoryDetail';
import Analytics from './components/Analytics';
import Subscriptions from './components/Subscriptions';
import WeeklyReport from './components/WeeklyReport';
import SplitPayments from './components/SplitPayments';
import CategoryCaps from './components/CategoryCaps';
import Wishlist from './components/Wishlist';
import Feedback from './components/Feedback';
import AIAdvisor from './components/AIAdvisor';
import DataBackup from './components/DataBackup';
import Navigation from './components/Navigation';
import { Toaster } from 'sonner@2.0.3';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Check authentication status
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    }
    
    // Handle hash navigation for Add Expense button
    const handleHashChange = () => {
      if (window.location.hash === '#add-expense') {
        setCurrentPage('add-expense');
        window.location.hash = '';
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on mount
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setCurrentPage('landing');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage('category-detail');
  };

  const renderPage = () => {
    if (!isAuthenticated && currentPage !== 'landing') {
      return <LandingPage onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'landing':
        return <LandingPage onLogin={handleLogin} />;
      case 'dashboard':
        return <Dashboard />;
      case 'add-expense':
        return <AddExpense onBack={() => setCurrentPage('dashboard')} />;
      case 'categories':
        return <CategoryQuickAdd onCategorySelect={handleCategorySelect} />;
      case 'category-detail':
        return <CategoryDetail category={selectedCategory} onBack={() => setCurrentPage('categories')} />;
      case 'analytics':
        return <Analytics />;
      case 'subscriptions':
        return <Subscriptions />;
      case 'weekly-report':
        return <WeeklyReport />;
      case 'split-payments':
        return <SplitPayments />;
      case 'category-caps':
        return <CategoryCaps />;
      case 'wishlist':
        return <Wishlist />;
      case 'feedback':
        return <Feedback />;
      case 'ai-advisor':
        return <AIAdvisor />;
      case 'data-backup':
        return <DataBackup />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <BudgetProvider>
      <Toaster 
        theme="dark" 
        position="top-center"
        toastOptions={{
          style: {
            background: '#000',
            border: '1px solid #EAB308',
            color: '#F9FAFB',
          },
        }}
      />
      <div className="min-h-screen bg-black text-gray-50">
        {renderPage()}
        {isAuthenticated && currentPage !== 'landing' && (
          <Navigation currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />
        )}
      </div>
    </BudgetProvider>
  );
}