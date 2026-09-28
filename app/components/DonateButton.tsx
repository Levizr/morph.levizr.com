"use client";

import Script from "next/script";

const PAYMENT_BUTTON_ID = "pl_ThNYeBxsPnE24J";

export function DonateButton({ className }: { className?: string }) {
  return (
    <form className={`flex min-h-10 justify-center ${className ?? ""}`}>
      <Script
        id="razorpay-payment-button"
        src="https://checkout.razorpay.com/v1/payment-button.js"
        data-payment_button_id={PAYMENT_BUTTON_ID}
        strategy="afterInteractive"
        async
      />
    </form>
  );
}
