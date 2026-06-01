import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getStatusColor } from '../utils/statusUtils';

const CustomerCard = ({ customer, onClick }) => {
  const contactedLinks = customer.links?.filter(l => l.contacted).length || 0;
  const totalLinks = customer.links?.length || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
      onClick={() => onClick(customer)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 overflow-hidden border border-slate-200 dark:border-slate-700">
            {customer.photoUrl ? (
              <img src={customer.photoUrl} alt={customer.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold">{customer.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
              {customer.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{customer.businessName}</p>
          </div>
        </div>
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${getStatusColor(customer.status)}`}>
          {customer.status}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Progres Kontak</span>
          <span className="font-medium dark:text-slate-300">{contactedLinks}/{totalLinks} Link</span>
        </div>
        
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(contactedLinks / totalLinks) * 100}%` }}
            className="h-full bg-primary-500 rounded-full"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex -space-x-2">
            {customer.links?.map((link, idx) => (
              <div 
                key={idx}
                className={`w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold ${
                  link.contacted ? 'bg-primary-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {link.label.charAt(0)}
              </div>
            ))}
          </div>
          
          <button className="flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Detail <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerCard;
