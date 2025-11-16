import { motion } from 'motion/react';
import { useBudget } from './BudgetContext';
import { useState } from 'react';
import { Plus, Users, Share2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

export default function SplitPayments() {
  const { splitPayments, addSplitPayment } = useBudget();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [friends, setFriends] = useState<{ name: string; amount: string }[]>([{ name: '', amount: '' }]);

  const handleAddFriend = () => {
    setFriends([...friends, { name: '', amount: '' }]);
  };

  const handleRemoveFriend = (index: number) => {
    setFriends(friends.filter((_, i) => i !== index));
  };

  const handleFriendChange = (index: number, field: 'name' | 'amount', value: string) => {
    const updated = [...friends];
    updated[index][field] = value;
    setFriends(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !totalAmount) {
      return;
    }

    const parsedFriends = friends
      .filter((f) => f.name && f.amount)
      .map((f) => ({ name: f.name, amount: parseFloat(f.amount) }));

    if (parsedFriends.length === 0) {
      toast.error('Please add at least one friend');
      return;
    }

    addSplitPayment({
      name,
      totalAmount: parseFloat(totalAmount),
      friends: parsedFriends,
      date: new Date().toISOString().split('T')[0],
    });

    // Reset form
    setName('');
    setTotalAmount('');
    setFriends([{ name: '', amount: '' }]);
    setIsDialogOpen(false);
  };

  const handleShareUPI = (payment: any) => {
    const upiLink = `upi://pay?pa=your-upi@bank&pn=SplitPayment&am=${payment.totalAmount}&tn=${payment.name}`;
    toast.success('UPI payment link copied!');
    // In a real app, this would open the UPI app or copy to clipboard
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
          <h1 className="mb-2 text-gray-50">Split Payments</h1>
          <p className="text-yellow-500">Share expenses with friends</p>
        </motion.div>

        {/* Add Split Payment Button */}
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
                New Split Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-950 border-yellow-500/30 max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-gray-50">Split Payment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-yellow-500">Payment Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black border-yellow-500/30 text-gray-50"
                    placeholder="Room rent, Groceries, etc."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-yellow-500">Total Amount</Label>
                  <Input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    className="bg-black border-yellow-500/30 text-gray-50"
                    placeholder="Total amount"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-yellow-500">Split With Friends</Label>
                    <button
                      type="button"
                      onClick={handleAddFriend}
                      className="text-yellow-500 hover:text-yellow-400"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {friends.map((friend, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={friend.name}
                        onChange={(e) => handleFriendChange(index, 'name', e.target.value)}
                        className="bg-black border-yellow-500/30 text-gray-50"
                        placeholder="Friend's name"
                      />
                      <Input
                        type="number"
                        value={friend.amount}
                        onChange={(e) => handleFriendChange(index, 'amount', e.target.value)}
                        className="bg-black border-yellow-500/30 text-gray-50 w-32"
                        placeholder="Amount"
                      />
                      {friends.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFriend(index)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <Button type="submit" className="w-full bg-yellow-500 text-black hover:bg-yellow-400">
                  Create Split Payment
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Split Payments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black border border-yellow-500/30 rounded-lg p-6"
        >
          <h2 className="text-gray-50 mb-4">Split Payments</h2>
          {splitPayments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-black border border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-yellow-500/50" />
              </div>
              <p className="text-gray-400">No split payments yet</p>
              <p className="text-gray-500">Share expenses with your friends</p>
            </div>
          ) : (
            <div className="space-y-4">
              {splitPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-neutral-950 border border-yellow-500/10 rounded-lg p-4 hover:border-yellow-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-gray-50 mb-1">{payment.name}</p>
                      <p className="text-yellow-500">Total: ₹{payment.totalAmount.toLocaleString()}</p>
                      <p className="text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleShareUPI(payment)}
                      className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share UPI</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-400">Split with:</p>
                    {payment.friends.map((friend, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-black border border-yellow-500/10 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-neutral-900 border border-yellow-500 flex items-center justify-center">
                            <Users className="w-4 h-4 text-yellow-500" />
                          </div>
                          <span className="text-gray-50">{friend.name}</span>
                        </div>
                        <span className="text-yellow-500">₹{friend.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { name: 'Room Rent', icon: '🏠' },
            { name: 'Mess Bill', icon: '🍽️' },
            { name: 'Groceries', icon: '🛒' },
            { name: 'Travel', icon: '🚗' },
          ].map((category, index) => (
            <motion.button
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="bg-black border border-yellow-500/30 rounded-lg p-4 hover:border-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all"
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <p className="text-gray-50">{category.name}</p>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
