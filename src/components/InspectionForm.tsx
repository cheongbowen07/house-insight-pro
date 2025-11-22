import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { toast } from "sonner";

interface InspectionFormProps {
  onSubmit: (data: { address: string; jobType: string }) => void;
}

const InspectionForm = ({ onSubmit }: InspectionFormProps) => {
  const [address, setAddress] = useState("");
  const [jobType, setJobType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      toast.error("Please enter a property address");
      return;
    }
    
    if (!jobType) {
      toast.error("Please select a job type");
      return;
    }

    onSubmit({ address, jobType });
    toast.success("Property inspection initiated");
  };

  return (
    <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-[var(--shadow-card)]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Property Inspection</h2>
        <p className="text-muted-foreground">
          Enter property details to generate a comprehensive assessment
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">
            Property Address
          </Label>
          <Input
            id="address"
            type="text"
            placeholder="123 Main Street, City, State ZIP"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobType" className="text-sm font-medium">
            Job Type
          </Label>
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger id="jobType" className="h-11">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general-contractor">General Contractor</SelectItem>
              <SelectItem value="home-builder">Home Builder</SelectItem>
              <SelectItem value="renovation-specialist">Renovation Specialist</SelectItem>
              <SelectItem value="property-inspector">Property Inspector</SelectItem>
              <SelectItem value="maintenance-contractor">Maintenance Contractor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all duration-300"
        >
          <Search className="mr-2 h-5 w-5" />
          Generate Inspection Report
        </Button>
      </form>
    </div>
  );
};

export default InspectionForm;
