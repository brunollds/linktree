import { useEffect, useState } from 'react';

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

// A boolean that switches itself off a moment after being set.
export function useCopiedFlag(duration = 2200) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), duration);
    return () => window.clearTimeout(timeout);
  }, [copied, duration]);

  return [copied, setCopied] as const;
}
