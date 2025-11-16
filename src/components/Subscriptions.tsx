import { motion } from 'motion/react';
import { useBudget, Subscription } from './BudgetContext';
import { useState } from 'react';
import { Plus, CreditCard, Calendar, TrendingUp, Trash2, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export default function Subscriptions() {
  const { subscriptions, addSubscription, deleteSubscription } = useBudget();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !amount || !billingCycle || !nextPaymentDate || !paymentMethod) {
      return;
    }

    addSubscription({
      name,
      amount: parseFloat(amount),
      billingCycle,
      nextPaymentDate,
      paymentMethod,
    });

    // Reset form
    setName('');
    setAmount('');
    setBillingCycle('');
    setNextPaymentDate('');
    setPaymentMethod('');
    setIsDialogOpen(false);
  };

  // Calculate total monthly subscription cost
  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  // Check for upcoming payments
  const upcomingPayments = subscriptions.filter((sub) => {
    const nextDate = new Date(sub.nextPaymentDate);
    const today = new Date();
    const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7 && daysUntil >= 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black pb-24 px-4 pt-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-gray-50">Subscriptions</h1>
          <p className="text-yellow-500">Manage your recurring payments</p>
        </motion.div>

        {/* Total Subscription Cost */}
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
              <p className="text-yellow-500">Total Monthly Subscriptions</p>
              <p className="text-gray-50">₹{totalMonthly.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Payments Alert */}
        {upcomingPayments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black border border-yellow-500/30 rounded-lg p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-black border border-yellow-500 flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-500" />
              </div>
              <h2 className="text-gray-50">Upcoming Payments</h2>
            </div>
            <div className="space-y-3">
              {upcomingPayments.map((sub) => {
                const nextDate = new Date(sub.nextPaymentDate);
                const today = new Date();
                const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-3 bg-neutral-950 border border-yellow-500/20 rounded-lg"
                  >
                    <div>
                      <p className="text-gray-50">{sub.name}</p>
                      <p className="text-yellow-500">
                        Payment due in {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <p className="text-gray-400">₹{sub.amount}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Add Subscription Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 gap-2">
                <Plus className="w-4 h-4" />
                Add Subscription
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-950 border-yellow-500/30 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-gray-50">Add Subscription</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-yellow-500">Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black border-yellow-500/30 text-gray-50"
                    placeholder="Netflix, Spotify, etc."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-yellow-500">Amount</Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-black border-yellow-500/30 text-gray-50"
                    placeholder="Monthly cost"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-yellow-500">Billing Cycle</Label>
                  <Select value={billingCycle} onValueChange={setBillingCycle} required>
                    <SelectTrigger className="bg-black border-yellow-500/30 text-gray-50">
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-950 border-yellow-500/30">
                      <SelectItem value="Monthly" className="text-gray-50 focus:bg-yellow-500/10">
                        Monthly
                      </SelectItem>
                      <SelectItem value="Yearly" className="text-gray-50 focus:bg-yellow-500/10">
                        Yearly
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-yellow-500">Next Payment Date</Label>
                  <Input
                    type="date"
                    value={nextPaymentDate}
                    onChange={(e) => setNextPaymentDate(e.target.value)}
                    className="bg-black border-yellow-500/30 text-gray-50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-yellow-500">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                    <SelectTrigger className="bg-black border-yellow-500/30 text-gray-50">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-950 border-yellow-500/30">
                      <SelectItem value="Card" className="text-gray-50 focus:bg-yellow-500/10">
                        Card
                      </SelectItem>
                      <SelectItem value="UPI" className="text-gray-50 focus:bg-yellow-500/10">
                        UPI
                      </SelectItem>
                      <SelectItem value="Net Banking" className="text-gray-50 focus:bg-yellow-500/10">
                        Net Banking
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-yellow-500 text-black hover:bg-yellow-400">
                  Add Subscription
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Subscriptions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black border border-yellow-500/30 rounded-lg p-6"
        >
          <h2 className="text-gray-50 mb-4">Active Subscriptions</h2>
          {subscriptions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-black border border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-yellow-500/50" />
              </div>
              <p className="text-gray-400">No subscriptions yet</p>
              <p className="text-gray-500">Add your recurring payments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-4 bg-neutral-950 border border-yellow-500/10 rounded-lg hover:border-yellow-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black border border-yellow-500 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-gray-50">{sub.name}</p>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{sub.billingCycle} • Next: {new Date(sub.nextPaymentDate).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-500">{sub.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-yellow-500">₹{sub.amount}</p>
                    <button
                      onClick={() => deleteSubscription(sub.id)}
                      className="text-red-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Smart Suggestions */}
        {subscriptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-black border border-yellow-500/30 rounded-lg p-6"
          >
            <h2 className="text-gray-50 mb-4">CEO-Grade Suggestions</h2>
            <div className="space-y-3">
              <div className="p-3 bg-neutral-950 border border-yellow-500/10 rounded-lg">
                <p className="text-yellow-500 mb-1">💡 Cost Optimization</p>
                <p className="text-gray-400">Consider annual plans to save up to 20%</p>
              </div>
              {totalMonthly > 1000 && (
                <div className="p-3 bg-neutral-950 border border-yellow-500/10 rounded-lg">
                  <p className="text-yellow-500 mb-1">⚠️ High Subscription Cost</p>
                  <p className="text-gray-400">Your subscriptions cost ₹{totalMonthly}/month. Review unused services?</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
