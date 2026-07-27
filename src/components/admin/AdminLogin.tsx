import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onReturnToPatientSite: () => void;
  loginFn: (email: string, password: string) => Promise<any>;
  initialError?: string | null;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onReturnToPatientSite,
  loginFn,
  initialError
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);
  const [loginSuccessToast, setLoginSuccessToast] = useState(false);

  // Mouse interaction state with lerp & RAF for silky 60fps smoothing
  const targetMouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const currentMouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [spotlightPos, setSpotlightPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, translateX: 0, translateY: 0 });

  useEffect(() => {
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current = { x: e.clientX, y: e.clientY };
    };

    const updateLoop = () => {
      // Lerp easing (8% interpolation per frame)
      const ease = 0.08;
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * ease;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * ease;

      const currX = currentMouse.current.x;
      const currY = currentMouse.current.y;

      setSpotlightPos({ x: currX, y: currY });

      // Calculate relative offsets from screen center (-1 to 1)
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const normalizedX = (currX - centerX) / centerX;
      const normalizedY = (currY - centerY) / centerY;

      // Subdued 3D card tilt & parallax translation
      setTilt({
        rotateX: -normalizedY * 4,
        rotateY: normalizedX * 4,
        translateX: normalizedX * 8,
        translateY: normalizedY * 8,
      });

      animId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await loginFn(email.trim(), password.trim());
      setLoginSuccessToast(true);
      setTimeout(() => {
        onLoginSuccess();
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden font-sans">
      
      {/* Interactive Mouse Spotlight Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(650px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(59, 130, 246, 0.12), rgba(14, 165, 233, 0.04) 45%, transparent 80%)`
        }}
      />

      {/* Dynamic Background Effects (Grid pattern & gradient radial glow with parallax response) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${-tilt.translateX * 2}px, ${-tilt.translateY * 2}px, 0)`
        }}
      />
      <div 
        className="absolute top-1/2 right-10 w-72 h-72 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${tilt.translateX * 3}px, ${tilt.translateY * 3}px, 0)`
        }}
      />

      {/* Top Bar Navigation */}
      <div className="p-6 sm:px-10 flex justify-between items-center z-10">
        <button
          onClick={onReturnToPatientSite}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>Back to SmileSync Patient Portal</span>
        </button>

        <div 
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium transition-transform duration-200 ease-out"
          style={{
            transform: `translate3d(${tilt.translateX * 0.5}px, ${tilt.translateY * 0.5}px, 0)`
          }}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Secure Admin Gate • JWT + Bcrypt</span>
        </div>
      </div>

      {/* Main Login Card Area with Smooth Mouse Tilt */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 [perspective:1000px]">
        <div 
          className="w-full max-w-md transition-transform duration-100 ease-out"
          style={{
            transform: `translate3d(${tilt.translateX}px, ${tilt.translateY}px, 0) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
          }}
        >
          
          {/* Card Frame */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-blue-950/40 relative">
            
            {/* Header / Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/25 mb-4 group hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                <span>SmileSync Admin</span>
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              </h1>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed max-w-xs mx-auto">
                Sign in to manage appointments, AI chat logs, and clinic operations.
              </p>
            </div>

            {/* Success Toast */}
            {loginSuccessToast && (
              <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Authenticated! Redirecting to dashboard...</span>
              </div>
            )}

            {/* Error Alert Banner */}
            {error && !loginSuccessToast && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-rose-200">Authentication Failed</p>
                  <p className="mt-0.5 text-rose-300/90 leading-normal">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@smilesync.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">bcrypt protected</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/30 focus:ring-offset-0 transition-all"
                  />
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                    Keep me logged in
                  </span>
                </label>
                <span className="text-xs text-blue-400/80 hover:text-blue-300 cursor-pointer font-medium">
                  Single Admin Account
                </span>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading || loginSuccessToast}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In to Admin Panel</span>
                  </>
                )}
              </button>

            </form>

            {/* Note Footer */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
              <span>SmileSync Dental AI • Administrative Access Portal</span>
            </div>

          </div>
        </div>
      </div>

      {/* Security Footer Note */}
      <div className="p-6 text-center text-xs text-slate-600 z-10 flex items-center justify-center gap-3">
        <span>🔒 256-Bit Encrypted JWT Tokens</span>
        <span>•</span>
        <span>SQLite + Bcrypt Database Storage</span>
        <span>•</span>
        <span>FastAPI & Express Backend</span>
      </div>

    </div>
  );
};
