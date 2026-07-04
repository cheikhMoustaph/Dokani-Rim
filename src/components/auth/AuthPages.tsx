'use client';

import { useState, type FormEvent } from 'react';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowRight,
  Mail,
  Lock,
  User,
  Phone,
  ShoppingBag,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   Subtle Validation Helpers
   ═══════════════════════════════════════════ */

function fieldError(value: string, label: string): string | null {
  if (!value.trim()) return `${label} مطلوب`;
  if (label.includes('بريد') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return 'البريد الإلكتروني غير صالح';
  if (label.includes('الهاتف') && !/^[\d+\s]{6,15}$/.test(value))
    return 'رقم الهاتف غير صالح';
  if (label.includes('كلمة المرور') && value.trim().length < 6)
    return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
  return null;
}

/* ═══════════════════════════════════════════
   Shared: Back to Landing Button
   ═══════════════════════════════════════════ */

function BackToLanding() {
  const { setView } = useApp();
  return (
    <button
      onClick={() => setView('landing')}
      className="absolute top-6 right-6 flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
      aria-label="العودة للرئيسية"
    >
      <ArrowRight className="h-4 w-4" />
      <span>الرئيسية</span>
    </button>
  );
}

/* ═══════════════════════════════════════════
   Shared: Error Message
   ═══════════════════════════════════════════ */

function FieldError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
      <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0" />
      {message}
    </p>
  );
}

/* ═══════════════════════════════════════════
   Shared: Input Field
   ═══════════════════════════════════════════ */

function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  icon: Icon,
  value,
  onChange,
  error,
  showToggle,
  showPassword,
  onTogglePassword,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  error: string | null;
  showToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </Label>
      <div className="relative">
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Icon className="h-4 w-4" />
        </span>
        <Input
          id={id}
          type={showToggle ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`pr-10 pl-11 h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-colors text-sm ${
            error
              ? 'border-red-400 focus-visible:ring-red-400/20'
              : 'focus-visible:ring-[#0F7A4F]/20 border-gray-200'
          }`}
          autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'off'}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      <FieldError message={error} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   LOGIN VIEW
   ═══════════════════════════════════════════ */

function LoginView() {
  const { setView } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const emailErr = fieldError(email, 'البريد الإلكتروني');
    const passErr = fieldError(password, 'كلمة المرور');
    const newErrors: Record<string, string | null> = {
      email: emailErr,
      password: passErr,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).every((v) => v === null)) {
      setView('merchant-dashboard');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-2xl shadow-xl shadow-black/5 border-0">
      <CardHeader className="text-center pb-2 pt-8 px-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F7A4F] to-[#0a5e3c] flex items-center justify-center shadow-lg shadow-[#0F7A4F]/20">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#0F7A4F]">دكاني</h1>
        <p className="text-gray-500 text-sm mt-1">تسجيل الدخول إلى حسابك</p>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <FormField
            id="login-email"
            label="البريد الإلكتروني"
            type="email"
            placeholder="example@email.com"
            icon={Mail}
            value={email}
            onChange={(v) => {
              setEmail(v);
              if (touched.email) setErrors((prev) => ({ ...prev, email: fieldError(v, 'البريد الإلكتروني') }));
            }}
            error={touched.email ? errors.email : null}
          />

          <FormField
            id="login-password"
            label="كلمة المرور"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(v) => {
              setPassword(v);
              if (touched.password) setErrors((prev) => ({ ...prev, password: fieldError(v, 'كلمة المرور') }));
            }}
            error={touched.password ? errors.password : null}
            showToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => setView('forgot-password')}
              className="text-sm text-[#0F7A4F] hover:text-[#0a5e3c] font-medium transition-colors"
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#0F7A4F] hover:bg-[#0a5e3c] text-white font-semibold text-sm shadow-lg shadow-[#0F7A4F]/20 transition-all hover:shadow-xl hover:shadow-[#0F7A4F]/30 active:scale-[0.98]"
          >
            تسجيل الدخول
          </Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-500">ليس لديك حساب؟ </span>
          <button
            onClick={() => setView('signup')}
            className="text-sm text-[#0F7A4F] hover:text-[#0a5e3c] font-semibold transition-colors"
          >
            سجّل الآن
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ═══════════════════════════════════════════
   SIGNUP VIEW
   ═══════════════════════════════════════════ */

function SignupView() {
  const { setView } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const fields: Array<{
    key: string;
    label: string;
    value: string;
    setter: (v: string) => void;
    type: string;
    placeholder: string;
  }> = [
    { key: 'name', label: 'الاسم الكامل', value: name, setter: setName, type: 'text', placeholder: 'أدخل اسمك الكامل' },
    { key: 'phone', label: 'رقم الهاتف / واتساب', value: phone, setter: setPhone, type: 'tel', placeholder: '22XX XXXX' },
    { key: 'email', label: 'البريد الإلكتروني', value: email, setter: setEmail, type: 'email', placeholder: 'example@email.com' },
    { key: 'password', label: 'كلمة المرور', value: password, setter: setPassword, type: 'password', placeholder: '••••••••' },
  ];

  const iconMap: Record<string, React.ElementType> = {
    name: User,
    phone: Phone,
    email: Mail,
    password: Lock,
  };

  const handleBlur = (key: string, value: string, label: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: fieldError(value, label) }));
  };

  const handleChange = (key: string, value: string, label: string) => {
    const setter = fields.find((f) => f.key === key)?.setter;
    setter?.(value);
    if (touched[key]) {
      setErrors((prev) => ({ ...prev, [key]: fieldError(value, label) }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newTouched: Record<string, boolean> = {};
    const newErrors: Record<string, string | null> = {};
    fields.forEach((f) => {
      newTouched[f.key] = true;
      newErrors[f.key] = fieldError(f.value, f.label);
    });
    setTouched(newTouched);
    setErrors(newErrors);
    if (Object.values(newErrors).every((v) => v === null)) {
      setView('onboarding');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-2xl shadow-xl shadow-black/5 border-0">
      <CardHeader className="text-center pb-2 pt-8 px-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F7A4F] to-[#0a5e3c] flex items-center justify-center shadow-lg shadow-[#0F7A4F]/20">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#0F7A4F]">إنشاء حساب جديد</h1>
        <p className="text-gray-500 text-sm mt-1">انضم إلى دكاني وابدأ البيع اليوم</p>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {fields.map((f) => (
            <FormField
              key={f.key}
              id={`signup-${f.key}`}
              label={f.label}
              type={f.type}
              placeholder={f.placeholder}
              icon={iconMap[f.key]}
              value={f.value}
              onChange={(v) => handleChange(f.key, v, f.label)}
              onBlur={() => handleBlur(f.key, f.value, f.label)}
              error={touched[f.key] ? errors[f.key] : null}
              showToggle={f.key === 'password'}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
          ))}

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#0F7A4F] hover:bg-[#0a5e3c] text-white font-semibold text-sm shadow-lg shadow-[#0F7A4F]/20 transition-all hover:shadow-xl hover:shadow-[#0F7A4F]/30 active:scale-[0.98]"
          >
            إنشاء حساب
          </Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-500">لديك حساب؟ </span>
          <button
            onClick={() => setView('login')}
            className="text-sm text-[#0F7A4F] hover:text-[#0a5e3c] font-semibold transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ═══════════════════════════════════════════
   FORGOT PASSWORD VIEW
   ═══════════════════════════════════════════ */

function ForgotPasswordView() {
  const { setView } = useApp();
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const emailErr = fieldError(email, 'البريد الإلكتروني');
    if (emailErr) {
      setError(emailErr);
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-2xl shadow-xl shadow-black/5 border-0">
      <CardHeader className="text-center pb-2 pt-8 px-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-amber-100 to-amber-50 flex items-center justify-center">
            <Lock className="h-8 w-8 text-[#D6A84F]" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">إعادة تعيين كلمة المرور</h1>
        <p className="text-gray-500 text-sm mt-1 leading-relaxed">
          أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
        </p>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FormField
              id="forgot-email"
              label="البريد الإلكتروني"
              type="email"
              placeholder="example@email.com"
              icon={Mail}
              value={email}
              onChange={(v) => {
                setEmail(v);
                if (touched) setError(fieldError(v, 'البريد الإلكتروني'));
              }}
              error={touched ? error : null}
            />

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#0F7A4F] hover:bg-[#0a5e3c] text-white font-semibold text-sm shadow-lg shadow-[#0F7A4F]/20 transition-all hover:shadow-xl hover:shadow-[#0F7A4F]/30 active:scale-[0.98]"
            >
              إرسال رابط إعادة التعيين
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto animate-[scale-in_0.4s_ease-out]">
              <CheckCircle2 className="h-9 w-9 text-[#0F7A4F]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">تم الإرسال بنجاح!</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                تم إرسال رابط إعادة تعيين كلمة المرور إلى
              </p>
              <p className="text-sm font-semibold text-[#0F7A4F] mt-1" dir="ltr">{email}</p>
            </div>
            <p className="text-xs text-gray-400">
              يرجى التحقق من صندوق البريد والبريد غير المرغوب فيه
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => setView('login')}
            className="text-sm text-[#0F7A4F] hover:text-[#0a5e3c] font-semibold transition-colors flex items-center gap-1.5 mx-auto"
          >
            <ArrowRight className="h-4 w-4" />
            العودة لتسجيل الدخول
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ═══════════════════════════════════════════
   MAIN: AuthPages
   ═══════════════════════════════════════════ */

export default function AuthPages() {
  const { currentView } = useApp();

  // Only render auth views
  if (
    currentView !== 'login' &&
    currentView !== 'signup' &&
    currentView !== 'forgot-password'
  ) {
    return null;
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background:
          'linear-gradient(135deg, #f0faf4 0%, #e8f5ee 30%, #FAFAF7 60%, #fef9ef 100%)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#0F7A4F]/[0.03] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#D6A84F]/[0.04] translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#0F7A4F]/[0.02]" />

      <BackToLanding />

      <div className="relative w-full max-w-md mx-auto animate-[fade-in-up_0.5s_ease-out]">
        {currentView === 'login' && <LoginView />}
        {currentView === 'signup' && <SignupView />}
        {currentView === 'forgot-password' && <ForgotPasswordView />}
      </div>

      {/* Keyframe animation injected via style tag */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}