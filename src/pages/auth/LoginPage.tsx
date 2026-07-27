import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, LoginFormData } from '@/utils/validators';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import { Mail, Lock, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { ROLES, UserRole } from '@/constants/roles';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'eleanor.vance@example.com',
      password: 'password123',
      role: 'patient',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success(`Welcome to ClaimFlow ${data.role} portal!`);
    } catch (e) {
      toast.error('Authentication failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setValue('role', role);
    if (role === ROLES.PATIENT) {
      setValue('email', 'eleanor.vance@example.com');
    } else {
      setValue('email', 'dr.marcus@apexinsurer.com');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sign in to your account</h2>
        <p className="text-xs text-slate-500">Select your portal perspective to access ClaimFlow</p>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Email Address" required error={errors.email?.message}>
          <Input
            {...register('email')}
            type="email"
            placeholder="name@example.com"
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
          />
        </FormField>

        <FormField label="Password" required error={errors.password?.message}>
          <Input
            {...register('password')}
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
          />
        </FormField>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In to {selectedRole === ROLES.PATIENT ? 'Patient Portal' : 'Insurer Portal'}
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-400">
        Demonstration environment — authentication logic pre-configured with mock session.
      </div>
    </div>
  );
};
