import { Card, CardContent } from "@/components/ui/card";

export default function TodaysFocus() {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-semibold mb-4">Today’s Focus</h2>
        <ul className="space-y-2 text-sm">
          <li>☐ Solve 2 DP problems</li>
          <li>☐ Push project commit</li>
          <li>☐ Revise Control Systems</li>
        </ul>
      </CardContent>
    </Card>
  );
}
