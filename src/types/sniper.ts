// Data contract for property intelligence

export interface IntelPoint {
  category: "Financial" | "Technical" | "Neighborhood" | "Permits";
  icon: string; // Lucide icon name
  fact: string; // Raw fact from data
  strategy: string; // Tactical advice for contractor
  source_url?: string; // Source reference
}

export interface SniperDossier {
  address: string;
  summary: {
    headline: string;
    risk_score: number; // 0-100
    budget_tier: "Economy" | "Standard" | "Premium" | "Luxury";
    reasoning: string;
  };
  intel: IntelPoint[];
  talk_track: string; // Opening pitch
  raw_sources: { title: string; url: string }[];
}
