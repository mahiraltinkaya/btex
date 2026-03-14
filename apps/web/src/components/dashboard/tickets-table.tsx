"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  XCircle,
  CreditCard,
  TicketX,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cancelBooking, payment } from "@/actions/booking";
import { useConfirmation } from "@/context/confirmation-provider";
import { PaymentDialog } from "@/components/dashboard/payment-dialog";
import type { TicketWithEvent } from "@/types";
import { TicketStatus } from "@/types";
import { useAuth } from "@/context/auth-provider";

interface TicketsTableProps {
  tickets: TicketWithEvent[];
}

const STATUS_BADGES: Record<TicketStatus, { bg: string; text: string }> = {
  [TicketStatus.OPEN]: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  [TicketStatus.RESERVED]: { bg: "bg-amber-500/15", text: "text-amber-400" },
  [TicketStatus.SOLD]: { bg: "bg-sky-500/15", text: "text-sky-400" },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard write failed — silent fallback */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="cursor-pointer rounded-md p-1 text-white/30 transition-colors hover:bg-white/10 hover:text-white/70"
      title="Copy"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export function TicketsTable({ tickets }: TicketsTableProps) {
  const t = useTranslations("Dashboard.ticketsTable");
  const tConfirm = useTranslations("Dashboard.confirmations");
  const queryClient = useQueryClient();
  const { confirm } = useConfirmation();
  const { user } = useAuth();
  const role = user?.role;

  const [payingTransactionId, setPayingTransactionId] = useState<string | null>(
    null,
  );

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["tickets"] });
    queryClient.invalidateQueries({ queryKey: ["events"] });
    queryClient.invalidateQueries({ queryKey: ["eventMonitors"] });
  };

  const cancelMutation = useMutation({
    mutationFn: (ticketId: string) => cancelBooking(ticketId),
    onSuccess: (data) => {
      toast.success(data.message);
      invalidateAll();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const payMutation = useMutation({
    mutationFn: (params: {
      transactionId: string;
      cardNumber: string;
      expiry: string;
      cvv: string;
    }) =>
      payment(
        params.transactionId,
        params.cardNumber,
        params.expiry,
        params.cvv,
      ),
    onSuccess: (data) => {
      toast.success(data.message);
      setPayingTransactionId(null);
      invalidateAll();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleCancel = async (ticketId: string) => {
    const confirmed = await confirm(
      tConfirm("cancelTitle"),
      tConfirm("cancelMessage"),
      {
        confirmText: tConfirm("cancelConfirm"),
        cancelText: tConfirm("cancelBtn"),
        variant: "destructive",
      },
    );
    if (confirmed) {
      cancelMutation.mutate(ticketId);
    }
  };

  const handlePay = async (cardNumber: string, expiry: string, cvv: string) => {
    if (!payingTransactionId) return;
    payMutation.mutate({
      transactionId: payingTransactionId,
      cardNumber,
      expiry,
      cvv,
    });
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/40 sm:px-6">
                  {t("code")}
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/40 sm:px-6 md:table-cell">
                  {t("seat")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/40 sm:px-6">
                  {t("event")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/40 sm:px-6">
                  {t("status")}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/40 sm:px-6">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tickets.map((ticket) => {
                const badge = STATUS_BADGES[ticket.status];
                const isReserved = ticket.status === TicketStatus.RESERVED;
                const isPendingCancel =
                  cancelMutation.isPending &&
                  cancelMutation.variables === ticket.id;

                return (
                  <tr
                    key={ticket.id}
                    className="transition-colors duration-150 hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="font-mono text-sm text-white/80"
                          title={ticket.ticketCode}
                        >
                          {ticket.ticketCode.length > 10
                            ? `${ticket.ticketCode.slice(0, 10)}…`
                            : ticket.ticketCode}
                        </span>
                        <CopyButton text={ticket.ticketCode} />
                      </div>
                    </td>

                    <td className="hidden px-4 py-4 text-sm text-white/60 sm:px-6 md:table-cell">
                      #{ticket.seatNumber}
                    </td>

                    <td className="px-4 py-4 sm:px-6">
                      <p className="text-sm text-white/70">
                        {ticket.event.name}
                      </p>
                    </td>

                    <td className="px-4 py-4 sm:px-6">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge.bg} ${badge.text}`}
                      >
                        {ticket.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-end gap-1">
                        {role === "CUSTOMER" && isReserved && (
                          <>
                            <button
                              type="button"
                              disabled={!ticket.transaction}
                              onClick={() => {
                                if (ticket.transaction) {
                                  setPayingTransactionId(ticket.transaction.id);
                                }
                              }}
                              className="cursor-pointer rounded-lg p-2 text-white/40 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-30"
                              title={t("pay")}
                            >
                              <CreditCard className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              disabled={isPendingCancel}
                              onClick={() => handleCancel(ticket.id)}
                              className="cursor-pointer rounded-lg p-2 text-white/40 transition-colors hover:bg-red-500/10 hover:text-[#e63946] disabled:cursor-not-allowed disabled:opacity-30"
                              title={t("cancel")}
                            >
                              {isPendingCancel ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                            </button>
                          </>
                        )}
                        {(role === "ADMIN" || !isReserved) && (
                          <span className="px-2 text-xs text-white/20">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {tickets.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-[#e63946]/5 blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <TicketX className="h-8 w-8 text-white/20" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-white/50">{t("empty")}</p>
              <p className="text-xs text-white/25">{t("emptyHint")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Payment Dialog */}
      <PaymentDialog
        open={!!payingTransactionId}
        onOpenChange={(open) => {
          if (!open) setPayingTransactionId(null);
        }}
        onSubmit={handlePay}
        isPending={payMutation.isPending}
      />
    </>
  );
}
