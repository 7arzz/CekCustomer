import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import CustomersPage from './pages/CustomersPage';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <Layout>
                <Dashboard />
              </Layout>
            } 
          />
          <Route 
            path="/customers" 
            element={
              <Layout>
                <CustomersPage />
              </Layout>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
