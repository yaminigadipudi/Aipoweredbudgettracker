import { motion } from 'motion/react';
import { useBudget } from './BudgetContext';
import { useState, useEffect } from 'react';
import { Cloud, Download, FileText, CheckCircle, Image as ImageIcon, Upload, Trash2, X } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface TransactionPhoto {
  id: string;
  url: string;
  name: string;
  date: string;
}

export default function DataBackup() {
  const { expenses, subscriptions, monthlyBudget, getTotalSpent, isAuthenticated, user } = useBudget();
  const [transactionPhotos, setTransactionPhotos] = useState<TransactionPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<TransactionPhoto | null>(null);

  useEffect(() => {
    const savedPhotos = localStorage.getItem('transactionPhotos');
    if (savedPhotos) {
      setTransactionPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  const handleExportToCSV = () => {
    let csv = 'Date,Description,Category,Amount,Payment Method\n';
    expenses.forEach((exp) => {
      csv += `${exp.date},"${exp.description}",${exp.category},${exp.amount},${exp.paymentMethod}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Expenses exported to CSV successfully!');
  };

  const handleExportToPDF = () => {
    // Create PDF content
    const totalSpent = getTotalSpent();
    const savings = monthlyBudget - totalSpent;
    
    let pdfContent = `
BUDGET TRACKER REPORT
Generated on: ${new Date().toLocaleDateString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
Monthly Budget: ₹${monthlyBudget.toLocaleString()}
Total Spent: ₹${totalSpent.toLocaleString()}
Remaining: ₹${savings.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPENSES
`;

    expenses.forEach((exp) => {
      pdfContent += `
Date: ${new Date(exp.date).toLocaleDateString()}
Description: ${exp.description}
Category: ${exp.category}
Amount: ₹${exp.amount}
Payment: ${exp.paymentMethod}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
    });

    pdfContent += `

SUBSCRIPTIONS
`;

    subscriptions.forEach((sub) => {
      pdfContent += `
Name: ${sub.name}
Amount: ₹${sub.amount}
Billing: ${sub.billingCycle}
Next Payment: ${new Date(sub.nextPaymentDate).toLocaleDateString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
    });

    // Create and download as text file (simulated PDF)
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Report exported successfully!');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const newPhoto: TransactionPhoto = {
        id: Date.now().toString(),
        url: event.target?.result as string,
        name: file.name,
        date: new Date().toISOString(),
      };

      const updatedPhotos = [newPhoto, ...transactionPhotos];
      setTransactionPhotos(updatedPhotos);
      localStorage.setItem('transactionPhotos', JSON.stringify(updatedPhotos));
      toast.success('Transaction photo uploaded successfully!');
    };

    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = (id: string) => {
    const updatedPhotos = transactionPhotos.filter((photo) => photo.id !== id);
    setTransactionPhotos(updatedPhotos);
    localStorage.setItem('transactionPhotos', JSON.stringify(updatedPhotos));
    toast.success('Photo deleted');
  };

  const isCloudConnected = isAuthenticated;
  const cloudSyncStatus = isCloudConnected ? 'Connected to Supabase' : 'Not connected';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black pb-24 px-4 pt-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-gray-50">Data & Backup</h1>
          <p className="text-yellow-500">Manage your data and backups</p>
        </motion.div>

        {/* Cloud Sync Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black border border-yellow-500/30 rounded-lg p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full bg-black border ${isCloudConnected ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'border-yellow-500'} flex items-center justify-center`}>
              <Cloud className={`w-6 h-6 ${isCloudConnected ? 'text-green-500' : 'text-yellow-500'}`} />
            </div>
            <div>
              <p className="text-yellow-500">Cloud Sync Status</p>
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${isCloudConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                <p className="text-gray-50 font-medium">{cloudSyncStatus}</p>
              </div>
            </div>
          </div>
          <p className="text-gray-400">
            {isCloudConnected
              ? `Your data is safely synced to Supabase Cloud (${user?.email || 'Logged In'}). Changes sync in real-time across all your devices.`
              : 'Your data is currently stored locally. Sign in with Supabase to enable cloud backup and sync across devices.'}
          </p>
        </motion.div>

        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black border border-yellow-500/30 rounded-lg p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-black border border-yellow-500 flex items-center justify-center">
              <Download className="w-5 h-5 text-yellow-500" />
            </div>
            <h2 className="text-gray-50">Export Data</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleExportToPDF}
              className="group bg-neutral-950 border border-yellow-500/30 rounded-lg p-6 hover:border-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-black border border-yellow-500 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all">
                  <FileText className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="text-left">
                  <p className="text-gray-50 mb-1">Export to PDF</p>
                  <p className="text-gray-400">Complete report with all data</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleExportToCSV}
              className="group bg-neutral-950 border border-yellow-500/30 rounded-lg p-6 hover:border-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-black border border-yellow-500 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all">
                  <FileText className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="text-left">
                  <p className="text-gray-50 mb-1">Export to CSV</p>
                  <p className="text-gray-400">For Excel and spreadsheet apps</p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Transaction Photos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black border border-yellow-500/30 rounded-lg p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-black border border-yellow-500 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-yellow-500" />
            </div>
            <h2 className="text-gray-50">Transaction Photos</h2>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            id="photo-upload"
          />
          
          <label htmlFor="photo-upload">
            <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 gap-2 cursor-pointer" asChild>
              <div>
                <Upload className="w-4 h-4" />
                Upload Transaction Photo
              </div>
            </Button>
          </label>

          <p className="text-gray-400 mt-3 mb-6">
            Store important receipts and transaction proofs (Max 5MB per image)
          </p>

          {transactionPhotos.length === 0 ? (
            <div className="text-center py-8 border border-yellow-500/10 rounded-lg">
              <ImageIcon className="w-12 h-12 text-yellow-500/50 mx-auto mb-3" />
              <p className="text-gray-400">No transaction photos yet</p>
              <p className="text-gray-500">Upload receipts to keep them safe</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {transactionPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <button
                    onClick={() => setSelectedPhoto(photo)}
                    className="w-full aspect-square rounded-lg overflow-hidden border border-yellow-500/30 hover:border-yellow-500 transition-all"
                  >
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                  <p className="text-gray-400 text-xs mt-2 truncate">{photo.name}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Auto Backup Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black border border-yellow-500/30 rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-black border border-yellow-500 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-yellow-500" />
            </div>
            <h2 className="text-gray-50">Auto-Backup Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-950 border border-yellow-500/10 rounded-lg">
              <div>
                <p className="text-gray-50">Daily Auto-Backup</p>
                <p className="text-gray-400">Automatically backup data daily</p>
              </div>
              <div className="w-12 h-6 rounded-full bg-neutral-700 flex items-center px-1">
                <div className="w-5 h-5 bg-black rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-950 border border-yellow-500/10 rounded-lg">
              <div>
                <p className="text-gray-50">Cloud Sync</p>
                <p className="text-gray-400">
                  {isCloudConnected ? 'Active: Syncing across devices' : 'Disabled: Connect to Supabase'}
                </p>
              </div>
              <div className={`w-12 h-6 rounded-full ${isCloudConnected ? 'bg-yellow-500 justify-end' : 'bg-neutral-700 justify-start'} flex items-center px-1 transition-all`}>
                <div className={`w-4 h-4 ${isCloudConnected ? 'bg-black' : 'bg-neutral-400'} rounded-full`} />
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-neutral-950 border border-yellow-500/10 rounded-lg">
            <p className="text-yellow-500 mb-2">💡 Pro Tip</p>
            <p className="text-gray-400">
              {isCloudConnected
                ? 'Your account is actively syncing with Supabase Cloud! Any expenses, caps, or subscriptions you add are automatically preserved in the cloud.'
                : 'Sign in to your account to enable automatic cloud sync and access your budget tracker from any device.'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-yellow-500 text-black rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.name}
              className="w-full h-auto rounded-lg border-2 border-yellow-500"
            />
            <div className="mt-4 p-4 bg-black border border-yellow-500/30 rounded-lg">
              <p className="text-gray-50">{selectedPhoto.name}</p>
              <p className="text-gray-400">
                Uploaded: {new Date(selectedPhoto.date).toLocaleString()}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
