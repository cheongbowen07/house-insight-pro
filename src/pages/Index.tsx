import { useState } from "react";
import { Building2, MapPin, ClipboardList, DollarSign } from "lucide-react";
import InspectionForm from "@/components/InspectionForm";
import LocationHistory from "@/components/LocationHistory";
import BillingList from "@/components/BillingList";
import TotalSummary from "@/components/TotalSummary";
import NotificationSettings from "@/components/NotificationSettings";
import { notifyNewInspection, notifyHighPriorityIssue } from "@/lib/notifications";
import { useNotificationPreferences } from "@/hooks/use-notification-preferences";

const Index = () => {
  const { preferences } = useNotificationPreferences();
  const [showResults, setShowResults] = useState(false);
  const [inspectionData, setInspectionData] = useState({
    address: "",
    jobType: "",
  });

  const handleSubmit = (data: { address: string; jobType: string }) => {
    setInspectionData(data);
    setShowResults(true);
    
    // Send notification for new inspection
    notifyNewInspection(data.address, preferences.newInspections);
    
    // Notify about high priority issues after a brief delay
    setTimeout(() => {
      const highPriorityItems = billingItems.filter(item => item.severity === 'high');
      highPriorityItems.forEach(item => {
        notifyHighPriorityIssue(item.issue, item.cost, preferences.highPriorityIssues);
      });
    }, 2000);
  };

  // Mock data for demonstration
  const billingItems = [
    {
      id: 1,
      category: "Foundation",
      issue: "Minor crack in foundation wall",
      severity: "moderate" as const,
      cost: 1250,
    },
    {
      id: 2,
      category: "Roofing",
      issue: "Missing shingles and minor water damage",
      severity: "high" as const,
      cost: 3800,
    },
    {
      id: 3,
      category: "Electrical",
      issue: "Outdated circuit breaker panel",
      severity: "high" as const,
      cost: 2100,
    },
    {
      id: 4,
      category: "Plumbing",
      issue: "Slow drainage in main line",
      severity: "low" as const,
      cost: 450,
    },
    {
      id: 5,
      category: "HVAC",
      issue: "Air filter needs replacement",
      severity: "low" as const,
      cost: 75,
    },
  ];

  const totalCost = billingItems.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 sticky top-0 z-10 backdrop-blur-xl">
        <div className="px-3 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-md opacity-40"></div>
              <div className="relative p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                <Building2 className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-3xl font-display font-bold text-foreground tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                RenovateRight
              </h1>
              <p className="text-[10px] sm:text-sm text-muted-foreground font-medium">
                Smart inspection & cost estimates
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-3 py-4 sm:px-6 sm:py-10 max-w-5xl mx-auto">
        {/* Notification Settings */}
        <div className="mb-4 sm:mb-6">
          <NotificationSettings />
        </div>

        {/* Inspection Form */}
        <div className="mb-4 sm:mb-8">
          <InspectionForm onSubmit={handleSubmit} />
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="space-y-4 sm:space-y-6 animate-slide-up">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="group relative bg-gradient-to-br from-card to-secondary rounded-2xl p-4 sm:p-5 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Location
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                    {inspectionData.address}
                  </p>
                </div>
              </div>
              <div className="group relative bg-gradient-to-br from-card to-secondary rounded-2xl p-4 sm:p-5 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-accent/10">
                      <ClipboardList className="h-4 w-4 text-accent flex-shrink-0" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Issues Found
                    </span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-foreground">{billingItems.length}</p>
                </div>
              </div>
              <div className="group relative bg-gradient-to-br from-card to-secondary rounded-2xl p-4 sm:p-5 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-accent/10">
                      <DollarSign className="h-4 w-4 text-accent flex-shrink-0" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Est. Total
                    </span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    ${totalCost.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Location History */}
            <LocationHistory address={inspectionData.address} jobType={inspectionData.jobType} />

            {/* Billing List */}
            <BillingList items={billingItems} />

            {/* Total Summary */}
            <TotalSummary total={totalCost} itemCount={billingItems.length} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
