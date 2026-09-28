"use client";

import { useEffect, useRef } from "react";

const PAYMENT_BUTTON_ID = "pl_ThNYeBxsPnE24J";
const SCRIPT_SRC = "https://checkout.razorpay.com/v1/payment-button.js";

export function DonateButton({ className }: { className?: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    if (form.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.setAttribute("data-payment_button_id", PAYMENT_BUTTON_ID);
    form.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <form ref={formRef} className={`flex min-h-10 justify-center ${className ?? ""}`} />
  );
}
