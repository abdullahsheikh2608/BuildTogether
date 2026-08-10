import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Search } from "lucide-react";

import Input from "../../components/ui/Input.jsx";
import TaskCard from "../../components/project/TaskCard.jsx";
import TaskDetailsPanel from "../../components/project/TaskDetailsPanel.jsx";
import { useDebounce } from "../../hooks/useDebounce.js";

export default function WorkspaceTasks() {
  const { project, tasks = [] } = useOutletContext();
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const debounced = useDebounce(search, 300);

  const filtered = tasks.filter((t) => {
    const term = debounced.trim().toLowerCase();
    if (!term) return true;
    return t.title?.toLowerCase().includes(term) || t.description?.toLowerCase().includes(term);
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div>
        <div className="relative mb-4">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-faint" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." className="[&>input]:pl-9" />
        </div>

        <div className="space-y-4">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
          ))}
        </div>
      </div>

      <div>
        {selectedTask && <TaskDetailsPanel task={selectedTask} onClose={() => setSelectedTask(null)} />}
      </div>
    </div>
  );
}
