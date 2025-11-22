import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
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
            <SelectContent className="max-h-[400px]">
              <SelectLabel>General / Project-Wide</SelectLabel>
              <SelectItem value="general-contractor">General Contractor</SelectItem>
              <SelectItem value="design-build-contractor">Design & Build Contractor</SelectItem>
              <SelectItem value="project-manager">Project Manager / Construction Manager</SelectItem>
              <SelectItem value="architect">Architect</SelectItem>
              <SelectItem value="structural-engineer">Structural Engineer</SelectItem>
              <SelectItem value="quantity-surveyor">Quantity Surveyor</SelectItem>

              <SelectLabel>Structural & Building</SelectLabel>
              <SelectItem value="masonry-contractor">Masonry Contractor</SelectItem>
              <SelectItem value="concrete-contractor">Concrete Contractor</SelectItem>
              <SelectItem value="foundation-specialist">Foundation / Underpinning Specialist</SelectItem>
              <SelectItem value="structural-steel">Structural Steel Contractor</SelectItem>
              <SelectItem value="roofing-contractor">Roofing Contractor</SelectItem>
              <SelectItem value="chimney-repair">Chimney Repair Contractor</SelectItem>
              <SelectItem value="loft-conversion">Loft Conversion Specialist</SelectItem>
              <SelectItem value="basement-conversion">Basement Conversion Specialist</SelectItem>
              <SelectItem value="extension-builder">Extension Builder</SelectItem>

              <SelectLabel>Plumbing & Water Systems</SelectLabel>
              <SelectItem value="plumber">Plumber</SelectItem>
              <SelectItem value="gas-safe-engineer">Gas-Safe Engineer</SelectItem>
              <SelectItem value="drainage-contractor">Drainage Contractor</SelectItem>
              <SelectItem value="septic-tank">Septic Tank Contractor</SelectItem>
              <SelectItem value="water-damage-restoration">Water Damage Restoration</SelectItem>

              <SelectLabel>Electrical & Energy</SelectLabel>
              <SelectItem value="electrician">Electrician</SelectItem>
              <SelectItem value="lighting-specialist">Lighting Installation Specialist</SelectItem>
              <SelectItem value="solar-panel-installer">Solar Panel Installer</SelectItem>
              <SelectItem value="smart-home-installer">Home Automation / Smart Home Installer</SelectItem>
              <SelectItem value="hvac-installer">HVAC Installer / Heating & Cooling</SelectItem>

              <SelectLabel>Carpentry & Woodwork</SelectLabel>
              <SelectItem value="finish-carpenter">Finish Carpenter</SelectItem>
              <SelectItem value="framing-carpenter">Framing Carpenter</SelectItem>
              <SelectItem value="cabinet-maker">Cabinet Maker</SelectItem>
              <SelectItem value="joiner">Joiner</SelectItem>
              <SelectItem value="decking-contractor">Decking Contractor</SelectItem>
              <SelectItem value="door-window-fitter">Door & Window Fitter</SelectItem>

              <SelectLabel>Interior Finishes</SelectLabel>
              <SelectItem value="drywall-contractor">Drywall Contractor</SelectItem>
              <SelectItem value="plasterer">Plasterer</SelectItem>
              <SelectItem value="painter-decorator">Painter & Decorator</SelectItem>
              <SelectItem value="wallpaper-installer">Wallpaper Installer</SelectItem>
              <SelectItem value="flooring-contractor">Flooring Contractor</SelectItem>
              <SelectItem value="carpet-installer">Carpet Installer</SelectItem>
              <SelectItem value="tiling-contractor">Tiling Contractor</SelectItem>

              <SelectLabel>Exterior Finishes</SelectLabel>
              <SelectItem value="rendering-contractor">Rendering / Stucco Contractor</SelectItem>
              <SelectItem value="exterior-painter">Exterior Painter</SelectItem>
              <SelectItem value="siding-contractor">Siding/Cladding Contractor</SelectItem>
              <SelectItem value="paving-contractor">Paving/Hardscaping Contractor</SelectItem>

              <SelectLabel>Kitchen & Bathroom</SelectLabel>
              <SelectItem value="kitchen-renovation">Kitchen Renovation Contractor</SelectItem>
              <SelectItem value="bathroom-renovation">Bathroom Renovation Contractor</SelectItem>
              <SelectItem value="wet-room-specialist">Wet Room Specialist</SelectItem>
              <SelectItem value="countertop-fabricator">Countertop Fabricator</SelectItem>

              <SelectLabel>Windows, Doors & Glass</SelectLabel>
              <SelectItem value="glazier">Glazier</SelectItem>
              <SelectItem value="window-replacement">Window Replacement Contractor</SelectItem>
              <SelectItem value="upvc-door-installer">UPVC/Aluminium Door Installer</SelectItem>
              <SelectItem value="skylight-installer">Skylight Installer</SelectItem>
              <SelectItem value="shower-glass-installer">Shower Glass Installer</SelectItem>

              <SelectLabel>Outdoor & Landscaping</SelectLabel>
              <SelectItem value="landscaper">Landscaper</SelectItem>
              <SelectItem value="gardener">Gardener</SelectItem>
              <SelectItem value="tree-surgeon">Tree Surgeon / Arborist</SelectItem>
              <SelectItem value="fence-contractor">Fence Contractor</SelectItem>
              <SelectItem value="driveway-contractor">Driveway Contractor</SelectItem>
              <SelectItem value="patio-contractor">Patio / Hardscaping Contractor</SelectItem>
              <SelectItem value="lawn-irrigation">Lawn Irrigation Contractor</SelectItem>

              <SelectLabel>Specialty Contractors</SelectLabel>
              <SelectItem value="fireplace-installer">Fireplace Installer</SelectItem>
              <SelectItem value="insulation-contractor">Insulation Contractor</SelectItem>
              <SelectItem value="soundproofing-contractor">Soundproofing Contractor</SelectItem>
              <SelectItem value="asbestos-removal">Asbestos Removal Contractor</SelectItem>
              <SelectItem value="mould-remediation">Mould Remediation Specialist</SelectItem>
              <SelectItem value="pest-control">Pest Control</SelectItem>
              <SelectItem value="security-installer">Security System Installer</SelectItem>
              <SelectItem value="home-theater-installer">Home Theater / AV Installer</SelectItem>

              <SelectLabel>Restoration & Damage Repair</SelectLabel>
              <SelectItem value="fire-damage-restoration">Fire Damage Restoration</SelectItem>
              <SelectItem value="flood-restoration">Flood Restoration</SelectItem>
              <SelectItem value="smoke-odour-removal">Smoke & Odour Removal</SelectItem>
              <SelectItem value="insurance-claim-contractor">Insurance Claim Contractor</SelectItem>

              <SelectLabel>Maintenance & Cleaning</SelectLabel>
              <SelectItem value="house-cleaner">House Cleaner</SelectItem>
              <SelectItem value="window-cleaner">Window Cleaner</SelectItem>
              <SelectItem value="gutter-cleaning">Gutter Cleaning Contractor</SelectItem>
              <SelectItem value="pressure-washing">Pressure Washing Contractor</SelectItem>
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
