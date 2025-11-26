export const geminiService = {
  async generateResponse(userMessage: string, userContext: any): Promise<string> {
    console.log('🤖 AI Service called with:', userMessage);
    console.log('📊 User context:', userContext);
    
    const lower = userMessage.toLowerCase();
    
    if (lower.includes('hello') || lower.includes('hi')) {
      return `Hello! I'm BudgetBuddy, your AI assistant. You have ₹${userContext.savings} remaining in your budget. How can I help?`;
    }
    
    if (lower.includes('joke') || lower.includes('funny')) {
      return `Here's a joke: Why don't budgets ever get tired? Because they're always balanced! 😄 You have ₹${userContext.savings} left to spend wisely.`;
    }
    
    if (lower.includes('weather')) {
      return `I can't check the weather, but your financial forecast looks good with ₹${userContext.savings} remaining! ☀️`;
    }
    
    if (lower.includes('recipe') || lower.includes('cook')) {
      return `Here's a money recipe: 1 cup smart spending + 2 tbsp saving = financial success! You have ₹${userContext.savings} for ingredients. 🍳`;
    }
    
    if (lower.includes('time')) {
      return `It's ${new Date().toLocaleTimeString()} - perfect time to check your finances! You have ₹${userContext.savings} remaining.`;
    }
    
    return `That's an interesting question about "${userMessage}"! I'm here to help with anything. You currently have ₹${userContext.savings} remaining out of your ₹${userContext.monthlyBudget} budget. What else can I help you with?`;
  }
};
