import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const Captcha = ({ onVerify }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const result = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setCaptchaText(result);
    setUserInput('');
    setIsVerified(false);
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    const val = e.target.value.toUpperCase();
    setUserInput(val);
    if (val === captchaText) {
      setIsVerified(true);
      onVerify(true);
    } else {
      setIsVerified(false);
      onVerify(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', marginBottom: '0.5rem' }}>
        Verify you are human
      </label>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ 
          background: 'hsla(var(--accent-primary), 0.1)', 
          padding: '0.5rem 1rem', 
          borderRadius: '8px', 
          fontFamily: 'monospace', 
          fontSize: '1.2rem', 
          fontWeight: 'bold', 
          letterSpacing: '5px',
          color: 'hsl(var(--accent-primary))',
          userSelect: 'none',
          textDecoration: 'line-through'
        }}>
          {captchaText}
        </div>
        <button type="button" onClick={generateCaptcha} className="btn-ghost" style={{ padding: '0.5rem' }}>
          <RefreshCw size={18} />
        </button>
      </div>
      <input 
        type="text" 
        placeholder="Enter CAPTCHA" 
        value={userInput}
        onChange={handleChange}
        style={{ width: '100%', marginTop: '0.5rem', borderColor: isVerified ? 'hsl(140, 70%, 50%)' : '' }}
      />
    </div>
  );
};

export default Captcha;
