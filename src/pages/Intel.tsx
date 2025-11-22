import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, AlertTriangle, AlertCircle, Info, Navigation, Home } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


interface LocationData {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    postcode?: string;
  };
}

const Intel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const address = searchParams.get("address") || "";
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Mock billing data
  const billingItems = [
    {
      id: 1,
      category: "Foundation",
      issue: "Minor crack in foundation wall",
      severity: "moderate" as const,
      cost: 1250,
      risk: 6.5,
    },
    {
      id: 2,
      category: "Roofing",
      issue: "Missing shingles and minor water damage",
      severity: "high" as const,
      cost: 3800,
      risk: 8.2,
    },
    {
      id: 3,
      category: "Electrical",
      issue: "Outdated circuit breaker panel",
      severity: "high" as const,
      cost: 2100,
      risk: 7.8,
    },
    {
      id: 4,
      category: "Plumbing",
      issue: "Slow drainage in main line",
      severity: "low" as const,
      cost: 450,
      risk: 3.2,
    },
    {
      id: 5,
      category: "HVAC",
      issue: "Air filter needs replacement",
      severity: "low" as const,
      cost: 75,
      risk: 2.1,
    },
  ];

  const totalCost = billingItems.reduce((sum, item) => sum + item.cost, 0);
  const avgRisk = (billingItems.reduce((sum, item) => sum + item.risk, 0) / billingItems.length).toFixed(1);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
          )}&countrycodes=gb&addressdetails=1&limit=1`,
          {
            headers: {
              "Accept-Language": "en-GB,en",
            },
          }
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setLocationData(data[0]);
        }
      } catch (error) {
        console.error("Location fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchLocation();
    }
  }, [address]);

  // Initialize Leaflet map as background (non-interactive)
  useEffect(() => {
    if (!locationData || !mapRef.current || mapInstanceRef.current) return;

    const lat = parseFloat(locationData.lat);
    const lon = parseFloat(locationData.lon);

    // Create map (non-interactive)
    const map = L.map(mapRef.current, {
      center: [lat, lon],
      zoom: 15,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false,
    });

    mapInstanceRef.current = map;

    // Add tile layer with darker styling
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add marker
    const marker = L.marker([lat, lon]).addTo(map);

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locationData]);

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "high":
        return {
          icon: AlertCircle,
          label: "Critical",
          variant: "destructive" as const,
          color: "text-destructive",
          bg: "bg-destructive/10",
        };
      case "moderate":
        return {
          icon: AlertTriangle,
          label: "Moderate",
          variant: "secondary" as const,
          color: "text-accent",
          bg: "bg-accent/10",
        };
      default:
        return {
          icon: Info,
          label: "Low",
          variant: "outline" as const,
          color: "text-primary",
          bg: "bg-primary/10",
        };
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No address provided</p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fixed Map Background - Non-interactive */}
      {!loading && locationData ? (
        <>
          <div 
            ref={mapRef}
            className="fixed inset-0 z-0"
          />
          {/* Dark overlay */}
          <div className="fixed inset-0 z-[1] bg-background/80 backdrop-blur-sm" />
        </>
      ) : (
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-background via-background to-primary/5" />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              New Search
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-mono-data text-primary uppercase tracking-wider">
                Intel Active
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Card - Overlaying Map */}
      <main className="relative z-10 container max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-card/95 backdrop-blur-xl rounded-2xl border border-border shadow-[var(--shadow-elevated)] overflow-hidden">
          {/* Target Info Header */}
          <div className="p-6 sm:p-8 border-b border-border/50">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">Target Property</h1>
                <p className="text-sm sm:text-base text-muted-foreground font-mono-data">
                  {address}
                </p>
              </div>
            </div>

            {/* Location Details */}
            {locationData?.address && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {locationData.address.road && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Street</p>
                    <p className="text-sm font-medium">{locationData.address.road}</p>
                  </div>
                )}
                {locationData.address.suburb && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Area</p>
                    <p className="text-sm font-medium">{locationData.address.suburb}</p>
                  </div>
                )}
                {locationData.address.city && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">City</p>
                    <p className="text-sm font-medium">{locationData.address.city}</p>
                  </div>
                )}
                {locationData.address.postcode && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Postcode</p>
                    <p className="text-sm font-mono-data">{locationData.address.postcode}</p>
                  </div>
                )}
              </div>
            )}

            {locationData && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Coordinates</p>
                <p className="text-xs font-mono-data text-primary">
                  {parseFloat(locationData.lat).toFixed(6)}, {parseFloat(locationData.lon).toFixed(6)}
                </p>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 sm:p-8 bg-muted/20">
            <div className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Issues Detected</p>
              <p className="text-3xl font-bold font-mono-data">{billingItems.length}</p>
            </div>

            <div className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Estimated Cost</p>
              <p className="text-3xl font-bold font-mono-data">£{totalCost.toLocaleString()}</p>
            </div>

            <div className="p-4 rounded-lg bg-card border border-border hover:border-destructive/50 transition-colors">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Risk Score</p>
              <p className="text-3xl font-bold font-mono-data text-destructive">{avgRisk}/10</p>
            </div>
          </div>

          {/* Issues List */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Identified Issues</h2>
            </div>

            <div className="space-y-3">
              {billingItems.map((item) => {
                const config = getSeverityConfig(item.severity);
                const Icon = config.icon;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all"
                  >
                    <div className="flex gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${config.bg} h-fit`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-primary uppercase tracking-wide">
                            {item.category}
                          </span>
                          <Badge variant={config.variant} className="text-xs">
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground mb-1">{item.issue}</p>
                        <p className="text-xs font-mono-data text-muted-foreground">
                          Risk: {item.risk}/10
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold font-mono-data">£{item.cost.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Intel;
