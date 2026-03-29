import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Fix #3 — extracted to module level; stable reference means no subtree remount on App re-render
interface Props { children: ReactNode }

const ProtectedRoute = ({ children }: Props) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="skeleton" style={{ width: '120px', height: '24px' }} />
          </div>
          <div className="sidebar-nav mt-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton mb-2" style={{ width: '100%', height: '36px' }} />
            ))}
          </div>
        </aside>
        <main className="main-stage">
          <header className="stage-header">
            <div className="skeleton" style={{ width: '200px', height: '24px' }} />
            <div className="skeleton" style={{ width: '100px', height: '36px' }} />
          </header>
        </main>
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
