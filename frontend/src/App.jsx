import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SidebarNavigation from './components/common/SidebarNavigation.jsx';
import UploadFlowView from './components/views/UploadFlowView.jsx';
import UploadedListsView from './components/views/UploadedListsView.jsx';
import DatasetDetailsView from './components/views/DatasetDetailsView.jsx';
import BenchmarkFactorsView from './components/views/BenchmarkFactorsView.jsx';
import LoginView from './components/views/LoginView.jsx';
import UserManagementView from './components/views/UserManagementView.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import AdminRoute from './components/common/AdminRoute.jsx';
import { AuthProvider } from './providers/AuthProvider.jsx';

function MainLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      <SidebarNavigation />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Navigate to="/upload" replace />} />
          <Route path="/upload" element={<UploadFlowView />} />
          <Route path="/lists" element={<UploadedListsView />} />
          <Route path="/lists/:batchId" element={<DatasetDetailsView />} />
          <Route path="/benchmarks" element={<BenchmarkFactorsView />} />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManagementView />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginView />} />

          {/* Protected Application Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
