import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, Globe, Key } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // ✅ Facebook OAuth handler
  const handleFacebookLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    window.location.href = `${apiUrl}/login/facebook`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let success = false;
      if (isSignUp) {
        success = await signup(formData.name, formData.email, formData.password);
        if (!success) setError('Account synthesis failed or identity already exists.');
      } else {
        success = await login(formData.email, formData.password);
        if (!success) setError('Authentication failed. Verify credentials.');
      }

      if (success) navigate('/places');
    } catch (err) {
      setError('System interruption. Please retry authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="relative pt-24 pb-32 overflow-hidden">
        <div className="max-w-md mx-auto px-6 relative z-10">
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[3rem] p-10 border-border shadow-2xl bg-white/80 backdrop-blur-xl"
          >

            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                key={isSignUp ? 'signup-icon' : 'login-icon'}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6"
              >
                {isSignUp ? <User className="w-8 h-8 text-white" /> : <Key className="w-8 h-8 text-white" />}
              </motion.div>
              <h1 className="text-4xl font-black text-slate-900 uppercase mb-2">
                {isSignUp ? 'Create Profile' : 'Authenticate'}
              </h1>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {isSignUp && (
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-slate-50"
                    required
                  />
                </div>
              )}

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-4 rounded-2xl bg-slate-50"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-slate-50"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-green-600 text-white rounded-2xl"
              >
                {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Login'}
              </button>

              {/* 🔥 Divider */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* ✅ Facebook Button */}
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="w-full py-4 rounded-2xl bg-[#1877F2] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#166fe5]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z"/>
                </svg>
                Continue with Facebook
              </button>

            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Login instead' : 'Create account'}
              </button>
            </div>

          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
