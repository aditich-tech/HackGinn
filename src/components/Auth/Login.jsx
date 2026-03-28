import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Captcha from './Captcha';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isCaptchaVerified) {
      setError('Please verify CAPTCHA!');
      return;
    }

    // Mock Login Logic
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === formData.email && u.password === formData.password);

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } else {
      setError('Invalid email or password!');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-container glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: 'hsl(var(--text-secondary))', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Unleash your creativity with HackGinn
        </p>

        {error && <div style={{ color: '#ff4444', marginBottom: '1rem', textAlign: 'center', fontSize: '0.8rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <Captcha onVerify={setIsCaptchaVerified} />

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Login</button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'hsl(var(--accent-primary))', fontWeight: 'bold' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
