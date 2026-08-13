import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Users, Plus, ChevronRight } from "lucide-react";

import MemberCard from "../../components/project/MemberCard.jsx";
import BackButton from "../../components/common/BackButton.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

import { useStartup } from "../../hooks/useStartup.js";
import { useMember } from "../../hooks/useMember.js";
import { useToast } from "../../hooks/useToast.js";
import { removeMember } from "../../services/member.service.js";

const SORT_OPTIONS = [
  { value: "nameAsc", label: "Name A → Z" },
  { value: "nameDesc", label: "Name Z → A" },
  { value: "roleAsc", label: "Role A → Z" },
  { value: "roleDesc", label: "Role Z → A" },
];

export default function FounderProjectTeamMembers() {
  const { startupId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { startups, loadStartups } = useStartup();
  const { members, loading, loadMembers } = useMember();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("nameAsc");
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removingMember, setRemovingMember] = useState(false);

  useEffect(() => {
    if (startups.length === 0) {
      loadStartups();
    }
  }, [loadStartups, startups.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!startupId) return;
    loadMembers(startupId, debouncedSearch);
  }, [startupId, debouncedSearch, loadMembers]);

  const startup = useMemo(
    () => startups.find((project) => String(project.id) === String(startupId)),
    [startups, startupId]
  );

  const roles = useMemo(() => {
    const availableRoles = Array.from(new Set(members.map((member) => member.role || "member")));
    return ["all", ...availableRoles];
  }, [members]);

  const filteredMembers = useMemo(() => {
    return [...members]
      .filter((member) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          member.full_name?.toLowerCase().includes(query) ||
          member.username?.toLowerCase().includes(query) ||
          member.role?.toLowerCase().includes(query);

        const matchesRole =
          roleFilter === "all" || member.role === roleFilter;

        return matchesSearch && matchesRole;
      })
      .sort((a, b) => {
        if (sortOrder === "nameDesc") {
          return b.full_name.localeCompare(a.full_name);
        }
        if (sortOrder === "roleAsc") {
          return (a.role || "").localeCompare(b.role || "");
        }
        if (sortOrder === "roleDesc") {
          return (b.role || "").localeCompare(a.role || "");
        }
        return a.full_name.localeCompare(b.full_name);
      });
  }, [members, search, roleFilter, sortOrder]);

  const handleInviteMember = () => {
    showToast({
      type: "info",
      message: "Invite member functionality is coming soon.",
    });
  };

  const handleRemoveMember = (member) => {
    setRemoveTarget(member);
  };

  const handleConfirmRemoveMember = async () => {
    try {
      setRemovingMember(true);
      await removeMember(startupId, removeTarget.id);
      await loadMembers(startupId, debouncedSearch);
      setRemoveTarget(null);
      showToast({ type: "success", message: "Member removed successfully." });
    } catch (error) {
      showToast({
        type: "error",
        message:
          error.response?.data?.message ??
          "Unable to remove member.",
      });
    } finally {
      setRemovingMember(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <BackButton fallbackPath={`/founder/projects/${startupId}`} label="Back to Project Workspace" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan">Team Members</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-paper">
            {startup?.title || "Project Team"}
          </h1>
          <p className="mt-1 text-sm text-paper-dim">
            Manage the team working on this project. Search, filter, and remove members without leaving the team workflow.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleInviteMember}>
            <Plus size={16} />
            Invite Member
          </Button>
          <Button variant="outline" onClick={() => navigate(`/founder/projects/${startupId}`)}>
            <ChevronRight size={16} />
            Project Overview
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="blueprint-card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold text-paper">Members</h2>
                <p className="mt-1 text-sm text-paper-dim">
                  {members.length} member{members.length === 1 ? "" : "s"} in this project.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-paper-faint" size={16} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search members..."
                    className="w-full rounded-lg border border-blueprint-line bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-lg border border-blueprint-line bg-white py-2 px-3 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role === "all" ? "All Roles" : role}
                    </option>
                  ))}
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="rounded-lg border border-blueprint-line bg-white py-2 px-3 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" rounded="rounded-2xl" />
              <Skeleton className="h-20 w-full" rounded="rounded-2xl" />
              <Skeleton className="h-20 w-full" rounded="rounded-2xl" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No members found"
              body="Try a different search term or invite new team members."
            />
          ) : (
            <div className="space-y-3">
              {filteredMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onRemove={handleRemoveMember}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="blueprint-card p-6">
            <h3 className="font-display text-base font-semibold text-paper">Team overview</h3>
            <p className="mt-2 text-sm text-paper-dim">
              This page focuses only on your team. No task details, no chat history, no AI tools.
            </p>
            <div className="mt-4 rounded-2xl border border-blueprint-line bg-blueprint-800/50 p-4 text-sm text-paper-dim">
              Role changes and member invites are ready for future expansion.
            </div>
          </div>

          <div className="blueprint-card p-6">
            <h3 className="font-display text-base font-semibold text-paper">Quick actions</h3>
            <div className="mt-4 flex flex-col gap-3">
              <Button onClick={handleInviteMember}>
                <Plus size={16} />
                Invite a Member
              </Button>
              <Button variant="outline" onClick={() => navigate(`/founder/projects/${startupId}`)}>
                <ChevronRight size={16} />
                Back to Workspace
              </Button>
            </div>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleConfirmRemoveMember}
        confirming={removingMember}
        title="Remove this member?"
        body={`"${removeTarget?.full_name}" will be removed from this project. This can't be undone.`}
      />
    </div>
  );
}