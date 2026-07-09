"use client";

type CarouselNextButtonProps = {
  className: string;
  label?: string;
};

export function CarouselNextButton({
  className,
  label = "Next items",
}: CarouselNextButtonProps) {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const wrapper = event.currentTarget.parentElement;
    const track = wrapper?.querySelector<HTMLElement>("[data-carousel-track='true']");

    if (!track) {
      return;
    }

    const scrollAmount = Math.max(track.clientWidth * 0.82, 260);
    track.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      aria-label={label}
      className={className}
      onClick={handleClick}
    >
      →
    </button>
  );
}
