import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";

export default function ComingSoon({ title, description }) {
  return (
    <div className="max-w-2xl mx-auto mt-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {description}
          </p>

          <div className="text-sm text-muted-foreground">
            This feature is part of the Blaezi roadmap and
            will be available in a future update.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
