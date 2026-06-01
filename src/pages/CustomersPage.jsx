import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Users,
  SearchX
} from 'lucide-react';
import { 
  subscribeToCustomers, 
  addCustomer, 
  updateCustomer, 
  deleteCustomer,
  addNote 
} from '../services/customerService';
import CustomerCard from '../components/CustomerCard';
import AddCustomerModal from '../components/AddCustomerModal';
import CustomerDetailDrawer from '../components/CustomerDetailDrawer';
import toast from 'react-hot-toast';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToCustomers((data) => {
      setCustomers(data);
      setLoading(false);
      
      if (selectedCustomer) {
        const updated = data.find(c => c.id === selectedCustomer.id);
        if (updated) setSelectedCustomer(updated);
      }
    });

    return () => unsubscribe();
  }, [selectedCustomer?.id]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  const handleAddCustomer = async (data) => {
    try {
      await addCustomer(data);
      setIsAddModalOpen(false);
      toast.success('Customer berhasil ditambahkan!');
    } catch (error) {
      console.error(error);
      toast.error('Gagal menambahkan customer.');
    }
  };

  const handleUpdateCustomer = async (id, updates) => {
    try {
      await updateCustomer(id, updates);
      toast.success('Status diperbarui');
    } catch (error) {
       console.error(error);
       toast.error('Gagal memperbarui status.');
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await deleteCustomer(id);
      toast.success('Customer berhasil dihapus');
    } catch (error) {
        console.error(error);
        toast.error('Gagal menghapus customer.');
    }
  };

  const handleAddNoteToCustomer = async (id, note, currentNotes) => {
    try {
      await addNote(id, note, currentNotes);
      toast.success('Catatan ditambahkan');
    } catch (error) {
        console.error(error);
        toast.error('Gagal menambahkan catatan.');
    }
  };

  const openDetail = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Daftar Customer</h2>
          <p className="text-slate-500 dark:text-slate-400">Total {customers.length} prospek dalam database.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2 shadow-lg shadow-primary-200 dark:shadow-none"
        >
          <Plus size={20} /> Tambah Customer
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Cari nama, bisnis, atau kategori..."
            className="input-field pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
            <button className="btn-secondary px-3 flex items-center gap-2">
              <Filter size={18} /> Filter
            </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-slate-100 dark:bg-slate-900 animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800" />
            ))}
        </div>
      ) : filteredCustomers.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCustomers.map((customer) => (
              <CustomerCard 
                key={customer.id} 
                customer={customer} 
                onClick={openDetail}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mb-4">
             {searchQuery ? <SearchX size={40} /> : <Users size={40} />}
          </div>
          <h3 className="text-xl font-bold dark:text-white">
            {searchQuery ? 'Pencarian tidak ditemukan' : 'Belum ada customer'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-2">
            {searchQuery 
              ? `Tidak ada hasil untuk "${searchQuery}". Coba gunakan kata kunci lain.`
              : 'Mulai bangun database customer Anda dengan menekan tombol "Tambah Customer" di atas.'}
          </p>
        </motion.div>
      )}

      <AddCustomerModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCustomer}
      />

      <CustomerDetailDrawer 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        customer={selectedCustomer}
        onUpdate={handleUpdateCustomer}
        onDelete={handleDeleteCustomer}
        onAddNote={handleAddNoteToCustomer}
      />

      {/* Floating Action Button for Mobile */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAddModalOpen(true)}
        className="lg:hidden fixed right-6 bottom-20 w-14 h-14 bg-primary-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 shadow-primary-500/40"
      >
        <Plus size={24} strokeWidth={3} />
      </motion.button>
    </div>
  );
};

export default CustomersPage;
