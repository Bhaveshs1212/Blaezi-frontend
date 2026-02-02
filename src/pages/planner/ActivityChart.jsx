import { usePlanner } from "../../context/PlannerContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ActivityChart() {
  const { activityData } = usePlanner();

  console.log('[ActivityChart] Rendering with activityData:', activityData);
  console.log('[ActivityChart] Total tasks in chart:', activityData.reduce((sum, day) => sum + day.tasks, 0));

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 
          className="text-sm font-medium text-gray-500 uppercase tracking-wide"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Last 7 Days Activity
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Total completed: {activityData.reduce((sum, day) => sum + day.tasks, 0)} tasks
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={activityData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '8px 12px',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          />
          <Area 
            type="monotone" 
            dataKey="tasks" 
            stroke="#6366F1" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorTasks)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
