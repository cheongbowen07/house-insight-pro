import { Building, Calendar, FileText, TrendingUp } from "lucide-react";

interface LocationHistoryProps {
  address: string;
  jobType: string;
}

const LocationHistory = ({ address, jobType }: LocationHistoryProps) => {
  const historyData = [
    {
      icon: Building,
      label: "Property Type",
      value: "Single Family Residential",
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Calendar,
      label: "Year Built",
      value: "1998",
      iconColor: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: TrendingUp,
      label: "Last Inspection",
      value: "March 2023",
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: FileText,
      label: "Previous Reports",
      value: "2 on file",
      iconColor: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-[var(--shadow-card)]">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-1">Location History</h3>
        <p className="text-sm text-muted-foreground">{address}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {historyData.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border/50 hover:shadow-md transition-all duration-300"
          >
            <div className={`p-2.5 rounded-lg ${item.bgColor} flex-shrink-0`}>
              <item.icon className={`h-5 w-5 ${item.iconColor}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-foreground">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/50">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Inspector Role:</span>{" "}
          {jobType.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
        </p>
      </div>
    </div>
  );
};

export default LocationHistory;
