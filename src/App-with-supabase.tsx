import { useState, useEffect } from 'react';
import { SupabaseBudgetProvider, useBudget } from './components/SupabaseBudgetContext';
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
import AuthCallback from './components/AuthCallback';
import { Toaster } from 'sonner@2.0.3';

function AppContent() {
  const { isAuthenticated, signOut, loading } = useBudget();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('landing');
    }
  }, [isAuthenticated]);

  // Handle hash navigation for Add Expense button
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#add-expense' && isAuthenticated) {
        setCurrentPage('add-expense');
        window.location.hash = '';
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on mount
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage('category-detail');
  };

  const renderPage = () => {
    // Handle auth callback
    if (window.location.pathname === '/auth/callback') {
      return <AuthCallback />;
    }

    if (!isAuthenticated && currentPage !== 'landing') {
      return <LandingPage onLogin={() => {}} />;
    }

    switch (currentPage) {
      case 'landing':
        return <LandingPage onLogin={() => {}} />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-yellow-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
          <Navigation 
            currentPage={currentPage} 
            onNavigate={setCurrentPage} 
            onLogout={signOut} 
          />
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <SupabaseBudgetProvider>
      <AppContent />
    </SupabaseBudgetProvider>
  );
}