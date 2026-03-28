import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, Zap } from 'lucide-react';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const getUser = () => {
    const userStr = localStorage.getItem('user');
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return userStr ? { name: userStr } : null;
    }
  };
  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="glass-container" style={{ 
      margin: '1rem 2rem', 
      padding: '0.8rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: '1rem',
      zIndex: 1000
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Zap size={28} color="hsl(var(--accent-primary))" />
        <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.05em' }}>
          Hack<span style={{ color: 'hsl(var(--accent-primary))' }}>Ginn</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button 
          onClick={toggleTheme} 
          className="btn-ghost" 
          style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center' }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>
              Hi, {user.name}
            </span>
            <button onClick={handleLogout} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn-ghost">Login</Link>
            <Link to="/signup" className="btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
