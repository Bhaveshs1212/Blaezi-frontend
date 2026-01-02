import PillarCard from "./PillarCard";

const pillars = [
  {
    title: "DSA Forge",
    value: "78%",
    note: "Weak: Graphs",
  },
  {
    title: "Projects",
    value: "42%",
    note: "2 Active",
  },
  {
    title: "Career",
    value: "65%",
    note: "Next: GATE",
  },
];

export default function PillarOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {pillars.map((pillar) => (
        <PillarCard key={pillar.title} {...pillar} />
      ))}
    </div>
  );
}
