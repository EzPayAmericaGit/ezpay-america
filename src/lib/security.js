/**
 * Client-side security utilities for EzPay America landing pages.
 * Prevents XSS injection, spam submission, and malicious input.
 */

// Strip all HTML tags and dangerous characters from a string
export function sanitizeText(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, "")           // strip HTML tags
    .replace(/[<>"'`]/g, "")           // strip dangerous chars
    .replace(/javascript:/gi, "")      // strip js: protocol
    .replace(/on\w+\s*=/gi, "")        // strip event handlers
    .replace(/data:/gi, "")            // strip data: URIs
    .trim()
    .slice(0, 500);                    // hard max length
}

// Validate email format
export function isValidEmail(email) {
  const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase()) && email.length <= 254;
}

// Validate phone — digits, spaces, dashes, parens, plus only
export function isValidPhone(phone) {
  const re = /^[\d\s\-().+]{7,20}$/;
  return re.test(phone);
}

// Simple in-memory rate limiter keyed by form id
const rateLimitStore = {};
export function checkRateLimit(key, maxAttempts = 3, windowMs = 60000) {
  const now = Date.now();
  if (!rateLimitStore[key]) rateLimitStore[key] = [];
  // Remove attempts outside the window
  rateLimitStore[key] = rateLimitStore[key].filter(t => now - t < windowMs);
  if (rateLimitStore[key].length >= maxAttempts) {
    return false; // blocked
  }
  rateLimitStore[key].push(now);
  return true; // allowed
}

// Sanitize an entire form object
export function sanitizeForm(form) {
  const out = {};
  for (const key of Object.keys(form)) {
    out[key] = sanitizeText(form[key]);
  }
  return out;
}