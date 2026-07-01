import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Trash2,
  Link as LinkIcon,
  User,
  Briefcase,
  Tag,
  FileText,
} from "lucide-react";
import { determineStatus } from "../utils/statusUtils";

const AddCustomerModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    category: "",
    notes: [],
    links: [
      { label: "Instagram", url: "", contacted: false },
    ],
  });

  const handleAddLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { label: "", url: "", contacted: false }],
    });
  };

  const handleRemoveLink = (index) => {
    const newLinks = [...formData.links];
    newLinks.splice(index, 1);
    setFormData({ ...formData, links: newLinks });
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData({ ...formData, links: newLinks });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const status = determineStatus(formData.links);
    onAdd({
      ...formData,
      status,
      createdAt: new Date(),
    });
    // Reset form
    setFormData({
      name: "",
      businessName: "",
      category: "",
      notes: [],
      links: [
        { label: "Instagram", url: "", contacted: false },
      ],
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl lg:rounded-3xl shadow-2xl overflow-hidden h-[95vh] lg:h-auto max-h-[95vh] flex flex-col"
        >
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-bold dark:text-white">
                Tambah Customer Baru
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Masukkan detail prospek baru Anda.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 overflow-y-auto space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <User size={16} /> Nama Customer
                </label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Sarah Johnson"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Briefcase size={16} /> Nama Bisnis
                </label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Sarah Wedding"
                  className="input-field"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Tag size={16} /> Kategori Bisnis
                </label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Wedding Organizer"
                  className="input-field"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Link Kontak
                </label>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Plus size={14} /> Tambah Link
                </button>
              </div>

              <div className="space-y-3">
                {formData.links.map((link, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 items-start sm:items-end bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 relative"
                  >
                    <div className="w-full sm:flex-1 space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-300">
                        Label
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="WhatsApp, Instagram..."
                        className="input-field py-1.5 text-sm"
                        value={link.label}
                        onChange={(e) =>
                          handleLinkChange(index, "label", e.target.value)
                        }
                      />
                    </div>
                    <div className="w-full sm:flex-[2] space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-300">
                        URL / Username
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="https://..."
                        className="input-field py-1.5 text-sm"
                        value={link.url}
                        onChange={(e) =>
                          handleLinkChange(index, "url", e.target.value)
                        }
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(index)}
                      className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 p-2 text-slate-400 hover:text-red-500 transition-colors"
                      disabled={formData.links.length <= 1}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>

          <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Batal
            </button>
            <button onClick={handleSubmit} className="flex-[2] btn-primary">
              Simpan Customer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddCustomerModal;
