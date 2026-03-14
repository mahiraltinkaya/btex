"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { login } from "@/actions/auth";

export default function LoginPage() {
  const t = useTranslations("AuthPage.login");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success(t("success"));
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("error"));
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-white/50 sm:text-base">
          {t("subtitle")}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-white/70">
            {t("emailLabel")}
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              aria-invalid={!!errors.email}
              className="h-12 border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/25 focus-visible:border-[#e63946] focus-visible:ring-[#e63946]/20"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-[#e63946]">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-white/70"
          >
            {t("passwordLabel")}
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder={t("passwordPlaceholder")}
              aria-invalid={!!errors.password}
              className="h-12 border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/25 focus-visible:border-[#e63946] focus-visible:ring-[#e63946]/20"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-[#e63946]">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loginMutation.isPending}
          whileHover={{
            scale: 1.06,
            boxShadow: "0 0 30px rgba(230, 57, 70, 0.5)",
          }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-[#e63946] text-sm font-semibold text-white shadow-lg shadow-[#e63946]/30 transition-colors duration-200 hover:bg-[#c5303c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            t("submit")
          )}
        </motion.button>
      </form>

      {/* Footer link */}
      <p className="mt-8 text-center text-sm text-white/40">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="font-medium text-[#e63946] transition-colors duration-200 hover:text-[#ff4d5a]"
        >
          {t("register")}
        </Link>
      </p>
    </motion.div>
  );
}
