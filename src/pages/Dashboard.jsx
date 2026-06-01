import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { subscribeToCustomers } from '../services/customerService';

const StatsCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold mt-1 dark:text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    notContacted: 0,
    contacting: 0,
    contacted: 0,
    deal: 0
  });

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToCustomers(currentUser.uid, (customers) => {
      const newStats = customers.reduce((acc, curr) => {
        acc.total++;
        if (curr.status === "Belum Dihubungi") acc.notContacted++;
        if (curr.status === "Sedang Dihubungi") acc.contacting++;
        if (curr.status === "Sudah Dihubungi") acc.contacted++;
        if (curr.status === "Deal") acc.deal++;
        return acc;
      }, { total: 0, notContacted: 0, contacting: 0, contacted: 0, deal: 0 });
      
      setStats(newStats);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold dark:text-white">Dashboard Overview</h2>
        <p className="text-slate-500 dark:text-slate-400">Selamat datang kembali, {currentUser?.displayName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard 
          title="Total Customer" 
          value={stats.total} 
          icon={Users} 
          color="bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
          delay={0.1}
        />
        <StatsCard 
          title="Belum Dihubungi" 
          value={stats.notContacted} 
          icon={UserPlus} 
          color="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          delay={0.2}
        />
        <StatsCard 
          title="Sedang Dihubungi" 
          value={stats.contacting} 
          icon={Clock} 
          color="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
          delay={0.3}
        />
        <StatsCard 
          title="Sudah Dihubungi" 
          value={stats.contacted} 
          icon={CheckCircle2} 
          color="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
          delay={0.4}
        />
        <StatsCard 
          title="Berhasil Deal" 
          value={stats.deal} 
          icon={TrendingUp} 
          color="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
          delay={0.5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
            <BarChart3 size={32} />
          </div>
          <h3 className="text-lg font-bold dark:text-white">Analitik Segera Hadir</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mt-2">
            Kami sedang menyiapkan grafik performa interaktif untuk membantu Anda melacak pertumbuhan bisnis.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-8 rounded-3xl text-white shadow-lg shadow-primary-200 dark:shadow-none">
          <h3 className="text-xl font-bold mb-2">Tips Hari Ini</h3>
          <p className="text-primary-100 opacity-90 leading-relaxed">
            "Follow up customer yang belum merespon dalam 48 jam memiliki peluang 3x lebih tinggi untuk mendapatkan balasan."
          </p>
          <button className="mt-6 px-6 py-2 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
            Pelajari Selengkapnya
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
