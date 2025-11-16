import { motion } from 'motion/react';
import { useBudget } from './BudgetContext';
import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Target, Plus, Edit2, Check, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function Dashboard() {
  const { monthlyBudget, setMonthlyBudget, getTotalSpent, getSavings, expenses, deleteExpense } = useBudget();
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString());
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user name from localStorage
    const storedName = localStorage.getItem('userName') || 'User';
    // Capitalize first letter
    const formattedName = storedName.charAt(0).toUpperCase() + storedName.slice(1);
    setUserName(formattedName);
  }, []);

  const totalSpent = getTotalSpent();
  const savings = getSavings();
  const spendingPercentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

  // Calculate monthly savings trend
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  let lastMonthSpent = 0;
  expenses.forEach((exp) => {
    const expDate = new Date(exp.date);
    if (expDate.getMonth() === lastMonth && expDate.getFullYear() === lastMonthYear) {
      lastMonthSpent += exp.amount;
    }
  });

  const lastMonthSavings = monthlyBudget - lastMonthSpent;
  const currentMonthSavings = savings;
  const savingsIncrease = currentMonthSavings - lastMonthSavings;

  // Get top spending category
  const categoryTotals: { [key: string]: number } = {};
  expenses.forEach((exp) => {
    const expDate = new Date(exp.date);
    const now = new Date();
    if (expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()) {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    }
  });

  const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];

  const handleSaveBudget = () => {
    const budget = parseFloat(budgetInput);
    if (!isNaN(budget) && budget > 0) {
      setMonthlyBudget(budget);
      setIsEditingBudget(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black pb-24 px-4 pt-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-gray-50">Hi, {userName} 👋</h1>
          <p className="text-yellow-500">Your financial overview</p>
        </motion.div>

        {/* Monthly Budget Setter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black border border-yellow-500 rounded-lg p-6 mb-6 shadow-[0_0_30px_rgba(234,179,8,0.2)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-black border border-yellow-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-yellow-500">Monthly Budget</p>
                {!isEditingBudget ? (
                  <p className="text-gray-50">₹{monthlyBudget.toLocaleString()}</p>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      className="w-32 bg-neutral-950 border-yellow-500/30 text-gray-50"
                      placeholder="Enter budget"
                    />
                    <button
                      onClick={handleSaveBudget}
                      className="text-yellow-500 hover:text-yellow-400"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {!isEditingBudget && (
              <button
                onClick={() => {
                  setIsEditingBudget(true);
                  setBudgetInput(monthlyBudget.toString());
                }}
                className="text-yellow-500 hover:text-yellow-400"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black border border-yellow-500/30 rounded-lg p-6 hover:border-yellow-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-black border border-yellow-500 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-yellow-500">Total Spent</p>
                <p className="text-gray-50">₹{totalSpent.toLocaleString()}</p>
              </div>
            </div>
            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(spendingPercentage, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-full ${
                  spendingPercentage > 100
                    ? 'bg-red-500'
                    : spendingPercentage > 80
                    ? 'bg-yellow-500'
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                }`}
              />
            </div>
            <p className="text-gray-400 mt-2">
              {spendingPercentage.toFixed(1)}% of budget
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black border border-yellow-500/30 rounded-lg p-6 hover:border-yellow-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-black border border-yellow-500 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-yellow-500">Remaining Budget</p>
                <p className={`${savings < 0 ? 'text-red-400' : 'text-gray-50'}`}>
                  ₹{savings.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-gray-400">
              {savings >= 0 ? 'Keep it up!' : 'Over budget!'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black border border-yellow-500/30 rounded-lg p-6 hover:border-yellow-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-black border border-yellow-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-yellow-500">Savings This Month</p>
                <p className={`${currentMonthSavings < 0 ? 'text-red-400' : 'text-gray-50'}`}>
                  ₹{Math.max(0, currentMonthSavings).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {savingsIncrease > 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <p className="text-green-400">+₹{savingsIncrease.toLocaleString()} vs last month</p>
                </>
              ) : savingsIncrease < 0 ? (
                <>
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <p className="text-red-400">₹{savingsIncrease.toLocaleString()} vs last month</p>
                </>
              ) : (
                <p className="text-gray-400">Same as last month</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black border border-yellow-500/30 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-50">Recent Expenses</h2>
            <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = 'add-expense'; }}>
              <Button className="bg-yellow-500 text-black hover:bg-yellow-400 gap-2">
                <Plus className="w-4 h-4" />
                Add Expense
              </Button>
            </a>
          </div>

          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-black border border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-yellow-500/50" />
              </div>
              <p className="text-gray-400">No expenses yet</p>
              <p className="text-gray-500">Start tracking your spending</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.slice(0, 5).map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-neutral-950 border border-yellow-500/10 rounded-lg hover:border-yellow-500/30 transition-colors group"
                >
                  <div>
                    <p className="text-gray-50">{expense.description}</p>
                    <p className="text-gray-400">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-yellow-500">₹{expense.amount}</p>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all"
                      aria-label="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}