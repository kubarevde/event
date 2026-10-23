"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

export default function Tracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    track("pageview", {
      referrer: document.referrer,
      utm: {
        source: params.get("utm_source"),
        medium: params.get("utm_medium"),
        campaign: params.get("utm_campaign"),
      },
    });
  }, []);
  return null;
}
