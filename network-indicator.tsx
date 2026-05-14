import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useI18n } from "@/lib/i18n";

export function NetworkIndicator() {
  const online = useOnlineStatus();
  const { t } = useI18n();
  if (online) return null;
  return (
    <div className="pointer-events-none fixed right-3 top-3 z-50 safe-top animate-fade-in-up">
      <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
        <WifiOff className="h-3 w-3" />
        {t("network.offline")}
      </div>
    </div>
  );
}
