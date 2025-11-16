import { motion } from 'motion/react';
import { useBudget } from './BudgetContext';
import { useState } from 'react';
import { Target, Edit2, Check } from 'lucide-react';
import { Input } from './ui/input';

const defaultCategories = [
  'Food',
  'Travel',
  'Shopping',
  'Rent',
  'Education',
  'Entertainment',
  'Health',
  'Subscriptions',
];

export default function CategoryCaps() {
  const { categoryCaps, setCategoryCap, getCategorySpending, customCategories } = useBudget();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [limitInput, setLimitInput] = useState('');

  // Combine default and custom categories
  const allCategories = [...defaultCategories, ...customCategories];

  const handleSaveLimit = (category: string) => {
    const limit = parseFloat(limitInput);
    if (!isNaN(limit) && limit > 0) {
      setCategoryCap(category, limit);
      setEditingCategory(null);
      setLimitInput('');
    }
  };

  const getCap = (category: string) => {
    return categoryCaps.find((c) => c.category === category)?.limit || 0;
  };

  const getPercentage = (category: string) => {
    const spent = getCategorySpending(category);
    const cap = getCap(category);
    return cap > 0 ? (spent / cap) * 100 : 0;
  };

  const getColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black pb-24 px-4 pt-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-gray-50">Category Caps</h1>
          <p className="text-yellow-500">Set spending limits for each category</p>
        </motion.div>

        {/* Categories Grid */}
        <div className="space-y-4">
          {allCategories.map((category, index) => {
            const spent = getCategorySpending(category);
            const cap = getCap(category);
            const percentage = getPercentage(category);
            const isEditing = editingCategory === category;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-black border border-yellow-500/30 rounded-lg p-6 hover:border-yellow-500 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black border border-yellow-500 flex items-center justify-center">
                      <Target className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-gray-50">{category}</p>
                      <p className="text-gray-400">
                        ₹{spent.toLocaleString()} / {cap > 0 ? `₹${cap.toLocaleString()}` : 'No limit'}
                      </p>
                    </div>
                  </div>

                  {!isEditing ? (
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setLimitInput(cap.toString());
                      }}
                      className="text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={limitInput}
                        onChange={(e) => setLimitInput(e.target.value)}
                        className="w-24 bg-neutral-950 border-yellow-500/30 text-gray-50"
                        placeholder="Limit"
                      />
                      <button
                        onClick={() => handleSaveLimit(category)}
                        className="text-yellow-500 hover:text-yellow-400"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {cap > 0 && (
                  <div>
                    <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full ${getColor(percentage)} transition-colors`}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-gray-400">{percentage.toFixed(1)}% used</p>
                      {percentage >= 100 && (
                        <p className="text-red-400">Limit reached!</p>
                      )}
                      {percentage >= 80 && percentage < 100 && (
                        <p className="text-yellow-500">Approaching limit</p>
                      )}
                    </div>

                    {/* Alert when limit reached */}
                    {percentage >= 100 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                      >
                        <p className="text-red-400">
                          ⚠️ {category} limit reached. Add anyway?
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-black border border-yellow-500/30 rounded-lg p-6"
        >
          <h2 className="text-gray-50 mb-3">💡 Smart Tips</h2>
          <ul className="space-y-2 text-gray-400">
            <li>• Set realistic limits based on your monthly budget</li>
            <li>• Review and adjust limits monthly based on your needs</li>
            <li>• Yellow alert = 80% spent, Red alert = 100% spent</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}