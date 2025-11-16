import { motion } from 'motion/react';
import { useBudget } from './BudgetContext';
import { ArrowLeft, Plus, TrendingUp, Utensils } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface CategoryDetailProps {
  category: string | null;
  onBack: () => void;
}

export default function CategoryDetail({ category, onBack }: CategoryDetailProps) {
  const { expenses, getCategorySpending, addExpense } = useBudget();
  const [customAmount, setCustomAmount] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!category) {
    onBack();
    return null;
  }

  const categorySpending = getCategorySpending(category);
  const categoryExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    const now = new Date();
    return (
      exp.category === category &&
      expDate.getMonth() === now.getMonth() &&
      expDate.getFullYear() === now.getFullYear()
    );
  });

  const handleCustomAdd = () => {
    if (!customAmount || !customDescription) return;

    addExpense({
      amount: parseFloat(customAmount),
      date: new Date().toISOString().split('T')[0],
      description: customDescription,
      category,
      paymentMethod: 'Cash',
    });

    setCustomAmount('');
    setCustomDescription('');
    setIsDialogOpen(false);
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
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="mb-2 text-gray-50">{category}</h1>
          <p className="text-yellow-500">Quick add expenses</p>
        </motion.div>

        {/* Total Spent Card */}
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
              <p className="text-yellow-500">Total Spent on {category}</p>
              <p className="text-gray-50">₹{categorySpending.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Add Custom Amount Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="w-full bg-yellow-500 text-black hover:bg-yellow-400 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Custom Amount
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-neutral-950 border-yellow-500/30">
              <DialogHeader>
                <DialogTitle className="text-gray-50">Add {category} Expense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-yellow-500">Description</Label>
                  <Input
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    className="bg-black border-yellow-500/30 text-gray-50"
                    placeholder="What did you buy?"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-yellow-500">Amount</Label>
                  <Input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="bg-black border-yellow-500/30 text-gray-50"
                    placeholder="Enter amount"
                  />
                </div>
                <Button
                  onClick={handleCustomAdd}
                  className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
                >
                  Add Expense
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Previous Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black border border-yellow-500/30 rounded-lg p-6"
        >
          <h2 className="text-gray-50 mb-4">Previous Expenses</h2>
          {categoryExpenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No expenses in this category yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categoryExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-neutral-950 border border-yellow-500/10 rounded-lg"
                >
                  <div>
                    <p className="text-gray-50">{expense.description}</p>
                    <p className="text-gray-400">
                      {new Date(expense.date).toLocaleDateString()} • {expense.paymentMethod}
                    </p>
                  </div>
                  <p className="text-yellow-500">₹{expense.amount}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}