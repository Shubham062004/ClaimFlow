import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Activity, FileCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ROUTES } from '@/constants/routes';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Placeholder Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>Next-Generation Healthcare Claims Processing</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Automated Healthcare Claims with <span className="text-[#2563EB]">Precision & Speed</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          ClaimFlow connects patients and insurers in a unified, real-time adjudication platform designed for modern healthcare delivery.
        </p>

        <div className="flex items-center justify-center gap-4 pt-2">
          <Link to={ROUTES.LOGIN}>
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Portal Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <FileCheck className="w-5 h-5" />
            </div>
            <CardTitle>Instant Claim Filing</CardTitle>
            <CardDescription>Submit medical claims with automated ICD-10 and CPT validation.</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-500">
            Placeholder feature section for patient claim intake workflow.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center mb-3 shadow-soft">
              <Activity className="w-5 h-5" />
            </div>
            <CardTitle>Real-Time Adjudication</CardTitle>
            <CardDescription>Rules engine for automated claim review and approval routing.</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-500">
            Placeholder feature section for insurer adjudication workflow.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <CardTitle>HIPAA Compliant Security</CardTitle>
            <CardDescription>End-to-end encryption for protected health information (PHI).</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-500">
            Placeholder feature section for security and compliance architecture.
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
