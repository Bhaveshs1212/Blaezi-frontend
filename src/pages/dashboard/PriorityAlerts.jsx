import { Card, CardContent } from "@/components/ui/card";

export default function PriorityAlerts() {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-semibold mb-4">Priority Alerts</h2>
        <ul className="space-y-2 text-sm">
          <li>⚠️ DSA weekly target not met</li>
          <li>⚠️ Project “Blaezi Backend” inactive for 6 days</li>
          <li>⚠️ Placement form closes in 3 days</li>
        </ul>
      </CardContent>
    </Card>
  );
}
