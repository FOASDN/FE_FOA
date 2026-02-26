import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import authService from "@/services/auth.service";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(['auth', 'common']);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError(t('auth:resetPassword.passwordMismatch', 'Mật khẩu không khớp'));
            return;
        }
        setLoading(true);
        setError("");
        try {
            await authService.resetPassword({ verificationCode: token, password, confirm_password: confirmPassword });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch {
            setError(t('auth:resetPassword.invalidToken'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Left: Visual Pane */}
            <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-[#23170f]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuA81O2D9tSoFxEUm1s3HT_FA1Fe7jlURbAQeWecZnWeSBJvGfRy0woZUMt8HT1pBd_WJGIZUdscpbJulNaInv-ct4EACX_-2W2jY-EWDmN9Vl5bgCM3ifXYRp1_likq6ebQgIuFTTUejrpoh0CdGyYOzxgdWw1VBsedARwN7l_AXBxYjpEHWCfmLQn3W-kmXxE4vlB06q1ZHgoFOJ9d_oSeHgSmFlMtXY3QZA4kdc7PNDQ0kekJVA_Nz36Az3twZxp6Od-toSdgFRk")`,
                    }}
                />
                <div className="relative z-10 flex flex-col justify-end p-16 w-full h-full">
                    <div className="max-w-xl">
                        <h1 className="text-white text-5xl font-black leading-tight tracking-tight mb-6">
                            {t('auth:resetPassword.heroTitle', 'Tạo mật khẩu mới, thật an toàn.')}
                        </h1>
                        <div className="h-1 w-20 bg-orange-500 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Right: Form */}
            <div className="w-full lg:w-2/5 flex flex-col justify-center items-center bg-card p-8 md:p-16 overflow-y-auto">
                <div className="w-full max-w-[420px] flex flex-col gap-8">
                    {/* Logo */}
                    <div className="flex flex-col items-center text-center gap-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 text-orange-600 group"
                        >
                            <div className="bg-orange-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
                            </div>
                            <h2 className="text-2xl font-black tracking-tighter">FoodieDash</h2>
                        </Link>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-foreground text-3xl font-black tracking-tight">
                                {t('auth:resetPassword.title')}
                            </h2>
                        </div>
                    </div>

                    {success ? (
                        /* Success State */
                        <div className="flex flex-col items-center gap-6 text-center">
                            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                                <span className="material-symbols-outlined text-emerald-600 text-4xl">check_circle</span>
                            </div>
                            <p className="text-foreground text-lg font-semibold">
                                {t('auth:resetPassword.success')}
                            </p>
                            <p className="text-muted-foreground text-sm">
                                {t('auth:resetPassword.redirecting', 'Đang chuyển hướng đến trang đăng nhập...')}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-foreground text-sm font-semibold px-1">
                                    {t('auth:resetPassword.newPassword')}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-lg border border-input bg-background h-12 px-4 pr-12 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                                        placeholder={t('auth:resetPassword.newPasswordPlaceholder')}
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <span className="material-symbols-outlined">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-foreground text-sm font-semibold px-1">
                                    {t('auth:resetPassword.confirmPassword')}
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background h-12 px-4 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                                    placeholder={t('auth:resetPassword.confirmPasswordPlaceholder')}
                                    required
                                    minLength={6}
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                    <span className="material-symbols-outlined text-red-500 text-[18px]">error</span>
                                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 flex w-full items-center justify-center rounded-lg h-12 px-5 bg-orange-600 text-white text-base font-bold transition-all hover:bg-orange-500 active:scale-[0.98] shadow-lg shadow-orange-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                ) : (
                                    t('auth:resetPassword.submit')
                                )}
                            </button>

                            <Link
                                to="/login"
                                className="text-center text-orange-600 text-sm font-bold hover:text-orange-700 hover:underline"
                            >
                                {t('auth:forgotPassword.backToLogin')}
                            </Link>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
