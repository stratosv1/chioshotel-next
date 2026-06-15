"use client";

import { useState } from "react";

type HomeMapProps = {
  buttonLabel: string;
  iframeSrc: string;
  title?: string;
};

export function HomeMap({
  buttonLabel,
  iframeSrc,
  title = "Voulamandis House location map",
}: HomeMapProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  function loadMap() {
    setIsMapLoaded(true);
  }

  return (
    <>
      <div
        className={`map-preview ${isMapLoaded ? "is-hidden" : ""}`}
        id="mapPreview"
        role="button"
        tabIndex={0}
        aria-controls="mapIframe"
        aria-label="Show interactive map"
        onClick={loadMap}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            loadMap();
          }
        }}
      >
        <button
          className="vh-btn vh-btn--primary"
          id="mapLoadBtn"
          type="button"
          onClick={loadMap}
        >
          {buttonLabel}
        </button>
      </div>

      <iframe
        id="mapIframe"
        className={`map-iframe ${isMapLoaded ? "is-visible" : ""}`}
        title={title}
        src={isMapLoaded ? iframeSrc : undefined}
        loading="lazy"
        allowFullScreen
      />
    </>
  );
}
