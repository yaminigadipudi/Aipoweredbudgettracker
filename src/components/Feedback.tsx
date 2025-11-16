import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { MessageCircle, Smile, Meh, Frown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const moneyQuotes = [
  "A penny saved is a penny earned.",
  "Don't save what is left after spending; spend what is left after saving.",
  "It's not how much money you make, but how much money you keep.",
  "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.",
  "Wealth consists not in having great possessions, but in having few wants.",
  "The habit of saving is itself an education; it fosters every virtue.",
  "Financial freedom is available to those who learn about it and work for it.",
  "Too many people spend money they earned to buy things they don't want to impress people they don't like.",
];

export default function Feedback() {
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [dailyQuote, setDailyQuote] = useState('');

  useEffect(() => {
    // Get daily quote (changes daily)
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('quoteDate');
    const savedQuote = localStorage.getItem('dailyQuote');

    if (savedDate === today && savedQuote) {
      setDailyQuote(savedQuote);
    } else {
      const randomQuote = moneyQuotes[Math.floor(Math.random() * moneyQuotes.length)];
      setDailyQuote(randomQuote);
      localStorage.setItem('quoteDate', today);
      localStorage.setItem('dailyQuote', randomQuote);
    }
  }, []);

  const handleFeedback = (type: string) => {
    setSelectedFeedback(type);
    toast.success(`Thank you for your ${type} feedback!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black pb-24 px-4 pt-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-gray-50">Feedback & Inspiration</h1>
          <p className="text-yellow-500">How are we doing?</p>
        </motion.div>

        {/* Daily Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black border border-yellow-500 rounded-lg p-8 mb-8 shadow-[0_0_30px_rgba(234,179,8,0.2)] text-center"
        >
          <div className="w-16 h-16 rounded-full bg-black border-2 border-yellow-500 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-gray-50 mb-2 italic">"{dailyQuote}"</p>
          <p className="text-yellow-500">Daily Money Quote</p>
        </motion.div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black border border-yellow-500/30 rounded-lg p-6 mb-6"
        >
          <h2 className="text-gray-50 mb-4 text-center">How's your experience?</h2>
          <p className="text-gray-400 text-center mb-6">
            Help us improve by sharing your feedback
          </p>

          <div className="grid grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFeedback('positive')}
              className={`bg-neutral-950 border rounded-lg p-6 transition-all ${
                selectedFeedback === 'positive'
                  ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                  : 'border-yellow-500/30 hover:border-yellow-500'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-black border border-yellow-500 flex items-center justify-center mx-auto mb-2">
                <Smile className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-gray-50">Great</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFeedback('neutral')}
              className={`bg-neutral-950 border rounded-lg p-6 transition-all ${
                selectedFeedback === 'neutral'
                  ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                  : 'border-yellow-500/30 hover:border-yellow-500'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-black border border-yellow-500 flex items-center justify-center mx-auto mb-2">
                <Meh className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-gray-50">Okay</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFeedback('negative')}
              className={`bg-neutral-950 border rounded-lg p-6 transition-all ${
                selectedFeedback === 'negative'
                  ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                  : 'border-yellow-500/30 hover:border-yellow-500'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-black border border-yellow-500 flex items-center justify-center mx-auto mb-2">
                <Frown className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-gray-50">Needs Work</p>
            </motion.button>
          </div>
        </motion.div>

        {/* More Quotes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black border border-yellow-500/30 rounded-lg p-6"
        >
          <h2 className="text-gray-50 mb-4">More Inspiration</h2>
          <div className="space-y-3">
            {moneyQuotes.slice(0, 4).map((quote, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="p-4 bg-neutral-950 border border-yellow-500/10 rounded-lg"
              >
                <p className="text-gray-400 italic">"{quote}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Thank You Message */}
        {selectedFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-black border border-yellow-500 rounded-lg p-6 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-black border border-yellow-500 flex items-center justify-center mx-auto mb-3">
              <Smile className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-yellow-500 mb-2">Thank you for your feedback!</p>
            <p className="text-gray-400">We appreciate you taking the time to help us improve.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
