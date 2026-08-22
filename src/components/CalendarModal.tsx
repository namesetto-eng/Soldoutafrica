import React from 'react';
import { X, Calendar, ExternalLink, Download } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Google Calendar URL construction
  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    EVENT_DETAILS.title
  )}&dates=20261010T090000Z/20261011T230000Z&details=${encodeURIComponent(
    EVENT_DETAILS.aboutDescription
  )}&location=${encodeURIComponent(EVENT_DETAILS.locationDetails)}`;

  const handleDownloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SoldOutAfrica//KOROM Festival 2026//EN
BEGIN:VEVENT
SUMMARY:${EVENT_DETAILS.title}
DESCRIPTION:${EVENT_DETAILS.aboutDescription}
LOCATION:${EVENT_DETAILS.locationDetails}
DTSTART:20261010T120000Z
DTEND:20261011T020000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'korom-festival-2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#121218] border border-purple-900/50 rounded-3xl p-6 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-purple-400" />
            <h3 className="font-syne text-lg font-bold text-white">Add to Calendar</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-purple-950/50 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-2xl bg-[#0A0A0C] border border-purple-900/40 hover:border-purple-600 transition-all text-xs font-semibold text-slate-200 group"
          >
            <span>Google Calendar</span>
            <ExternalLink className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <button
            onClick={handleDownloadICS}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#0A0A0C] border border-purple-900/40 hover:border-purple-600 transition-all text-xs font-semibold text-slate-200 group text-left"
          >
            <span>Apple / Outlook / iCal (.ics file)</span>
            <Download className="w-4 h-4 text-purple-400 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
