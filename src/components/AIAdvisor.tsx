import { motion } from 'motion/react';
import { useBudget } from './BudgetContext';
import { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIAdvisor() {
  const { expenses, getTotalSpent, monthlyBudget, getCategorySpending } = useBudget();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial AI greeting with insights
    const totalSpent = getTotalSpent();
    const savings = monthlyBudget - totalSpent;

    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach((exp) => {
      const expDate = new Date(exp.date);
      const now = new Date();
      if (expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()) {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      }
    });

    const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];

    let greeting = "Hello! I'm BudgetBuddy, your AI financial advisor. 🤖\n\n";

    if (expenses.length === 0) {
      greeting += "I see you're just getting started. Add some expenses and I'll provide personalized insights!";
    } else {
      greeting += "Here's what I've noticed:\n\n";
      
      if (topCategory) {
        const categoryPercentage = monthlyBudget > 0 ? (topCategory[1] / monthlyBudget) * 100 : 0;
        greeting += `📊 Your top spending category is ${topCategory[0]} at ₹${topCategory[1].toLocaleString()} (${categoryPercentage.toFixed(1)}% of budget).\n\n`;
        
        if (categoryPercentage > 30) {
          greeting += `⚠️ This is quite high! Consider ways to reduce ${topCategory[0]} expenses.\n\n`;
        }
      }

      if (savings < 0) {
        greeting += `🚨 You're over budget by ₹${Math.abs(savings).toLocaleString()}. Let's work on cutting unnecessary expenses.\n\n`;
      } else if (savings > monthlyBudget * 0.5) {
        greeting += `🎉 Great job! You still have ₹${savings.toLocaleString()} left in your budget.\n\n`;
      }

      // Check for trends
      const foodSpending = getCategorySpending('Food');
      if (foodSpending > monthlyBudget * 0.2) {
        greeting += `💡 Tip: Your food spending is high. Consider meal planning to save ₹${(foodSpending * 0.2).toFixed(0)} per month.\n\n`;
      }
    }

    greeting += "Ask me anything about your finances!";

    setMessages([
      {
        id: Date.now().toString(),
        text: greeting,
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  }, []);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const totalSpent = getTotalSpent();
    const savings = monthlyBudget - totalSpent;

    // Calculate category spending
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach((exp) => {
      const expDate = new Date(exp.date);
      const now = new Date();
      if (expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()) {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      }
    });

    // Spending summary
    if (lowerMessage.includes('spending') || lowerMessage.includes('spent') || lowerMessage.includes('summary')) {
      let response = `Here's your spending summary:\n\n`;
      response += `💰 Total spent: ₹${totalSpent.toLocaleString()}\n`;
      response += `💵 Budget: ₹${monthlyBudget.toLocaleString()}\n`;
      response += `💎 Remaining: ₹${savings.toLocaleString()}\n\n`;
      
      if (Object.keys(categoryTotals).length > 0) {
        response += `Top categories:\n`;
        Object.entries(categoryTotals)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .forEach(([cat, amt]) => {
            response += `• ${cat}: ₹${amt.toLocaleString()}\n`;
          });
      }
      
      return response;
    }

    // Save money tips
    if (lowerMessage.includes('save') || lowerMessage.includes('tips') || lowerMessage.includes('reduce')) {
      const foodSpending = getCategorySpending('Food');
      const travelSpending = getCategorySpending('Travel');
      
      let response = `Here are personalized money-saving tips:\n\n`;
      
      if (foodSpending > monthlyBudget * 0.15) {
        response += `🍽️ Food (₹${foodSpending.toLocaleString()}):\n`;
        response += `• Cook at home more often\n`;
        response += `• Bring lunch to college\n`;
        response += `• Potential savings: ₹${(foodSpending * 0.3).toFixed(0)}/month\n\n`;
      }
      
      if (travelSpending > monthlyBudget * 0.1) {
        response += `🚗 Travel (₹${travelSpending.toLocaleString()}):\n`;
        response += `• Use public transport\n`;
        response += `• Consider carpooling\n`;
        response += `• Potential savings: ₹${(travelSpending * 0.25).toFixed(0)}/month\n\n`;
      }
      
      response += `💡 General tips:\n`;
      response += `• Track every expense\n`;
      response += `• Set category limits\n`;
      response += `• Review spending weekly\n`;
      
      return response;
    }

    // Budget advice
    if (lowerMessage.includes('budget') || lowerMessage.includes('plan')) {
      let response = `Budget Planning Advice:\n\n`;
      response += `📊 Recommended allocation:\n`;
      response += `• Food: 30% (₹${(monthlyBudget * 0.3).toFixed(0)})\n`;
      response += `• Rent: 25% (₹${(monthlyBudget * 0.25).toFixed(0)})\n`;
      response += `• Education: 20% (₹${(monthlyBudget * 0.2).toFixed(0)})\n`;
      response += `• Transportation: 10% (₹${(monthlyBudget * 0.1).toFixed(0)})\n`;
      response += `• Entertainment: 10% (₹${(monthlyBudget * 0.1).toFixed(0)})\n`;
      response += `• Emergency fund: 5% (₹${(monthlyBudget * 0.05).toFixed(0)})\n`;
      return response;
    }

    // Category specific
    const categories = ['food', 'travel', 'shopping', 'entertainment', 'education'];
    for (const cat of categories) {
      if (lowerMessage.includes(cat)) {
        const capCategory = cat.charAt(0).toUpperCase() + cat.slice(1);
        const spending = getCategorySpending(capCategory);
        const percentage = monthlyBudget > 0 ? (spending / monthlyBudget) * 100 : 0;
        
        return `${capCategory} Spending Analysis:\n\n` +
               `💰 Total: ₹${spending.toLocaleString()}\n` +
               `📊 ${percentage.toFixed(1)}% of your budget\n\n` +
               (percentage > 25 
                 ? `⚠️ This seems high! Try to reduce by 15-20%.\n` 
                 : `✅ You're doing well in this category!`);
      }
    }

    // Default helpful response
    return `I'm here to help with your finances! You can ask me about:\n\n` +
           `• Your spending summary\n` +
           `• Money-saving tips\n` +
           `• Budget planning advice\n` +
           `• Specific category spending (food, travel, etc.)\n\n` +
           `What would you like to know?`;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Generate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 500);

    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black pb-24 px-4 pt-8">
      <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)]  flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-black border border-yellow-500 flex items-center justify-center">
              <Bot className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h1 className="text-gray-50">BudgetBuddy</h1>
              <p className="text-yellow-500">Your AI Financial Advisor</p>
            </div>
          </div>
        </motion.div>

        {/* Messages Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 bg-black border border-yellow-500/30 rounded-lg p-4 overflow-y-auto mb-4"
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.sender === 'user'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-neutral-950 border border-yellow-500/30 text-gray-50'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-500">BudgetBuddy</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line">{message.text}</p>
                  <p className={`mt-2 ${message.sender === 'user' ? 'text-black/70' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </motion.div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2"
        >
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-neutral-950 border-yellow-500/30 text-gray-50 focus:border-yellow-500"
            placeholder="Ask me anything about your finances..."
          />
          <Button
            onClick={handleSendMessage}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            <Send className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
