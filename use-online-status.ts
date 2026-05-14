import { useEffect, useState } from "react";

/**
 * Tracks online/offline status and reflects it on <html data-network="…">
 * so CSS can shift the background tone (no loud red/green pill).
 */
export function useOnlineStatus() {
  const [online, setOnline] = useState<boolean>(true);

  useEffect(() => {
    const update = () => {
      const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
      setOnline(isOnline);
      document.documentElement.dataset.network = isOnline ? "online" : "offline";
    };
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return online;
}
