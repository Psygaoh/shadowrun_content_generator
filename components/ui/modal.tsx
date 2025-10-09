"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
};

export function Modal({ open, onOpenChange, children, className }: ModalProps) {
  const portalRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const onOpenChangeRef = useRef(onOpenChange);

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  if (typeof document !== "undefined" && !portalRef.current) {
    const container = document.createElement("div");
    container.className = "modal-root";
    portalRef.current = container;
  }

  useEffect(() => {
    const portal = portalRef.current;
    if (!open || !portal) {
      return;
    }

    document.body.appendChild(portal);
    previousActiveElement.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChangeRef.current(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    requestAnimationFrame(() => {
      const focusTarget =
        portal.querySelector<HTMLElement>("[data-autofocus='true']") ??
        portal.querySelector<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        );
      focusTarget?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      portal.remove();
      const previous = previousActiveElement.current;
      previous?.focus();
    };
  }, [open]);

  if (!open || !portalRef.current) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChangeRef.current(false);
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "w-full max-w-md rounded-2xl border border-border/70 bg-background p-6 shadow-lg",
          className,
        )}
      >
        {children}
      </div>
    </div>,
    portalRef.current,
  );
}

type ModalHeaderProps = {
  title: string;
  description?: string;
};

export function ModalHeader({ title, description }: ModalHeaderProps) {
  return (
    <header className="mb-4 space-y-2">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </header>
  );
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return <footer className="mt-6 flex items-center justify-end gap-3">{children}</footer>;
}
