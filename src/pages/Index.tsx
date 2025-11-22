import { useState } from "react";
import { Building2, MapPin, ClipboardList, DollarSign } from "lucide-react";
import InspectionForm from "@/components/InspectionForm";
import LocationHistory from "@/components/LocationHistory";
import BillingList from "@/components/BillingList";
import TotalSummary from "@/components/TotalSummary";

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [inspectionData, setInspectionData] = useState({
    address: "",
    jobType: "",
  });

  const handleSubmit = (data: { address: string; jobType: string }) => {
    setInspectionData(data);
    setShowResults(true);
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
      <header className="border-b border-border bg-card sticky top-0 z-10 backdrop-blur-sm bg-card/80">
        <div className="px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-base sm:text-2xl font-bold text-foreground tracking-tight">
                Property Inspector Pro
              </h1>
              <p className="text-[10px] sm:text-sm text-muted-foreground">
                Comprehensive property assessment
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-3 py-4 sm:px-6 sm:py-10 max-w-5xl mx-auto">
        {/* Inspection Form */}
        <div className="mb-4 sm:mb-8">
          <InspectionForm onSubmit={handleSubmit} />
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-card rounded-xl p-3 sm:p-4 border border-border shadow-sm">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Location
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                  {inspectionData.address}
                </p>
              </div>
              <div className="bg-card rounded-xl p-3 sm:p-4 border border-border shadow-sm">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <ClipboardList className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Issues Found
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{billingItems.length}</p>
              </div>
              <div className="bg-card rounded-xl p-3 sm:p-4 border border-border shadow-sm">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Est. Total
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  ${totalCost.toLocaleString()}
                </p>
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
