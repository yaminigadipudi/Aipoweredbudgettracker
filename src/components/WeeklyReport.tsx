import { motion } from 'motion/react';
import { useBudget } from './BudgetContext';
import { TrendingUp, TrendingDown, Trophy, AlertTriangle } from 'lucide-react';

export default function WeeklyReport() {
  const { expenses, getTotalSpent } = useBudget();

  // Calculate weekly data
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let weeklyTotal = 0;
  const dailyTotals: { [key: string]: number } = {};
  const categoryTotals: { [key: string]: number } = {};

  expenses.forEach((exp) => {
    const expDate = new Date(exp.date);
    if (expDate >= weekAgo && expDate <= now) {
      weeklyTotal += exp.amount;
      const day = expDate.toLocaleDateString();
      dailyTotals[day] = (dailyTotals[day] || 0) + exp.amount;
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    }
  });

  // Best saving day (lowest spending)
  const bestDay = Object.entries(dailyTotals).sort(([, a], [, b]) => a - b)[0];
  const worstDay = Object.entries(dailyTotals).sort(([, a], [, b]) => b - a)[0];
  const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black pb-24 px-4 pt-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-gray-50">Weekly Report</h1>
          <p className="text-yellow-500">Your week at a glance</p>
        </motion.div>

        {/* Story Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="relative mx-auto max-w-sm"
        >
          {/* Story Ring */}
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-2xl opacity-75 blur-sm animate-pulse" />
          
          {/* Story Content */}
          <div className="relative bg-black border-2 border-yellow-500 rounded-2xl p-8 shadow-[0_0_50px_rgba(234,179,8,0.3)]">
            {/* Total Spent */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6 pb-6 border-b border-yellow-500/30"
            >
              <div className="w-16 h-16 rounded-full bg-black border-2 border-yellow-500 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-yellow-500 mb-1">Total Spent This Week</p>
              <p className="text-gray-50">₹{weeklyTotal.toLocaleString()}</p>
            </motion.div>

            {/* Top Category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6 pb-6 border-b border-yellow-500/30"
            >
              <p className="text-yellow-500 mb-1">Top Spending Category</p>
              <p className="text-gray-50">
                {topCategory ? `${topCategory[0]} (₹${topCategory[1].toLocaleString()})` : 'No data'}
              </p>
            </motion.div>

            {/* Best Saving Day */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-6 pb-6 border-b border-yellow-500/30"
            >
              <div className="w-12 h-12 rounded-full bg-black border-2 border-yellow-500 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-yellow-500 mb-1">Best Saving Day</p>
              <p className="text-gray-50">
                {bestDay ? `${bestDay[0]} (₹${bestDay[1].toLocaleString()})` : 'No data'}
              </p>
            </motion.div>

            {/* Worst Overspend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full bg-black border-2 border-red-500 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-yellow-500 mb-1">Highest Spending Day</p>
              <p className="text-gray-50">
                {worstDay ? `${worstDay[0]} (₹${worstDay[1].toLocaleString()})` : 'No data'}
              </p>
            </motion.div>

            {/* Motivational Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 pt-6 border-t border-yellow-500/30 text-center"
            >
              <p className="text-yellow-500 italic">
                {weeklyTotal === 0 
                  ? "Start tracking to see your weekly insights!"
                  : weeklyTotal < 1000 
                    ? "Great job! You're managing your budget well 🎉"
                    : "Keep an eye on your spending this week 💪"}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Weekly Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 bg-black border border-yellow-500/30 rounded-lg p-6"
        >
          <h2 className="text-gray-50 mb-4">Daily Breakdown</h2>
          {Object.keys(dailyTotals).length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No expenses this week
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(dailyTotals)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .map(([day, amount]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between p-3 bg-neutral-950 border border-yellow-500/10 rounded-lg"
                  >
                    <p className="text-gray-50">{new Date(day).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                    <p className="text-yellow-500">₹{amount.toLocaleString()}</p>
                  </div>
                ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
