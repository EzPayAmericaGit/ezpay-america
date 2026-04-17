import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Phone, Video, MapPin, CheckCircle2, ChevronLeft, ChevronRight, Loader2, User, Building2, DollarSign, MessageSquare, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import SEOHead from "../components/SEOHead";
import { sanitizeForm, isValidEmail, isValidPhone } from "@/lib/security";

// --- Config ---
const AVAILABLE_TIMES = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
];

const MEETING_TYPES = [
  { id: "phone_call", label: "Phone Call", icon: Phone, desc: "We call you at the scheduled time" },
  { id: "video_call", label: "Video Call", icon: Video, desc: "Google Meet or Zoom link sent via email" },
  { id: "in_person", label: "In-Person", icon: MapPin, desc: "Visit our office or we come to you" },
];

const VOLUME_OPTIONS = [
  "Under $5,000/mo", "$5,000–$15,000/mo", "$15,000–$50,000/mo",
  "$50,000–$100,000/mo", "Over $100,000/mo"
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function isWeekend(year, month, day) {
  const d = new Date(year, month, day).getDay();
  return d === 0 || d === 6;
}
function isPast(year, month, day) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(year, month, day) < today;
}
function formatDateISO(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function formatDateDisplay(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

// ── Sub-components ──────────────────────────────────────────────────────────

function CalendarPicker({ selectedDate, onSelect }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const canGoPrev = viewYear > today.getFullYear() || viewMonth > today.getMonth();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 select-none">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} disabled={!canGoPrev} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <span className="font-bold text-gray-900 text-lg">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const iso = formatDateISO(viewYear, viewMonth, day);
          const disabled = isPast(viewYear, viewMonth, day) || isWeekend(viewYear, viewMonth, day);
          const selected = selectedDate === iso;
          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() => !disabled && onSelect(iso)}
              className={`h-9 w-full rounded-lg text-sm font-medium transition-all
                ${disabled ? "text-gray-300 cursor-not-allowed" : "cursor-pointer hover:bg-amber-50 hover:text-amber-700"}
                ${selected ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md hover:from-amber-600 hover:to-orange-600 hover:text-white" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 text-center mt-3">Weekends unavailable · Mon–Fri only</p>
    </div>
  );
}

function TimeSlotPicker({ selectedTime, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {AVAILABLE_TIMES.map(time => (
        <button
          key={time}
          onClick={() => onSelect(time)}
          className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all
            ${selectedTime === time
              ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white border-amber-500 shadow-md"
              : "bg-white text-gray-700 border-gray-200 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50"
            }`}
        >
          {time}
        </button>
      ))}
    </div>
  );
}

function StepIndicator({ currentStep, steps }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${i < currentStep ? "bg-green-500 text-white" : i === currentStep ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg" : "bg-gray-200 text-gray-400"}`}>
              {i < currentStep ? "✓" : i + 1}
            </div>
            <span className={`text-xs mt-1 whitespace-nowrap ${i === currentStep ? "text-amber-600 font-semibold" : "text-gray-400"}`}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-8 sm:w-12 mx-1 mb-4 transition-all ${i < currentStep ? "bg-green-400" : "bg-gray-200"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Quick Email Form ─────────────────────────────────────────────────────────

function QuickEmailForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !isValidEmail(form.email) || !form.message) {
      setError("Please fill in all required fields with a valid email.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await base44.functions.invoke("sendContactEmail", {
        firstName: form.name,
        lastName: "",
        businessName: "",
        phone: form.phone || "N/A",
        email: form.email,
        service: `Direct Message: ${form.message}`
      });
      setSent(true);
    } catch {
      setError("Failed to send. Please email us directly at mail@ezpayamerica.com");
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900 mb-1">Message Sent!</h3>
        <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Your Name *</label>
          <Input placeholder="John Smith" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address *</label>
          <Input type="email" placeholder="john@business.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Phone (optional)</label>
        <Input type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Message *</label>
        <textarea
          placeholder="Tell us about your business and what you're looking for…"
          value={form.message}
          onChange={e => setForm({...form, message: e.target.value})}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3">
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending…</> : <><Send className="w-4 h-4 mr-2" />Send Message</>}
      </Button>
      <p className="text-xs text-gray-400 text-center">Forwarded to <a href="mailto:mail@ezpayamerica.com" className="text-amber-600 hover:underline">mail@ezpayamerica.com</a></p>
    </form>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

const STEPS = ["Meeting Type", "Pick a Date", "Your Info", "Confirm"];

export default function BookAppointment() {
  const [step, setStep] = useState(0);
  const [meetingType, setMeetingType] = useState("phone_call");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", businessName: "", businessType: "", monthlyVolume: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);

  const canAdvanceStep1 = !!meetingType;
  const canAdvanceStep2 = !!selectedDate && !!selectedTime;
  const canAdvanceStep3 = form.firstName && form.lastName && isValidEmail(form.email) && isValidPhone(form.phone);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    const clean = sanitizeForm(form);
    try {
      const appt = await base44.entities.Appointment.create({
        ...clean,
        meetingType,
        date: selectedDate,
        time: selectedTime,
        timezone,
        status: "scheduled"
      });
      setAppointmentId(appt.id);
      // Send confirmation emails
      await base44.functions.invoke("sendAppointmentConfirmation", { appointmentId: appt.id });
      setConfirmed(true);
    } catch (err) {
      setError("Something went wrong. Please call us at (865) 316-9625.");
    }
    setLoading(false);
  };

  if (confirmed) {
    return (
      <>
        <SEOHead title="Appointment Confirmed | EzPay America" description="Your consultation with EzPay America has been booked." />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4 pt-24 pb-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h1>
            <p className="text-gray-500 mb-6">A confirmation email has been sent to <strong>{form.email}</strong></p>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left space-y-2 mb-6">
              <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-amber-600" /><span className="text-gray-700 font-medium">{formatDateDisplay(selectedDate)}</span></div>
              <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-amber-600" /><span className="text-gray-700 font-medium">{selectedTime} · {timezone}</span></div>
              <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-amber-600" /><span className="text-gray-700 font-medium">{MEETING_TYPES.find(m => m.id === meetingType)?.label}</span></div>
            </div>
            <p className="text-sm text-gray-500 mb-4">Questions? Call us anytime:</p>
            <a href="tel:8653169625" className="block w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 rounded-xl text-lg hover:from-amber-600 hover:to-orange-700 transition-all">
              (865) 316-9625
            </a>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Book a Free Consultation | EzPay America Payment Processing"
        description="Schedule a free consultation with an EzPay America payment specialist. No obligation, no contracts. Get your free quote and free equipment today."
        keywords="book appointment EzPay America, free consultation payment processing, schedule demo merchant services"
        url="https://ezpayamerica.com/BookAppointment"
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 pt-28 pb-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" /> Free · No Obligation · 30 Minutes
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Book Your Free Consultation</h1>
          <p className="text-gray-300 text-lg">Talk to a payment specialist. Learn how to eliminate processing fees and grow your business.</p>
        </div>
      </div>

      {/* Booking UI */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <StepIndicator currentStep={step} steps={STEPS} />

          <AnimatePresence mode="wait">
            {/* Step 0 — Meeting Type */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">How would you like to meet?</h2>
                  <p className="text-gray-500 text-sm mb-6">Choose your preferred meeting format</p>
                  <div className="space-y-3">
                    {MEETING_TYPES.map(({ id, label, icon: Icon, desc }) => (
                      <button key={id} onClick={() => setMeetingType(id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left
                          ${meetingType === id ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50"}`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${meetingType === id ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className={`font-semibold ${meetingType === id ? "text-amber-700" : "text-gray-800"}`}>{label}</p>
                          <p className="text-sm text-gray-500">{desc}</p>
                        </div>
                        {meetingType === id && <CheckCircle2 className="w-5 h-5 text-amber-500 ml-auto flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                  <Button disabled={!canAdvanceStep1} onClick={() => setStep(1)} className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 text-base">
                    Continue →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 1 — Date & Time */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Pick a date & time</h2>
                  <p className="text-gray-500 text-sm mb-6">All times are Eastern Time (ET) · 30-minute consultation</p>
                  <CalendarPicker selectedDate={selectedDate} onSelect={(d) => { setSelectedDate(d); setSelectedTime(null); }} />
                  {selectedDate && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                      <p className="font-semibold text-gray-800 mb-3">Available times for <span className="text-amber-600">{formatDateDisplay(selectedDate)}</span>:</p>
                      <TimeSlotPicker selectedTime={selectedTime} onSelect={setSelectedTime} />
                    </motion.div>
                  )}
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setStep(0)} className="flex-1"><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>
                    <Button disabled={!canAdvanceStep2} onClick={() => setStep(2)} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold">
                      Continue →
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Contact Info */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Tell us about yourself</h2>
                  <p className="text-gray-500 text-sm mb-6">So we can prepare for your consultation</p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">First Name *</label>
                        <Input placeholder="John" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Last Name *</label>
                        <Input placeholder="Smith" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                      <Input type="email" placeholder="john@business.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Phone *</label>
                      <Input type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Business Name</label>
                      <Input placeholder="My Business LLC" value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Business Type</label>
                      <Input placeholder="e.g. Restaurant, Retail, Salon…" value={form.businessType} onChange={e => setForm({...form, businessType: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Monthly Processing Volume</label>
                      <select value={form.monthlyVolume} onChange={e => setForm({...form, monthlyVolume: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400">
                        <option value="">Select range…</option>
                        {VOLUME_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Anything else? (optional)</label>
                      <textarea placeholder="Questions, special requests…" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                        rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1"><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>
                    <Button disabled={!canAdvanceStep3} onClick={() => setStep(3)} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold">
                      Review →
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Confirm */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Confirm your appointment</h2>
                  <p className="text-gray-500 text-sm mb-6">Review your details before booking</p>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3 mb-6">
                    <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-amber-600 flex-shrink-0" /><div><p className="text-xs text-gray-500">Date</p><p className="font-semibold text-gray-900">{formatDateDisplay(selectedDate)}</p></div></div>
                    <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-amber-600 flex-shrink-0" /><div><p className="text-xs text-gray-500">Time</p><p className="font-semibold text-gray-900">{selectedTime} ET</p></div></div>
                    <div className="flex items-center gap-3">{(() => { const MIcon = MEETING_TYPES.find(m => m.id === meetingType)?.icon || Phone; return <MIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />; })()}<div><p className="text-xs text-gray-500">Meeting Type</p><p className="font-semibold text-gray-900">{MEETING_TYPES.find(m => m.id === meetingType)?.label}</p></div></div>
                    <hr className="border-amber-200" />
                    <div className="flex items-center gap-3"><User className="w-5 h-5 text-amber-600 flex-shrink-0" /><div><p className="text-xs text-gray-500">Name</p><p className="font-semibold text-gray-900">{form.firstName} {form.lastName}</p></div></div>
                    <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-amber-600 flex-shrink-0" /><div><p className="text-xs text-gray-500">Email / Phone</p><p className="font-semibold text-gray-900">{form.email} · {form.phone}</p></div></div>
                    {form.businessName && <div className="flex items-center gap-3"><Building2 className="w-5 h-5 text-amber-600 flex-shrink-0" /><div><p className="text-xs text-gray-500">Business</p><p className="font-semibold text-gray-900">{form.businessName}</p></div></div>}
                    {form.monthlyVolume && <div className="flex items-center gap-3"><DollarSign className="w-5 h-5 text-amber-600 flex-shrink-0" /><div><p className="text-xs text-gray-500">Monthly Volume</p><p className="font-semibold text-gray-900">{form.monthlyVolume}</p></div></div>}
                  </div>

                  {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm mb-4">{error}</div>}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1" disabled={loading}><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3">
                      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Booking…</> : "Confirm Booking ✓"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-3">A confirmation email will be sent to {form.email}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-gray-500 text-sm">
            {["Free consultation", "No contracts", "30-minute call", "US-based team"].map(b => (
              <span key={b} className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" />{b}</span>
            ))}
          </div>

          {/* Quick Email Contact Form */}
          <div className="mt-12 bg-white rounded-3xl shadow-xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Prefer to send a message?</h2>
                <p className="text-gray-500 text-sm">We'll reply within 24 hours — usually much sooner.</p>
              </div>
            </div>
            <hr className="border-gray-100 my-5" />
            <QuickEmailForm />
          </div>
        </div>
      </div>
    </>
  );
}