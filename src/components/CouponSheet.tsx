import { useEffect, useId, useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';

interface CouponSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  storeHref: string;
  storeLabel: string;
  onStoreClick?: () => void;
  children: React.ReactNode;
}

export default function CouponSheet({
  isOpen,
  onClose,
  title,
  storeHref,
  storeLabel,
  onStoreClick,
  children,
}: CouponSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="sheet"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="sheet-inner">
        <header className="sheet-header">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="sheet-close" aria-label="Fechar" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="sheet-body">{children}</div>

        <footer className="sheet-footer">
          <a
            href={storeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="sheet-store-link"
            onClick={onStoreClick}
          >
            {storeLabel}
            <ArrowUpRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </dialog>
  );
}
