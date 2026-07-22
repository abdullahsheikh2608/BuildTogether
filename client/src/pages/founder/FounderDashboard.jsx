import { useEffect, useState } from "react";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import StartupCard from "../../components/startup/StartupCard.jsx";
import StartupFormModal from "../../components/startup/StartupFormModal.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import {
    getAllStartups,
    createStartup,
    updateStartup,
    deleteStartup,
} from "../../services/startup.service.js";

export default function FounderDashboard() {
  const { user } = useAuth();

  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingStartup, setEditingStartup] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadStartups = () => {
    getAllStartups()
      .then((all) => setStartups(all.filter((s) => s.founder_id === user.id)))
      .catch(() => setLoadError("Couldn't load your startups. Refresh to try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStartups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditingStartup(null);
    setFormOpen(true);
  };

  const openEdit = (startup) => {
    setEditingStartup(startup);
    setFormOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    if (editingStartup) {
      const updated = await updateStartup(editingStartup.id, payload);
      setStartups((list) => list.map((s) => (s.id === updated.id ? updated : s)));
    } else {
      const created = await createStartup(payload);
      setStartups((list) => [created, ...list]);
    }
    setFormOpen(false);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteStartup(deleteTarget.id);
      setStartups((list) => list.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setLoadError("Couldn't delete that startup. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
              Founder · Console
            </span>
            <h1 className="mt-2 font-display text-2xl font-semibold text-paper">
              Your startups
            </h1>
          </div>
          <Button onClick={openCreate}>New startup</Button>
        </div>

        {loadError && (
          <p className="mt-6 rounded-sm border border-ink-red/40 bg-ink-red/10 px-3 py-2 font-mono text-xs text-ink-red">
            {loadError}
          </p>
        )}

        <div className="mt-8">
          {loading ? (
            <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">
              Loading…
            </p>
          ) : startups.length === 0 ? (
            <EmptyState
              title="No startups posted yet"
              body="Draft your first blueprint — add the tech stack and roles you need, and developers can start applying."
              action={<Button onClick={openCreate}>Post your first startup</Button>}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {startups.map((startup) => (
        <StartupCard
          key={startup.id}
          startup={startup}
          role="founder"
          onEdit={openEdit}
          onDelete={setDeleteTarget}
      />
          ))}
            </div>
          )}
        </div>
      
      <StartupFormModal
        key={formOpen ? editingStartup?.id ?? "new" : "closed"}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        startup={editingStartup}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        confirming={deleting}
        title="Delete this startup?"
        body={`"${deleteTarget?.title}" and all its applications will be permanently removed. This can't be undone.`}
      />
    </div>
  );
}