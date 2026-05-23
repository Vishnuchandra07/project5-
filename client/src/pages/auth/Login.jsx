import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';
import AuthFormField from '../../components/auth/AuthFormField';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (sessionStorage.getItem('sessionExpired')) {
      setError('Your session ended. Please sign in again.');
      sessionStorage.removeItem('sessionExpired');
    }
  }, []);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not sign in. Check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Use the account you registered with"
      alternate={
        <p className="text-center text-sm text-slate-500">
          New here?{' '}
          <Link
            to="/register"
            state={location.state}
            className="font-medium text-teal-700 hover:text-teal-800"
          >
            Create an account
          </Link>
        </p>
      }
    >
      {error && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <AuthFormField
          label="Work email"
          name="email"
          type="email"
          icon={FiMail}
          placeholder="you@factory.com"
          value={form.email}
          onChange={onChange}
          autoComplete="email"
        />
        <AuthFormField
          label="Password"
          name="password"
          type="password"
          icon={FiLock}
          value={form.password}
          onChange={onChange}
          autoComplete="current-password"
        />
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
