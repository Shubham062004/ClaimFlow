import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { claimFormSchema, ClaimFormData } from '@/utils/validators';
import { claimService } from '@/services/claimService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import { ROUTES } from '@/constants/routes';
import { FilePlus, DollarSign, Stethoscope, Hash, ArrowLeft, Send, Upload, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const NewClaimPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimFormData>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      providerName: '',
      serviceDate: new Date().toISOString().split('T')[0],
      totalAmount: 150.0,
      diagnosisCode: 'M54.5',
      procedureCode: '99214',
      description: 'Outpatient consultation and diagnosis evaluation.',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds maximum allowed limit of 5MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data: ClaimFormData) => {
    setIsSubmitting(true);
    try {
      await claimService.createClaim({
        provider: data.providerName,
        claimAmount: data.totalAmount,
        diagnosisCode: data.diagnosisCode,
        procedureCode: data.procedureCode,
        description: data.description,
        document: selectedFile,
      });
      toast.success('Healthcare claim submitted successfully!');
      navigate(ROUTES.PATIENT.MY_CLAIMS);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit claim. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Submit New Healthcare Claim</h1>
          <p className="text-sm text-slate-500">Enter medical service details for reimbursement processing.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
            <FilePlus className="w-4 h-4" />
            <span>Claim Details Form</span>
          </div>
          <CardTitle>Medical Service Intake</CardTitle>
          <CardDescription>
            All fields marked with an asterisk (<span className="text-red-500">*</span>) are required.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField label="Healthcare Provider / Clinic Name" required error={errors.providerName?.message}>
              <Input
                {...register('providerName')}
                placeholder="e.g. Memorial Health System"
                leftIcon={<Stethoscope className="w-4 h-4 text-slate-400" />}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Total Billed Amount ($ USD)" required error={errors.totalAmount?.message}>
                <Input
                  {...register('totalAmount')}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  leftIcon={<DollarSign className="w-4 h-4 text-slate-400" />}
                />
              </FormField>

              <FormField label="ICD-10 Diagnosis Code" required error={errors.diagnosisCode?.message}>
                <Input
                  {...register('diagnosisCode')}
                  placeholder="e.g. M54.5"
                  leftIcon={<Hash className="w-4 h-4 text-slate-400" />}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="CPT Procedure Code" required error={errors.procedureCode?.message}>
                <Input
                  {...register('procedureCode')}
                  placeholder="e.g. 99214"
                  leftIcon={<Hash className="w-4 h-4 text-slate-400" />}
                />
              </FormField>

              <FormField label="Medical Attachment (PDF, PNG, JPG - Max 5MB)">
                <div className="relative flex items-center justify-between border border-slate-200 rounded-xl p-2.5 bg-slate-50/50">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Upload className="w-4 h-4 text-blue-600" />
                    {selectedFile ? (
                      <span className="font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    ) : (
                      <span>Upload Itemized Bill / Diagnosis PDF</span>
                    )}
                  </div>
                </div>
              </FormField>
            </div>

            <FormField label="Service Description & Medical Reason" required error={errors.description?.message}>
              <div className="relative">
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Describe treatment, diagnosis, and medical reason..."
                  className="w-full bg-white text-slate-900 text-sm rounded-xl border border-slate-200/90 py-2.5 px-3.5 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                />
              </div>
            </FormField>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button type="button" variant="ghost" onClick={() => navigate(ROUTES.PATIENT.DASHBOARD)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Claim for Review
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
