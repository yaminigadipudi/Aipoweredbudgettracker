import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Plus, 
  Grid3x3, 
  BarChart3, 
  CreditCard, 
  Calendar,
  Users,
  Target,
  Star,
  MessageCircle,
  Bot,
  Database,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function Navigation({ currentPage, onNavigate, onLogout }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'add-expense', icon: Plus, label: 'Add Expense' },
    { id: 'categories', icon: Grid3x3, label: 'Categories' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { id: 'weekly-report', icon: Calendar, label: 'Weekly Report' },
    { id: 'split-payments', icon: Users, label: 'Split Payments' },
    { id: 'category-caps', icon: Target, label: 'Category Caps' },
    { id: 'wishlist', icon: Star, label: 'Wishlist' },
    { id: 'feedback', icon: MessageCircle, label: 'Feedback' },
    { id: 'ai-advisor', icon: Bot, label: 'AI Advisor' },
    { id: 'data-backup', icon: Database, label: 'Data & Backup' },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-yellow-500 text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.5)] lg:hidden"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Mobile Menu */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isMenuOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-full w-80 bg-neutral-950 border-l border-yellow-500/30 z-40 lg:hidden overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-yellow-500">Menu</h2>
            <button onClick={() => setIsMenuOpen(false)} className="text-yellow-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'bg-yellow-500 text-black'
                    : 'text-gray-400 hover:bg-yellow-500/10 hover:text-yellow-500'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Desktop Bottom Navigation */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="hidden lg:block fixed bottom-0 left-0 right-0 bg-black border-t border-yellow-500/30 z-30"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {menuItems.slice(0, 6).map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'text-yellow-500'
                    : 'text-gray-400 hover:text-yellow-500'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}

            {/* More Menu */}
            <div className="relative group">
              <button className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-400 hover:text-yellow-500 transition-all">
                <Menu className="w-5 h-5" />
                <span className="text-xs">More</span>
              </button>

              {/* Dropdown */}
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-neutral-950 border border-yellow-500/30 rounded-lg shadow-[0_0_30px_rgba(234,179,8,0.2)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-2">
                  {menuItems.slice(6).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                        currentPage === item.id
                          ? 'bg-yellow-500 text-black'
                          : 'text-gray-400 hover:bg-yellow-500/10 hover:text-yellow-500'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all mt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
