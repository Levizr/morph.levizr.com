"use client";

import { useEffect } from "react";
import { copyToClipboard } from "@/lib/clipboard";

export function CodeCopyButtons() {
  useEffect(() => {
    const pres = document.querySelectorAll(".docs-content pre");
    pres.forEach((pre) => {
      if (pre.querySelector(".code-copy")) return;
      const code = pre.querySelector("code");
      if (!code) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy code to clipboard");

      const reset = () => {
        btn.textContent = "Copy";
        btn.classList.remove("copied");
      };

      btn.addEventListener("click", async () => {
        await copyToClipboard(code.textContent ?? "");
        btn.textContent = "Copied!";
        btn.classList.add("copied");
        setTimeout(reset, 1600);
      });

      pre.appendChild(btn);
    });
  }, []);

  return null;
}