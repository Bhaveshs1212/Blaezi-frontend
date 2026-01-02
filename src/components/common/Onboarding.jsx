import { Card, CardContent } from "../ui/card";

export default function OnboardingHint({ title, message }) {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="py-4">
        <p className="font-medium text-sm">
          {title}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {message}
        </p>
      </CardContent>
    </Card>
  );
}
