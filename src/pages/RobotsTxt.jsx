import { useEffect } from "react";

/**
 * This page exists only as a fallback UI.
 * The real robots.txt is served by the `robotsTxt` backend function
 * which must be mapped to /robots.txt at the hosting/CDN level.
 * 
 * Crawler bots will NOT use this React page — they need the backend function.
 */
export default function RobotsTxt() {
  useEffect(() => {
    // Redirect to the backend function endpoint so humans who navigate here see the real content
    window.location.href = "/api/robotsTxt";
  }, []);

  return null;
}