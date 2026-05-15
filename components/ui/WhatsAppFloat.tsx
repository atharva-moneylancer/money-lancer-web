"use client";

const WA_NUMBER = "919209039205";
const WA_MESSAGE = "Hi Money Lancer! I'd like to learn more about your investment services.";
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

export function WhatsAppFloat() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full shadow-lift transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(37,211,102,0.35)]"
    >
      {/* Tooltip */}
      <span className="max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-white px-0 py-2.5 text-sm font-semibold text-graphite opacity-0 shadow-soft transition-all duration-300 group-hover:max-w-xs group-hover:px-4 group-hover:opacity-100">
        Chat with us
      </span>

      {/* WhatsApp circle */}
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#25D366]">
        <svg viewBox="0 0 32 32" className="h-7 w-7" fill="white">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.456.665 4.754 1.82 6.73L2 30l7.47-1.793A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2Zm0 2c6.627 0 12 5.373 12 12s-5.373 12-12 12a11.93 11.93 0 0 1-6.13-1.693l-.44-.267-4.574 1.097 1.14-4.44-.293-.46A11.93 11.93 0 0 1 4 16C4 9.373 9.373 4 16 4Zm-3.177 6.5c-.23 0-.6.086-.915.43-.314.344-1.2 1.172-1.2 2.857s1.228 3.314 1.4 3.543c.171.229 2.4 3.828 5.914 5.214 2.914 1.143 3.515.914 4.143.857.629-.057 2.029-.829 2.315-1.629.286-.8.286-1.486.2-1.629-.086-.143-.314-.229-.657-.4s-2.028-1-2.343-1.114c-.314-.115-.543-.172-.771.171-.23.343-.886 1.115-1.086 1.343-.2.229-.4.258-.743.086-.343-.172-1.448-.534-2.757-1.7-1.02-.908-1.708-2.03-1.909-2.372-.2-.343-.02-.529.15-.7.155-.153.343-.4.515-.6.171-.2.229-.343.343-.572.115-.229.057-.429-.028-.6-.086-.172-.758-1.872-1.057-2.558-.257-.6-.523-.6-.729-.6l-.628-.014Z" />
        </svg>
      </span>
    </a>
  );
}
