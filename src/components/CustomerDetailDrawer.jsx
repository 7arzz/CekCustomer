import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MessageSquare, 
  Plus, 
  Trash2,
  CheckCircle,
  Circle,
  MoreVertical,
  History,
  TrendingUp,
  User,
  Briefcase,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { determineStatus, getStatusColor } from '../utils/statusUtils';

const CustomerDetailDrawer = ({ isOpen, onClose, customer, onUpdate, onDelete, onAddNote }) => {
  const [newNote, setNewNote] = useState('');

  if (!customer) return null;

  const handleToggleLink = async (index) => {
    const updatedLinks = [...customer.links];
    updatedLinks[index].contacted = !updatedLinks[index].contacted;
    
    // Automatically open link if just marked as contacted
    if (updatedLinks[index].contacted && updatedLinks[index].url) {
        window.open(updatedLinks[index].url, '_blank');
    }

    const newStatus = determineStatus(updatedLinks, customer.status === "Deal");
    
    const activity = {
        id: `activity-${Date.now()}`,
        date: new Date(),
        text: `${updatedLinks[index].label} dihubungi`
    };

    onUpdate(customer.id, { 
      links: updatedLinks, 
      status: newStatus,
      activity: [activity, ...(customer.activity || [])]
    });
  };

  const handleMarkDeal = () => {
     const activity = {
        id: `activity-${Date.now()}`,
        date: new Date(),
        text: "Status Deal"
    };
    onUpdate(customer.id, { 
      status: "Deal",
      activity: [activity, ...(customer.activity || [])]
    });
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(customer.id, newNote, customer.notes || []);
    setNewNote('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-xl bg-white dark:bg-slate-950 shadow-2xl z-[110] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xl">
                   {customer.photoUrl ? (
                     <img src={customer.photoUrl} alt={customer.name} className="w-full h-full object-cover rounded-2xl" />
                   ) : customer.name.charAt(0)}
                 </div>
                 <div>
                   <h2 className="text-xl font-bold dark:text-white leading-tight">{customer.name}</h2>
                   <p className="text-sm text-slate-500 dark:text-slate-400">{customer.businessName}</p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    if(window.confirm('Hapus customer ini?')) {
                      onDelete(customer.id);
                      onClose();
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                    <Trash2 size={20} />
                </button>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Status Section */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                 <div className="space-y-1">
                   <p className="text-[10px] uppercase font-bold text-slate-400">Status Saat Ini</p>
                   <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(customer.status)}`}>
                     {customer.status === "Deal" && <TrendingUp size={14} />}
                     {customer.status}
                   </span>
                 </div>
                 {customer.status !== "Deal" && (
                   <button 
                    onClick={handleMarkDeal}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-200 dark:shadow-none"
                   >
                     Tandai Deal
                   </button>
                 )}
              </div>

              {/* Links Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                   <ExternalLink size={18} className="text-primary-500" /> Daftar Link Kontak
                </h3>
                <div className="grid gap-3">
                  {customer.links?.map((link, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        link.contacted 
                        ? 'bg-primary-50/50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-900/30' 
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleLink(idx)}
                          className={link.contacted ? 'text-primary-500' : 'text-slate-300 dark:text-slate-700'}
                        >
                          {link.contacted ? <CheckCircle size={24} /> : <Circle size={24} />}
                        </button>
                        <div>
                          <p className={`font-bold text-sm ${link.contacted ? 'text-primary-900 dark:text-primary-100' : 'text-slate-700 dark:text-slate-300'}`}>
                            {link.label}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-[200px]">{link.url}</p>
                        </div>
                      </div>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 bg-white dark:bg-slate-800 text-slate-400 hover:text-primary-500 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 transition-all"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                   <MessageSquare size={18} className="text-primary-500" /> Catatan
                </h3>
                <form onSubmit={handleNoteSubmit} className="relative">
                  <textarea 
                    placeholder="Tambah catatan baru..."
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none text-sm dark:text-slate-200"
                    rows="3"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="absolute bottom-3 right-3 p-2 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </form>

                <div className="space-y-4 pt-2">
                  {customer.notes?.map((note, idx) => (
                    <div key={note.id || idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Calendar size={12} /> {format(new Date(note.date), 'dd MMM yyyy', { locale: id })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity History */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                   <History size={18} className="text-primary-500" /> Riwayat Aktivitas
                </h3>
                <div className="space-y-6 pl-2 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                  {customer.activity?.map((act, idx) => (
                    <div key={act.id || idx} className="relative pl-8">
                       <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-2 border-primary-500 z-10" />
                       <p className="text-xs font-bold text-slate-400 mb-1">
                         {format(new Date(act.date), 'dd MMM yyyy, HH:mm', { locale: id })}
                       </p>
                       <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{act.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomerDetailDrawer;
