"use client";
import { useEffect } from "react";

export function ViewTracker({ postId, path }: { postId: string; path: string }) {
  useEffect(() => {
    fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId, page_path: path }),
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
