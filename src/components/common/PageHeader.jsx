export default function PageHeader({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}
