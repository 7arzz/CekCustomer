import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to="/" />;
  }

  const handleLogin = async () => {
    try {
      await login();
      navigate('/');
    } catch (error) {
      console.error("Failed to log in", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 text-center"
      >
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200 dark:shadow-none">
            <span className="text-3xl text-white font-bold">C</span>
          </div>
          <h1 className="text-2xl font-bold dark:text-white">CRM Freelancer</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Kelola calon customer Anda dengan lebih profesional.</p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 py-3 px-4 rounded-xl font-medium text-slate-700 dark:text-slate-200 transition-all shadow-sm"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-5 h-5"
          />
          Masuk dengan Google
        </button>
        
        <p className="mt-8 text-xs text-slate-400">
          Dengan masuk, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
