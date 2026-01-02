import { Checkbox } from "@/components/ui/checkbox";

export default function MilestoneList({ milestones, onToggle }) {
  return (
    <div className="space-y-2">
      {milestones.map((milestone) => (
        <div
          key={milestone.id}
          className="flex items-center gap-2"
        >
          <Checkbox
            checked={milestone.completed}
            onCheckedChange={(checked) =>
              onToggle(milestone.id, Boolean(checked))
            }
          />
          <span
            className={
              milestone.completed
                ? "line-through text-muted-foreground"
                : ""
            }
          >
            {milestone.title}
          </span>
        </div>
      ))}
    </div>
  );
}
