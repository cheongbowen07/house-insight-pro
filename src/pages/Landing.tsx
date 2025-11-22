import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Target, Database, Satellite } from "lucide-react";
import AddressPicker from "@/components/AddressPicker";
import ScanningAnimation from "@/components/ScanningAnimation";
import { toast } from "sonner";

const Landing = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const scanSteps = [
    { icon: Target, text: "Parsing target location..." },
    { icon: Satellite, text: "Connecting to satellite network..." },
    { icon: Database, text: "Accessing property database..." },
    { icon: Search, text: "Compiling intelligence report..." },
  ];

  const handleSearch = async () => {
    if (!address.trim()) {
      toast.error("Please enter a property address");
      return;
    }

    setIsScanning(true);
    
    // Simulate scanning animation
    for (let i = 0; i < scanSteps.length; i++) {
      setScanStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Navigate to results
    navigate(`/intel?address=${encodeURIComponent(address)}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Blueprint Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='%23000' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)' /%3E%3C/svg%3E")`,
          filter: 'blur(1px)',
        }}
      />

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo/Branding */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-lg blur-md opacity-50"></div>
              <div className="relative p-3 bg-gradient-to-br from-primary to-accent rounded-lg">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Price Sniper
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Property intelligence at your fingertips. Enter any UK address to access comprehensive inspection data.
          </p>
        </div>

        {!isScanning ? (
          // Search Interface
          <div className="w-full max-w-3xl">
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border shadow-[var(--shadow-elevated)] p-6 sm:p-8 transition-all duration-300 hover:shadow-[var(--shadow-glow)]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-foreground">
                    Target Address
                  </label>
                  <AddressPicker
                    value={address}
                    onChange={setAddress}
                    placeholder="Start typing a UK address..."
                    className="h-14 text-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Start typing to search UK addresses with autocomplete
                  </p>
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={!address.trim()}
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Initiate Intelligence Scan
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {[
                { icon: Target, title: "Precise Location", desc: "GPS coordinates & mapping" },
                { icon: Database, title: "Property Data", desc: "Comprehensive records" },
                { icon: Search, title: "Risk Analysis", desc: "AI-powered insights" },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-4 hover:border-primary/50 transition-all duration-300 hover:bg-card/80"
                >
                  <feature.icon className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Scanning Animation - Fullscreen
          <div className="fixed inset-0 z-50 flex flex-col">
            {/* WebGL Animation - Fullscreen */}
            <div className="flex-1 relative bg-background">
              <ScanningAnimation />
            </div>
            
            {/* Title Overlay */}
            <div className="absolute top-8 left-0 right-0 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Initiating Deep Scan
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
