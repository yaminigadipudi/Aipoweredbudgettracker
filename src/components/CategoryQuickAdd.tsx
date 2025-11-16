import { motion } from 'motion/react';
import { useBudget } from './BudgetContext';
import { useState } from 'react';
import { Coffee, Car, ShoppingBag, Home, BookOpen, Gamepad2, Heart, CreditCard, Utensils, Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface CategoryQuickAddProps {
  onCategorySelect: (category: string) => void;
}

const defaultCategories = [
  { name: 'Food', icon: Utensils, emoji: '🥗' },
  { name: 'Travel', icon: Car, emoji: '🚕' },
  { name: 'Shopping', icon: ShoppingBag, emoji: '🛍' },
  { name: 'Rent', icon: Home, emoji: '🏠' },
  { name: 'Education', icon: BookOpen, emoji: '📚' },
  { name: 'Entertainment', icon: Gamepad2, emoji: '🎮' },
  { name: 'Health', icon: Heart, emoji: '💊' },
  { name: 'Subscriptions', icon: CreditCard, emoji: '💳' },
];

export default function CategoryQuickAdd({ onCategorySelect }: CategoryQuickAddProps) {
  const { customCategories, addCustomCategory, deleteCustomCategory } = useBudget();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    addCustomCategory(newCategoryName.trim());
    setNewCategoryName('');
    setIsDialogOpen(false);
  };

  const handleDeleteCustomCategory = (category: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCustomCategory(category);
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
          <h1 className="mb-2 text-gray-50">Quick Add</h1>
          <p className="text-yellow-500">Select a category to add expenses</p>
        </motion.div>

        {/* Add Custom Category Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 gap-2">
                <Plus className="w-4 h-4" />
                Add Custom Category
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-950 border-yellow-500/30 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-gray-50">Add Custom Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-yellow-500">Category Name</Label>
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="bg-black border-yellow-500/30 text-gray-50"
                    placeholder="E.g., Gym, Books, Gifts..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  />
                </div>
                <Button
                  onClick={handleAddCategory}
                  className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
                >
                  Add Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Default Categories */}
        <div className="mb-6">
          <h2 className="text-gray-50 mb-4">Default Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {defaultCategories.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                onClick={() => onCategorySelect(category.name)}
                className="bg-black border border-yellow-500/30 rounded-lg p-6 hover:border-yellow-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-full bg-black border border-yellow-500 flex items-center justify-center mx-auto mb-3 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all">
                  <category.icon className="w-8 h-8 text-yellow-500" />
                </div>
                <p className="text-gray-50 mb-1">{category.name}</p>
                <p className="text-yellow-500">{category.emoji}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom Categories */}
        {customCategories.length > 0 && (
          <div>
            <h2 className="text-gray-50 mb-4">Custom Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {customCategories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => onCategorySelect(category)}
                  className="relative bg-black border border-yellow-500/30 rounded-lg p-6 hover:border-yellow-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-all duration-300 group"
                >
                  <button
                    onClick={(e) => handleDeleteCustomCategory(category, e)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  <div className="w-16 h-16 rounded-full bg-black border border-yellow-500 flex items-center justify-center mx-auto mb-3 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all">
                    <Plus className="w-8 h-8 text-yellow-500" />
                  </div>
                  <p className="text-gray-50">{category}</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
