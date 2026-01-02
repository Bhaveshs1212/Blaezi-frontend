import { Card, CardContent } from "@/components/ui/card";

export default function PillarCard({ title, value, note }) {
  return (
    <Card>
      <CardContent className="p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm">{note}</p>
      </CardContent>
    </Card>
  );
}
