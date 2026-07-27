import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, LoginFormData } from '@/utils/validators';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import { Mail, Lock, ArrowRight, UserCheck, ShieldCheck, UserPlus, Eye, EyeOff } from 'lucide-react';
import { ROLES, UserRole } from '@/constants/roles';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const { login, register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'patient',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      if (mode === 'register') {
        if (!name.trim()) {
          toast.error('Please enter your full name');
          setIsSubmitting(false);
          return;
        }
        await registerUser({
          name: name.trim(),
          email: data.email,
          password: data.password,
        });
        toast.success('Registration successful! Welcome to ClaimFlow.');
      } else {
        await login(data);
        toast.success(`Signed in successfully as ${data.email}!`);
      }
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'Authentication failed. Please check credentials.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setValue('role', role);
    if (role === ROLES.INSURER) {
      setMode('login'); // Insurers can only log in
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {mode === 'register' ? 'Create Patient Account' : 'Sign in to your account'}
        </h2>
        <p className="text-xs text-slate-500">
          {mode === 'register'
            ? 'Sign up to submit and track your healthcare claims'
            : 'Select your portal perspective to access ClaimFlow'}
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
        <button
          type="button"
          onClick={() => handleRoleSelect(ROLES.PATIENT)}
          className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            selectedRole === ROLES.PATIENT
              ? 'bg-white text-[#2563EB] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          Patient Portal
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect(ROLES.INSURER)}
          className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            selectedRole === ROLES.INSURER
              ? 'bg-white text-[#2563EB] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Insurer Portal
        </button>
      </div>

      {/* Sign In vs Sign Up mode toggle for Patients */}
      {selectedRole === ROLES.PATIENT && (
        <div className="flex justify-center gap-4 text-xs font-medium border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`pb-1 ${mode === 'login' ? 'text-[#2563EB] font-semibold border-b-2 border-[#2563EB]' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`pb-1 ${mode === 'register' ? 'text-[#2563EB] font-semibold border-b-2 border-[#2563EB]' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Create New Account
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {mode === 'register' && selectedRole === ROLES.PATIENT && (
          <FormField label="Full Name" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Eleanor Vance"
              leftIcon={<UserPlus className="w-4 h-4 text-slate-400" />}
            />
          </FormField>
        )}

        <FormField label="Email Address" required error={errors.email?.message}>
          <Input
            {...register('email')}
            type="email"
            placeholder={selectedRole === ROLES.PATIENT ? 'patient@claimflow.com' : 'insurer@claimflow.com'}
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
          />
        </FormField>

        <FormField label="Password" required error={errors.password?.message}>
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password123!"
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </FormField>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {mode === 'register'
            ? 'Sign Up as Patient'
            : `Sign In to ${selectedRole === ROLES.PATIENT ? 'Patient Portal' : 'Insurer Portal'}`}
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-400">
        Demo accounts pre-loaded: <span className="font-semibold text-slate-600">patient@claimflow.com</span> & <span className="font-semibold text-slate-600">insurer@claimflow.com</span> (Password: <span className="font-semibold text-slate-600">Password123!</span>)
      </div>
    </div>
  );
};
