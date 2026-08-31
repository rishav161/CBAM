import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider.jsx';

export function AdminRoute({ children }) {
  const { isSuperAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Verifying admin permissions...</span>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return <Navigate to="/upload" replace />;
  }

  return children;
}

export default AdminRoute;
