"use client";

import { useEffect } from "react";

const OLD_EMAIL = "info@chioshotel.gr";
const NEW_EMAIL = "chioshotel@gmail.com";

function replaceContactEmail(root: ParentNode) {
  root.querySelectorAll<HTMLAnchorElement>(`a[href^="mailto:${OLD_EMAIL}"]`).forEach((link) => {
    link.href = link.href.replace(OLD_EMAIL, NEW_EMAIL);
  });

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  textNodes.forEach((node) => {
    if (node.nodeValue?.includes(OLD_EMAIL)) {
      node.nodeValue = node.nodeValue.replaceAll(OLD_EMAIL, NEW_EMAIL);
    }
  });
}

export function ContactEmailHydrator() {
  useEffect(() => {
    const contactPage = document.querySelector(".contact-page");

    if (!contactPage) {
      return;
    }

    replaceContactEmail(contactPage);

    const observer = new MutationObserver(() => replaceContactEmail(contactPage));
    observer.observe(contactPage, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
