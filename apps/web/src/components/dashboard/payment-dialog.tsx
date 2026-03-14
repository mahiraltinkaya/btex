"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  CreditCard,
  Loader2,
  ShieldCheck,
  Lock,
  Fingerprint,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (cardNumber: string, expiry: string, cvv: string) => Promise<void>;
  isPending: boolean;
}

export function PaymentDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: PaymentDialogProps) {
  const t = useTranslations("Dashboard.paymentDialog");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  const formatCardNumber = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  }, []);

  const formatExpiry = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(cardNumber, expiry, cvv);
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setIsFlipped(false);
  };

  const maskedNumber = cardNumber || "•••• •••• •••• ••••";
  const maskedExpiry = expiry || "MM/YY";
  const maskedCvv = cvv ? "•".repeat(cvv.length) : "•••";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#0a0a0b]/95 backdrop-blur-2xl sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-white">
            <CreditCard className="h-5 w-5 text-[#e63946]" />
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        {/* Flip Card */}
        <div
          className="mx-auto mt-2 mb-4 w-full max-w-[340px]"
          style={{ perspective: "1000px" }}
        >
          <div
            className="relative h-[200px] w-full transition-transform duration-700"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-white/10 p-6"
              style={{
                backfaceVisibility: "hidden",
                background:
                  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <div className="h-6 w-9 rounded bg-amber-400/80" />
                  <div className="h-6 w-6 rounded bg-white/10" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  {t("creditCard")}
                </span>
              </div>
              <p className="font-mono text-lg tracking-[0.2em] text-white/90">
                {maskedNumber}
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/30">
                    {t("expires")}
                  </p>
                  <p className="font-mono text-sm text-white/70">
                    {maskedExpiry}
                  </p>
                </div>
                <div className="flex gap-1">
                  <div className="h-6 w-6 rounded-full bg-red-500/60" />
                  <div className="-ml-3 h-6 w-6 rounded-full bg-amber-500/60" />
                </div>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-white/10"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background:
                  "linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)",
              }}
            >
              <div className="mt-6 h-10 w-full bg-white/10" />
              <div className="flex items-center justify-end gap-3 px-6 pb-6">
                <div className="flex h-8 w-20 items-center justify-center rounded bg-white/90">
                  <p className="font-mono text-sm font-bold text-black">
                    {maskedCvv}
                  </p>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  CVV
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/40">
              {t("cardNumber")}
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              onFocus={() => setIsFlipped(false)}
              className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 font-mono text-sm text-white placeholder:text-white/20 focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/30 focus:outline-none"
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Expiry */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/40">
                {t("expiryDate")}
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                onFocus={() => setIsFlipped(false)}
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 font-mono text-sm text-white placeholder:text-white/20 focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/30 focus:outline-none"
                maxLength={5}
                required
              />
            </div>

            {/* CVV */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/40">
                CVV
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="•••"
                value={cvv}
                onChange={(e) =>
                  setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                onFocus={() => setIsFlipped(true)}
                onBlur={() => setIsFlipped(false)}
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 font-mono text-sm text-white placeholder:text-white/20 focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/30 focus:outline-none"
                maxLength={4}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="h-11 w-full cursor-pointer rounded-xl bg-[#e63946] text-sm font-semibold text-white shadow-lg shadow-[#e63946]/30 transition-colors hover:bg-[#c5303c]"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("payNow")
            )}
          </Button>
        </form>

        {/* Security Trust Footer */}
        <div className="mt-2 border-t border-white/5 pt-4">
          <div className="flex items-center justify-center gap-5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/70" />
              <span className="text-[10px] font-medium tracking-wide text-white/30">
                SSL Secure
              </span>
            </div>
            <div className="h-3 w-px bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-white/30" />
              <span className="text-[10px] font-medium tracking-wide text-white/30">
                256-bit
              </span>
            </div>
            <div className="h-3 w-px bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Fingerprint className="h-3.5 w-3.5 text-white/30" />
              <span className="text-[10px] font-medium tracking-wide text-white/30">
                PCI DSS
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
