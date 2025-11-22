import { DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TotalSummaryProps {
  total: number;
  itemCount: number;
}

const TotalSummary = ({ total, itemCount }: TotalSummaryProps) => {
  return (
    <div className="bg-gradient-to-br from-primary via-primary to-primary/90 rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-elevated)] text-primary-foreground">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-primary-foreground/20">
              <DollarSign className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Estimated Total Cost</h3>
          </div>
          <p className="text-4xl sm:text-5xl font-bold mb-2">
            ${total.toLocaleString()}
          </p>
          <p className="text-primary-foreground/80 text-sm">
            Based on {itemCount} identified {itemCount === 1 ? "issue" : "issues"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
          >
            <FileText className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-primary-foreground/20">
        <p className="text-xs text-primary-foreground/70">
          * Estimates are based on standard industry rates and may vary based on location, material
          costs, and contractor availability. Final pricing should be confirmed with licensed
          contractors.
        </p>
      </div>
    </div>
  );
};

export default TotalSummary;
