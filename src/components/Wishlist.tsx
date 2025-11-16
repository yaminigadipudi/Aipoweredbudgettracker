import { motion } from 'motion/react';
import { useBudget } from './BudgetContext';
import { useState } from 'react';
import { Plus, Star, Trash2, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export default function Wishlist() {
  const { wishlist, addWishlistItem, deleteWishlistItem, getSavings } = useBudget();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [priority, setPriority] = useState('');

  const savings = getSavings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !priority) {
      return;
    }

    addWishlistItem({
      name,
      price: parseFloat(price),
      priority,
    });

    // Reset form
    setName('');
    setPrice('');
    setPriority('');
    setIsDialogOpen(false);
  };

  const getSavingProgress = (itemPrice: number) => {
    if (savings <= 0) return 0;
    return Math.min((savings / itemPrice) * 100, 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'border-red-500 text-red-400';
      case 'Medium':
        return 'border-yellow-500 text-yellow-500';
      case 'Low':
        return 'border-green-500 text-green-400';
      default:
        return 'border-yellow-500 text-yellow-500';
    }
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
          <h1 className="mb-2 text-gray-50">Wishlist</h1>
          <p className="text-yellow-500">Things You Want to Buy</p>
        </motion.div>

        {/* Current Savings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black border border-yellow-500 rounded-lg p-6 mb-6 shadow-[0_0_30px_rgba(234,179,8,0.2)]"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-black border border-yellow-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-yellow-500">Current Savings</p>
              <p className={`${savings < 0 ? 'text-red-400' : 'text-gray-50'}`}>
                ₹{Math.max(0, savings).toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Add Wishlist Item Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 gap-2">
                <Plus className="w-4 h-4" />
                Add to Wishlist
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-950 border-yellow-500/30 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-gray-50">Add Wishlist Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-yellow-500">Item Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black border-yellow-500/30 text-gray-50"
                    placeholder="What do you want to buy?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-yellow-500">Price</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-black border-yellow-500/30 text-gray-50"
                    placeholder="How much does it cost?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-yellow-500">Priority</Label>
                  <Select value={priority} onValueChange={setPriority} required>
                    <SelectTrigger className="bg-black border-yellow-500/30 text-gray-50">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-950 border-yellow-500/30">
                      <SelectItem value="High" className="text-gray-50 focus:bg-red-500/10">
                        High
                      </SelectItem>
                      <SelectItem value="Medium" className="text-gray-50 focus:bg-yellow-500/10">
                        Medium
                      </SelectItem>
                      <SelectItem value="Low" className="text-gray-50 focus:bg-green-500/10">
                        Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-yellow-500 text-black hover:bg-yellow-400">
                  Add to Wishlist
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Wishlist Items */}
        <div className="space-y-4">
          {wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black border border-yellow-500/30 rounded-lg p-12 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-black border border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-500/50" />
              </div>
              <p className="text-gray-400 mb-2">Your wishlist is empty</p>
              <p className="text-gray-500">Add items you want to save for</p>
            </motion.div>
          ) : (
            wishlist.map((item, index) => {
              const progress = getSavingProgress(item.price);
              const canAfford = savings >= item.price;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className={`bg-black border rounded-lg p-6 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)] transition-all ${
                    canAfford ? 'border-yellow-500' : 'border-yellow-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-black border border-yellow-500 flex items-center justify-center">
                        <Star className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-gray-50 mb-1">{item.name}</p>
                        <p className="text-yellow-500">₹{item.price.toLocaleString()}</p>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs border mt-1 ${getPriorityColor(
                            item.priority
                          )}`}
                        >
                          {item.priority} Priority
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteWishlistItem(item.id)}
                      className="text-red-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Saving Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-400">Saving Progress</p>
                      <p className="text-yellow-500">
                        ₹{Math.max(0, savings).toLocaleString()} / ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400"
                      />
                    </div>
                    <p className="text-gray-400 mt-1">{progress.toFixed(1)}% saved</p>
                  </div>

                  {/* Can Afford Alert */}
                  {canAfford && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-yellow-500/10 border border-yellow-500 rounded-lg flex items-center gap-2"
                    >
                      <span className="text-2xl">🎉</span>
                      <p className="text-yellow-500">Good news! Your savings can buy this item!</p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
