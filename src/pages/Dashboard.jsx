import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  BarChart3,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
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
  const [stats, setStats] = useState({
    total: 1, // Default 1 to avoid division by zero
    notContacted: 0,
    contacting: 0,
    contacted: 0,
    done: 0
  });

  useEffect(() => {
    const unsubscribe = subscribeToCustomers((customers) => {
      const newStats = customers.reduce((acc, curr) => {
        acc.total++;
        if (curr.status === "Belum Dihubungi") acc.notContacted++;
        if (curr.status === "Sedang Dihubungi") acc.contacting++;
        if (curr.status === "Sudah Dihubungi") acc.contacted++;
        if (curr.status === "Done") acc.done++;
        return acc;
      }, { total: 0, notContacted: 0, contacting: 0, contacted: 0, done: 0 });
      
      setStats(newStats);
    });

    return () => unsubscribe();
  }, []);

  const calculatePercentage = (value) => {
    if (stats.total === 0) return 0;
    return Math.round((value / stats.total) * 100);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Dashboard Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Selamat datang di CRM Freelancer!</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-400 shadow-sm">
          <Calendar size={16} />
          {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard 
          title="Total Customer" 
          value={stats.total} 
          icon={Users} 
          color="bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
          delay={0.1}
        />
        <StatsCard 
          title="Belum Kontak" 
          value={stats.notContacted} 
          icon={UserPlus} 
          color="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          delay={0.2}
        />
        <StatsCard 
          title="Proses" 
          value={stats.contacting} 
          icon={Clock} 
          color="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
          delay={0.3}
        />
        <StatsCard 
          title="Tersambung" 
          value={stats.contacted} 
          icon={CheckCircle2} 
          color="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
          delay={0.4}
        />
        <StatsCard 
          title="Done / Deal" 
          value={stats.done} 
          icon={TrendingUp} 
          color="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
          delay={0.5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart - Minimalist UI approach */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
              <BarChart3 size={20} className="text-primary-500" />
              Progress Status
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Persentase</span>
          </div>

          <div className="space-y-6">
            {[
              { label: 'Belum Dihubungi', value: stats.notContacted, color: 'bg-slate-200 dark:bg-slate-700' },
              { label: 'Sedang Dihubungi', value: stats.contacting, color: 'bg-amber-400' },
              { label: 'Sudah Dihubungi', value: stats.contacted, color: 'bg-blue-500' },
              { label: 'Done', value: stats.done, color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{item.label}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{calculatePercentage(item.value)}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${calculatePercentage(item.value)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Conversion Rate</p>
              <h4 className="text-2xl font-black text-emerald-500">{calculatePercentage(stats.done)}%</h4>
            </div>
            <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-lg text-sm font-bold">
              <ArrowUpRight size={16} />
              +12% this month
            </div>
          </div>
        </motion.div>
        
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-primary-600 to-primary-700 p-8 rounded-3xl text-white shadow-xl shadow-primary-200 dark:shadow-none relative overflow-hidden flex-1"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                Tips Hari Ini
              </h3>
              <p className="text-primary-100 text-lg opacity-90 leading-relaxed font-medium">
                "Follow up customer yang belum merespon dalam 48 jam memiliki peluang 3x lebih tinggi untuk mendapatkan balasan."
              </p>
            </div>
            <div className="absolute -bottom-4 -right-4 text-white/10 rotate-12">
              <TrendingUp size={120} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900 dark:bg-slate-800 p-6 rounded-3xl text-white flex items-center justify-between"
          >
            <div>
              <h4 className="font-bold">Upgrade Responsivitas</h4>
              <p className="text-slate-400 text-sm">Aplikasi kini support mobile & PWA.</p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl">
              <CheckCircle2 className="text-emerald-400" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
