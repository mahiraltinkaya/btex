"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationContextType {
  confirm: (
    title: string,
    message: string,
    options?: {
      confirmText?: string;
      cancelText?: string;
      variant?: "destructive" | "default";
    },
  ) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(
  undefined,
);

export const ConfirmationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [confirmText, setConfirmText] = useState("Confirm");
  const [cancelText, setCancelText] = useState("Cancel");
  const [variant, setVariant] = useState<"destructive" | "default">("default");
  const [resolvePromise, setResolvePromise] = useState<
    (value: boolean) => void
  >(() => {});

  const confirm = useCallback(
    (
      title: string,
      message: string,
      options?: {
        confirmText?: string;
        cancelText?: string;
        variant?: "destructive" | "default";
      },
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        setIsOpen(true);
        setTitle(title);
        setMessage(message);
        setConfirmText(options?.confirmText || "Confirm");
        setCancelText(options?.cancelText || "Cancel");
        setVariant(options?.variant || "default");
        setResolvePromise(() => resolve);
      });
    },
    [],
  );

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise(false);
  };

  const isDestructive = variant === "destructive";
  const Icon = isDestructive ? AlertTriangle : ShieldAlert;
  const accentColor = isDestructive ? "#e63946" : "#3b82f6";

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border-white/10 bg-[#0a0a0b]/95 backdrop-blur-2xl sm:max-w-[420px]">
          <DialogHeader className="items-center text-center">
            <div className="relative mb-2">
              <div
                className="absolute -inset-3 rounded-full blur-xl"
                style={{ backgroundColor: `${accentColor}10` }}
              />
              <div
                className="relative flex h-14 w-14 items-center justify-center rounded-2xl border bg-white/[0.03]"
                style={{ borderColor: `${accentColor}30` }}
              >
                <Icon
                  className="h-7 w-7"
                  style={{ color: accentColor }}
                />
              </div>
            </div>
            <DialogTitle className="text-lg font-semibold text-white">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-white/50">
              {message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-3 sm:justify-center">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 cursor-pointer border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06] hover:text-white"
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 cursor-pointer text-white"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 20px ${accentColor}40`,
              }}
            >
              {confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error(
      "useConfirmation must be used within a ConfirmationProvider",
    );
  }
  return context;
};
