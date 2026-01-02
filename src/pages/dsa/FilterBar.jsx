export default function FilterBar({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  topic,
  onTopicChange,
}) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search problems..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full border rounded-md px-3 py-2"
      />

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="all">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="all">All Topics</option>
          <option value="Arrays">Arrays</option>
          <option value="Graphs">Graphs</option>
          <option value="DP">DP</option>
        </select>
      </div>
    </div>
  );
}
