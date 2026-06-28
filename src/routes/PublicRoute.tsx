import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

interface PublicRouteProps {
  children: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader size="large" message="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    // If authenticated, redirect logged-in users to the dashboard automatically
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
