import { useState, useEffect, useMemo } from "react";

export const useCountdown = (endIso: string | null) => {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!endIso) {
      return;
    }
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [endIso]);

  const text = useMemo(() => {
    if (!endIso) {
      return "";
    }
    const end = new Date(endIso).getTime();
    const diff = Math.max(end - now, 0);

    // 모두 0이면 "0초"로 처리
    if (diff <= 0) {
      return "0초";
    }

    const sec = Math.floor(diff / 1000);
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;

    // 00패딩은 시/분/초만
    const pad = (n: number) => n.toString().padStart(2, "0");

    if (days > 0) {
      return `${days}일 ${pad(hours)}시간 ${pad(minutes)}분 ${pad(seconds)}초`;
    }
    if (hours > 0) {
      return `${hours}시간 ${pad(minutes)}분 ${pad(seconds)}초`;
    }
    if (minutes > 0) {
      return `${minutes}분 ${pad(seconds)}초`;
    }
    return `${seconds}초`;
  }, [endIso, now]);

  return { text };
};
