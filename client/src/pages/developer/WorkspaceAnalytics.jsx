import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import Button from "../../components/ui/Button.jsx";

export default function WorkspaceAnalytics() {
  const { project } = useOutletContext();
  const [range, setRange] = useState("30d");

  if (!project) return <div />;

  return (
    <div className="space-y-6">
      <div className="blueprint-card p-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-paper">Analytics</h2>
          <p className="mt-2 text-sm text-paper-dim">Project performance and activity over time.</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={range} onChange={(e) => setRange(e.target.value)} className="rounded border px-3 py-2">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button>Export</Button>
        </div>
      </div>

      <div className="blueprint-card p-6">
        <p className="text-sm text-paper-dim">Analytics charts and KPIs would render here.</p>
      </div>
    </div>
  );
}
