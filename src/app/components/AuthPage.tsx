import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function AuthPage() {
  const { theme } = useTheme();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Starting authentication...', { isLogin, email: formData.email });
      if (isLogin) {
        await login(formData.email, formData.password);
        console.log('Login successful!');
      } else {
        await signup(formData.name, formData.email, formData.password);
        console.log('Signup successful!');
      }
      // If we get here, authentication was successful
      // The App component should automatically redirect
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-[#0A1628] via-[#111827] to-[#0A1628]' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100'
    }`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-primary/10' : 'bg-primary/20'
        }`} />
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-500/20'
        }`} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-[#2563EB] mb-4 shadow-lg shadow-primary/30"
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Energy Forecast 
          </h1>
          <p className="text-foreground-secondary">
            Probabilistic demand forecasting for grid operators
          </p>
        </div>

        {/* Auth card */}
        <motion.div
          layout
          className={`backdrop-blur-xl rounded-2xl p-8 shadow-2xl border ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white/90 border-gray-200'
          }`}
        >
          {/* Toggle between login and signup */}
          <div className={`flex gap-2 mb-6 p-1 rounded-xl ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
          }`}>
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                isLogin
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                !isLogin
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required={!isLogin}
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                        theme === 'dark'
                          ? 'bg-white/5 border-white/10 text-white placeholder:text-muted-foreground'
                          : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                      }`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  required
                  className={`w-full pl-11 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-muted-foreground'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className={`w-full pl-11 pr-11 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-muted-foreground'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              )}
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-foreground-secondary">Remember me</span>
                </label>
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary to-[#2563EB] text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>{isLogin ? 'Sign In' : 'Create Account'}</>
              )}
            </button>
          </form>

          {/* Additional info */}
          <div className="mt-6 text-center text-sm text-foreground-secondary">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-primary hover:text-primary/80 transition-colors font-semibold"
                >
                  Sign up for free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-primary hover:text-primary/80 transition-colors font-semibold"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-foreground-secondary">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
