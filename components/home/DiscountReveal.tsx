"use client";

import { useState } from "react";

type DiscountRevealProps = {
  submitLabel: string;
  successText: string;
  code: string;
};

export function DiscountReveal({ submitLabel, successText, code }: DiscountRevealProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div id="discountCodeForm">
      <button
        type="button"
        className="vh-btn vh-btn--primary"
        id="dc_submitBtn"
        onClick={() => setIsVisible(true)}
      >
        <span aria-hidden="true">🎁</span> {submitLabel}
      </button>

      {isVisible ? (
        <div id="discountSuccess" className="discount-success" aria-live="polite">
          <div id="discountSuccessText">{successText}</div>
          <div id="discountCodeValue" className="discount-code-value">
            {code}
          </div>
        </div>
      ) : null}

      <div id="discountFeedback" className="discount-error" aria-live="polite" />
    </div>
  );
}
