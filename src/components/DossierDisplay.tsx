import { SniperDossier, IntelPoint } from "@/types/sniper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, AlertTriangle, DollarSign, MapPin, FileCheck, Clock } from "lucide-react";

const IconMap: Record<string, React.ReactNode> = {
  DollarSign: <DollarSign className="text-green-500" />,
  AlertTriangle: <AlertTriangle className="text-orange-500" />,
  MapPin: <MapPin className="text-blue-500" />,
  FileCheck: <FileCheck className="text-purple-500" />,
  Clock: <Clock className="text-amber-500" />,
};

function IntelCard({ point }: { point: IntelPoint }) {
  const icon = IconMap[point.icon] || <AlertTriangle className="text-slate-500" />;
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <span className="font-bold text-foreground">{point.category}</span>
        </div>
        <div className="text-sm text-muted-foreground mb-2">{point.fact}</div>
        <div className="bg-muted p-3 rounded text-sm font-medium text-foreground border-l-4 border-primary">
          → {point.strategy}
        </div>
        {point.source_url && (
          <a 
            href={point.source_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1 mt-2"
          >
            Source <ExternalLink size={10} />
          </a>
        )}
      </CardContent>
    </Card>
  );
}

export default function DossierDisplay({ data }: { data: SniperDossier }) {
  const getRiskColor = (score: number) => {
    if (score > 70) return "text-destructive";
    if (score > 40) return "text-orange-500";
    return "text-green-500";
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Summary */}
      <div className="flex justify-between items-start gap-6 flex-wrap">
        <div className="flex-1 min-w-[250px]">
          <h2 className="text-3xl font-bold text-foreground mb-2">{data.summary.headline}</h2>
          <p className="text-muted-foreground">{data.summary.reasoning}</p>
          <Badge variant="secondary" className="mt-2">{data.summary.budget_tier}</Badge>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Risk Score</div>
          <div className={`text-5xl font-mono font-bold ${getRiskColor(data.summary.risk_score)}`}>
            {data.summary.risk_score}
          </div>
        </div>
      </div>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.intel.map((point, idx) => (
          <IntelCard key={idx} point={point} />
        ))}
      </div>

      {/* Talk Track */}
      <div className="bg-primary/10 border-2 border-primary/30 p-4 rounded-lg">
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Talk Track</span>
        <p className="text-foreground italic text-lg mt-2">"{data.talk_track}"</p>
      </div>

      {/* Sources */}
      {data.raw_sources && data.raw_sources.length > 0 && (
        <div className="text-xs text-muted-foreground flex flex-wrap gap-3 mt-4 pt-4 border-t">
          <span className="font-semibold">Sources Verified:</span>
          {data.raw_sources.map((src, i) => (
            <a 
              key={i} 
              href={src.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1 text-primary"
            >
              {src.title.substring(0, 30)}... <ExternalLink size={10} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
