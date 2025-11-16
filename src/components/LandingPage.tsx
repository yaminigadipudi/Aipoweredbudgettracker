import { motion } from 'motion/react';
import { Wallet, TrendingUp, Target, Mail, Chrome } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import AuthPage from './AuthPage';

interface LandingPageProps {
  onLogin: () => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return <AuthPage onLogin={onLogin} onBack={() => setShowAuth(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black relative overflow-hidden">
      {/* Subtle gold glow effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black border border-yellow-500 mb-8"
          >
            <Wallet className="w-10 h-10 text-yellow-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6 text-gray-50"
          >
            Budget Tracker
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-yellow-500 mb-12 italic"
          >
            Think Smart, Start Saving......
          </motion.p>

          {/* Auth Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              onClick={() => setShowAuth(true)}
              className="bg-yellow-500 text-black hover:bg-yellow-400 px-8 py-6 gap-2 shadow-[0_0_30px_rgba(234,179,8,0.4)]"
            >
              <Mail className="w-5 h-5" />
              Continue with Email
            </Button>
            <Button
              onClick={() => setShowAuth(true)}
              variant="outline"
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 px-8 py-6 gap-2"
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </Button>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Wallet, title: 'Smart Tracking', desc: 'AI-powered expense categorization' },
              { icon: TrendingUp, title: 'Deep Analytics', desc: 'Insights that help you save' },
              { icon: Target, title: 'Budget Goals', desc: 'Stay on track with intelligent alerts' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                className="bg-black border border-yellow-500/30 rounded-lg p-6 hover:border-yellow-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black border border-yellow-500 mb-4">
                  <feature.icon className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="mb-2 text-gray-50">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Glassmorphism Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-gradient-to-br from-neutral-900/80 to-black/80 backdrop-blur-xl rounded-lg p-6 border border-yellow-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-black border border-yellow-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-yellow-500">Savings Goal</p>
                <p className="text-gray-50">Start Your Journey</p>
              </div>
            </div>
            <p className="text-gray-400">Set your budget and watch your savings grow</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
