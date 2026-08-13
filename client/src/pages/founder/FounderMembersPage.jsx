import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Users, ChevronRight } from 'lucide-react';

import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import BackButton from '../../components/common/BackButton.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import MemberCard from '../../components/project/MemberCard.jsx';
import { useStartup } from '../../hooks/useStartup.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useToast } from '../../hooks/useToast.js';
import { getStartupMembers, removeMember } from '../../services/member.service.js';

export default function FounderMembersPage() {
  const [searchParams] = useSearchParams();
  const urlStartupId = searchParams.get('startupId') || searchParams.get('projectId');

  const { startups, loadStartups } = useStartup();
  const { showToast } = useToast();
  const [membersByStartup, setMembersByStartup] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Read straight from the URL on first render instead of always
  // defaulting to 'all'. Without this, arriving here from Workspace's
  // "Team Members" button (which links to
  // /founder/team-members?startupId=X) was silently ignored — the query
  // param was never read anywhere, so the page always fell back to
  // showing every project's members.
  const [projectFilter, setProjectFilter] = useState(() => urlStartupId || 'all');
  const [searchInput, setSearchInput] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('nameAsc');
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removingMember, setRemovingMember] = useState(false);

  const search = useDebounce(searchInput, 400);

  useEffect(() => {
    if (startups.length === 0) {
      loadStartups();
    }
  }, [loadStartups, startups.length]);

  // Keep the filter in sync if the URL's startupId changes after mount
  // (e.g. clicking "Team Members" again for a different project while
  // already on this page).
  useEffect(() => {
    if (!urlStartupId) return;
    setProjectFilter(urlStartupId);
  }, [urlStartupId]);

  useEffect(() => {
    const loadMembersForStartup = async (startupId) => {
      setLoading(true);
      setError('');

      try {
        const list = await getStartupMembers(startupId, search);

        setMembersByStartup((prev) => ({
          ...prev,
          [startupId]: Array.isArray(list) ? list : [],
        }));
      } catch {
        setError("Couldn't load team members. Refresh to try again.");
      } finally {
        setLoading(false);
      }
    };

    const loadAll = async () => {
      setLoading(true);
      setError('');

      try {
        await Promise.all(
          startups.map(async (startup) => {
            if (!membersByStartup[startup.id]) {
              const list = await getStartupMembers(startup.id, '');

              setMembersByStartup((prev) => ({
                ...prev,
                [startup.id]: Array.isArray(list) ? list : [],
              }));
            }
          })
        );
      } catch {
        setError("Couldn't load team members.");
      } finally {
        setLoading(false);
      }
    };

    if (projectFilter === 'all') {
      loadAll();
      return;
    }

    if (!membersByStartup[projectFilter] || search) {
      loadMembersForStartup(projectFilter);
    }
  }, [projectFilter, search, startups, membersByStartup]);

  // Every member entry carries its own startup_id (and, in the "All
  // Projects" view, the project's title) so a Remove action always knows
  // exactly which project membership it's deleting — even when the same
  // developer appears under more than one startup.
  const currentMembers = useMemo(() => {
    if (projectFilter === 'all') {
      const merged = Object.entries(membersByStartup).flatMap(([startupId, list]) =>
        list.map((member) => ({
          ...member,
          startup_id: startupId,
          startup_title: startups.find((s) => String(s.id) === String(startupId))?.title,
        }))
      );

      return Array.from(
        new Map(merged.map((m) => [`${m.id}-${m.startup_id}`, m])).values()
      );
    }

    return (membersByStartup[projectFilter] || []).map((member) => ({
      ...member,
      startup_id: projectFilter,
    }));
  }, [membersByStartup, projectFilter, startups]);

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return currentMembers
      .filter((member) => {
        const matchesRole =
          roleFilter === 'all' ||
          member.role === roleFilter;

        const matchesSearch =
          !normalizedSearch ||
          member.full_name
            ?.toLowerCase()
            .includes(normalizedSearch) ||
          member.username
            ?.toLowerCase()
            .includes(normalizedSearch) ||
          member.role
            ?.toLowerCase()
            .includes(normalizedSearch);

        return matchesRole && matchesSearch;
      })
      .sort((a, b) => {
        if (sortOrder === 'nameDesc') {
          return b.full_name.localeCompare(a.full_name);
        }

        if (sortOrder === 'roleAsc') {
          return (a.role || '').localeCompare(
            b.role || ''
          );
        }

        if (sortOrder === 'roleDesc') {
          return (b.role || '').localeCompare(
            a.role || ''
          );
        }

        return a.full_name.localeCompare(b.full_name);
      });
  }, [
    currentMembers,
    roleFilter,
    sortOrder,
    search,
  ]);

  const roles = useMemo(() => {
    const uniqueRoles = Array.from(
      new Set(
        currentMembers.map(
          (member) => member.role || 'Member'
        )
      )
    );

    return ['all', ...uniqueRoles];
  }, [currentMembers]);

  const handleRemoveMember = (member) => {
    setRemoveTarget(member);
  };

  const handleConfirmRemoveMember = async () => {
    if (!removeTarget) return;

    try {
      setRemovingMember(true);
      await removeMember(removeTarget.startup_id, removeTarget.id);

      setMembersByStartup((prev) => ({
        ...prev,
        [removeTarget.startup_id]: (prev[removeTarget.startup_id] || []).filter(
          (m) => m.id !== removeTarget.id
        ),
      }));

      setRemoveTarget(null);
      showToast({ type: 'success', message: 'Member removed successfully.' });
    } catch (err) {
      showToast({
        type: 'error',
        message: err?.response?.data?.message ?? 'Unable to remove member.',
      });
    } finally {
      setRemovingMember(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <BackButton fallbackPath="/founder" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-dim text-cyan">
            <Users size={18} />
          </span>

          <div>
            <p className="text-sm font-medium text-cyan">
              Team Members
            </p>

            <h1 className="mt-1 font-display text-2xl font-semibold text-paper">
              Team Members
            </h1>

            <p className="mt-1 text-sm text-paper-dim">
              Filter and manage your project team in a dedicated members workspace.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            as="a"
            href="/founder/workspace"
          >
            <ChevronRight size={16} />
            Project Overview
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative sm:col-span-2">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-paper-faint"
            size={16}
          />

          <Input
            value={searchInput}
            onChange={(e) =>
              setSearchInput(e.target.value)
            }
            placeholder="Search members..."
            className="pl-10 w-full"
          />
        </div>

        <Select
          value={projectFilter}
          onChange={(e) =>
            setProjectFilter(e.target.value)
          }
        >
          <option value="all">
            All Projects
          </option>

          {startups.map((startup) => (
            <option
              key={startup.id}
              value={startup.id}
            >
              {startup.title}
            </option>
          ))}
        </Select>

        <Select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value)
          }
        >
          {roles.map((role) => (
            <option
              key={role}
              value={role === 'all' ? 'all' : role}
            >
              {role === 'all'
                ? 'All Roles'
                : role}
            </option>
          ))}
        </Select>

        <Select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value)
          }
        >
          <option value="nameAsc">
            Name A → Z
          </option>

          <option value="nameDesc">
            Name Z → A
          </option>

          <option value="roleAsc">
            Role A → Z
          </option>

          <option value="roleDesc">
            Role Z → A
          </option>
        </Select>
      </div>

      {error && (
        <p className="rounded-lg border border-ink-red/20 bg-ink-red/5 px-4 py-3 text-sm text-ink-red">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {loading ? (
          <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">
            Loading team members…
          </p>
        ) : filteredMembers.length === 0 ? (
          <EmptyState
            title="No team members found"
            body="Try a different filter or invite new team members."
          />
        ) : (
          filteredMembers.map((member) => (
            <MemberCard
              key={`${member.id}-${member.startup_id}`}
              member={member}
              onRemove={handleRemoveMember}
              projectLabel={projectFilter === 'all' ? member.startup_title : undefined}
            />
          ))
        )}
      </div>

      <ConfirmDialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleConfirmRemoveMember}
        confirming={removingMember}
        title="Remove this member?"
        body={`"${removeTarget?.full_name}" will be removed from ${removeTarget?.startup_title || 'this project'}. This can't be undone.`}
      />
    </div>
  );
}