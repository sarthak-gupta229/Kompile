import React from "react";

const blinkStyle = (
  <style>{`
    @keyframes blink-on-off {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .dot-blink {
      animation: blink-on-off 1.5s step-start infinite;
    }
  `}</style>
);

function ContestCard({ start, end, host, event, href }) {
  const ensureUTC = (iso) => (iso && !iso.endsWith("Z") ? iso + "Z" : iso);
  const dateObj = new Date(ensureUTC(start));

  const formatTimeIST = (iso) => {
    return new Date(ensureUTC(iso)).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formattedDate = dateObj
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSameDay = (d1, d2) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const endDateObj = new Date(ensureUTC(end));
  const formattedEndDate = endDateObj
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

  const logoUrl = host
    ? `https://www.google.com/s2/favicons?domain=${host}&sz=32`
    : null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-4 gap-3 hover:bg-[#222222] transition-colors cursor-pointer group"
    >
      <div className="flex flex-wrap items-center text-[#a0a0a0] text-sm font-medium gap-3">
        <div className="flex items-center gap-3">
          {isToday(dateObj) ? (
            <>
              {blinkStyle}
              <span
                className="dot-blink w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
              />
            </>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-[#f97316] flex-shrink-0 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
          )}
          {isToday(dateObj) ? (
            <span className="text-[#10b981] font-bold tracking-wide">
              Today
            </span>
          ) : (
            <span>{formattedDate}</span>
          )}
        </div>
        <span>
          {isSameDay(dateObj, endDateObj)
            ? `${formatTimeIST(start)} - ${formatTimeIST(end)}`
            : `${formatTimeIST(start)} - ${formattedEndDate} ${formatTimeIST(end)}`}
        </span>
      </div>

      <div className="flex items-center gap-3 pl-1">
        {logoUrl && (
          <img
            src={logoUrl}
            alt={host}
            className="w-4 h-4 rounded-full flex-shrink-0 opacity-90 group-hover:opacity-100 transition-opacity"
          />
        )}
        <span className="text-[#e0e0e0] font-semibold text-base leading-snug line-clamp-2">
          {event}
        </span>
      </div>
    </a>
  );
}

export default ContestCard;
