import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNotifications } from "@/hooks/use-notifications";
import { toast } from "sonner";

const NotificationSettings = () => {
  const { permission, isSupported, requestPermission, isEnabled } = useNotifications();

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast.success("Notifications enabled", {
        description: "You'll receive alerts about inspections and updates",
      });
    } else {
      toast.error("Notifications denied", {
        description: "Please enable notifications in your browser settings",
      });
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Card className="p-4 border-border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {isEnabled ? (
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Bell className="h-4 w-4 text-primary" />
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-muted flex-shrink-0">
              <BellOff className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Push Notifications
            </h3>
            <p className="text-xs text-muted-foreground">
              {isEnabled
                ? "Receive alerts about new inspections and updates"
                : "Enable alerts for inspections and updates"}
            </p>
          </div>
        </div>
        {!isEnabled && permission !== 'denied' && (
          <Button
            onClick={handleEnableNotifications}
            size="sm"
            className="flex-shrink-0"
          >
            Enable
          </Button>
        )}
        {permission === 'denied' && (
          <p className="text-xs text-destructive flex-shrink-0">
            Blocked
          </p>
        )}
      </div>
    </Card>
  );
};

export default NotificationSettings;
