import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselArrowsProps {
  atStart: boolean;
  atEnd: boolean;
  onScroll: (direction: 1 | -1) => void;
  previousLabel: string;
  nextLabel: string;
}

export default function CarouselArrows({
  atStart,
  atEnd,
  onScroll,
  previousLabel,
  nextLabel,
}: CarouselArrowsProps) {
  if (atStart && atEnd) return null;

  return (
    <div className="carousel-arrows">
      <button type="button" disabled={atStart} onClick={() => onScroll(-1)} aria-label={previousLabel}>
        <ChevronLeft size={18} strokeWidth={2.2} aria-hidden="true" />
      </button>
      <button type="button" disabled={atEnd} onClick={() => onScroll(1)} aria-label={nextLabel}>
        <ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </div>
  );
}
