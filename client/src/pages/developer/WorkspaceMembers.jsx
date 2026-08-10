import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Search } from "lucide-react";

import Input from "../../components/ui/Input.jsx";
import MemberCard from "../../components/project/MemberCard.jsx";
import { useDebounce } from "../../hooks/useDebounce.js";

export default function WorkspaceMembers() {
  const { members = [] } = useOutletContext();
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);

  const filtered = members.filter((m) => {
    const term = debounced.trim().toLowerCase();
    if (!term) return true;
    return m.full_name?.toLowerCase().includes(term) || m.email?.toLowerCase().includes(term);
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="relative mb-4">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-faint" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members..." className="[&>input]:pl-9" />
        </div>

        <div className="space-y-3">
          {filtered.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </div>

      <aside>
        <div className="blueprint-card p-6">
          <h3 className="font-semibold text-paper">Manage members</h3>
          <p className="mt-2 text-sm text-paper-dim">Invite or remove members from the project here.</p>
        </div>
      </aside>
    </div>
  );
}
