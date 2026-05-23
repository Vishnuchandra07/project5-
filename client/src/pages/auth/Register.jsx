import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';
import AuthFormField from '../../components/auth/AuthFormField';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up access for your BD workspace"
      alternate={
        <p className="text-center text-sm text-slate-500">
          Already registered?{' '}
          <Link
            to="/login"
            state={location.state}
            className="font-medium text-teal-700 hover:text-teal-800"
          >
            Sign in
          </Link>
        </p>
      }
    >
      {error && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <AuthFormField
          label="Your name"
          name="name"
          icon={FiUser}
          value={form.name}
          onChange={onChange}
          autoComplete="name"
        />
        <AuthFormField
          label="Email"
          name="email"
          type="email"
          icon={FiMail}
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
          minLength={6}
          autoComplete="new-password"
        />
        <AuthFormField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          icon={FiLock}
          value={form.confirmPassword}
          onChange={onChange}
          autoComplete="new-password"
        />
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Register'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;
