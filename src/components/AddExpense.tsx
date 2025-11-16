import { motion } from 'motion/react';
import { useState } from 'react';
import { useBudget } from './BudgetContext';
import { ArrowLeft, DollarSign, Calendar, FileText, Tag, CreditCard, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AddExpenseProps {
  onBack: () => void;
}

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

const paymentMethods = ['Cash', 'UPI', 'Card'];

export default function AddExpense({ onBack }: AddExpenseProps) {
  const { addExpense, customCategories } = useBudget();
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [showSmartDetection, setShowSmartDetection] = useState(false);

  // Combine default and custom categories
  const allCategories = [...defaultCategories, ...customCategories];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !date || !description || !category || !paymentMethod) {
      return;
    }

    addExpense({
      amount: parseFloat(amount),
      date,
      description,
      category,
      paymentMethod,
      isRecurring,
    });

    // Reset form
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setCategory('');
    setPaymentMethod('');
    setIsRecurring(false);
    setShowSmartDetection(false);
    
    onBack();
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    
    // Smart category detection
    if (value.length > 3) {
      const lowerValue = value.toLowerCase();
      if (lowerValue.includes('food') || lowerValue.includes('lunch') || lowerValue.includes('dinner') || lowerValue.includes('breakfast')) {
        setCategory('Food');
        setShowSmartDetection(true);
      } else if (lowerValue.includes('uber') || lowerValue.includes('taxi') || lowerValue.includes('bus') || lowerValue.includes('metro')) {
        setCategory('Travel');
        setShowSmartDetection(true);
      } else if (lowerValue.includes('book') || lowerValue.includes('course') || lowerValue.includes('class')) {
        setCategory('Education');
        setShowSmartDetection(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black pb-24 px-4 pt-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="mb-2 text-gray-50">Add Expense</h1>
          <p className="text-yellow-500">Track your spending</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black border border-yellow-500/30 rounded-lg p-6 shadow-[0_0_30px_rgba(234,179,8,0.15)]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-yellow-500 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-neutral-950 border-yellow-500/30 text-gray-50 focus:border-yellow-500"
                placeholder="Enter amount"
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-yellow-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-neutral-950 border-yellow-500/30 text-gray-50 focus:border-yellow-500"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-yellow-500 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description
              </Label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="bg-neutral-950 border-yellow-500/30 text-gray-50 focus:border-yellow-500"
                placeholder="What did you spend on?"
                required
              />
              {showSmartDetection && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-yellow-500 bg-neutral-950 border border-yellow-500/30 rounded p-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Smart category detected: {category}</span>
                </motion.div>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-yellow-500 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Category
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="bg-neutral-950 border-yellow-500/30 text-gray-50 focus:border-yellow-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-950 border-yellow-500/30">
                  {allCategories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-gray-50 focus:bg-yellow-500/10 focus:text-yellow-500">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="payment" className="text-yellow-500 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Method
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                <SelectTrigger className="bg-neutral-950 border-yellow-500/30 text-gray-50 focus:border-yellow-500">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-950 border-yellow-500/30">
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method} className="text-gray-50 focus:bg-yellow-500/10 focus:text-yellow-500">
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recurring Toggle */}
            <div className="flex items-center justify-between p-4 bg-neutral-950 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-50">Recurring Expense</span>
              </div>
              <button
                type="button"
                onClick={() => setIsRecurring(!isRecurring)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  isRecurring ? 'bg-yellow-500' : 'bg-neutral-700'
                }`}
              >
                <motion.div
                  className="w-5 h-5 bg-black rounded-full"
                  animate={{ x: isRecurring ? 26 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.4)]"
            >
              Add Expense
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}