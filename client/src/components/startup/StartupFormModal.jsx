import { useEffect, useState } from 'react';
import Modal from '../common/Modal.jsx';
import Input from '../ui/Input.jsx';
import TextArea from '../ui/TextArea.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';
import { FORM_MESSAGES } from '../../constants/messages.js';
import { useStartup } from '../../hooks/useStartup.js';

const EMPTY_FORM = {
  title: '',
  tagline: '',
  description: '',
  tech_stack: '',
  required_roles: '',
  status: 'open',
};

const toFormState = (startup) =>
  startup
    ? {
        title: startup.title ?? '',
        tagline: startup.tagline ?? '',
        description: startup.description ?? '',
        tech_stack: (startup.tech_stack ?? []).join(', '),
        required_roles: (startup.required_roles ?? []).join(', '),
        status: startup.status ?? 'open',
      }
    : EMPTY_FORM;

const toPayload = (form) => ({
  title: form.title.trim(),
  tagline: form.tagline.trim(),
  description: form.description.trim(),
  tech_stack: form.tech_stack
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  required_roles: form.required_roles
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  status: form.status,
});

export default function StartupFormModal({ open, onClose, onSubmit }) {
  const { selectedStartup } = useStartup();
  const [form, setForm] = useState(() => toFormState(selectedStartup));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(toFormState(selectedStartup));
    setError('');
  }, [selectedStartup, open]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = toPayload(form);

    if (payload.tech_stack.length === 0) {
      setError(FORM_MESSAGES.TECHNOLOGY_REQUIRED);
      return;
    }
    if (payload.required_roles.length === 0) {
      setError(FORM_MESSAGES.REQUIRED_ROLE_REQUIRED);
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.message ?? FORM_MESSAGES.SUBMIT_FAILURE);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={selectedStartup ? 'Revise blueprint' : 'New blueprint'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="title"
          name="title"
          label="Title"
          placeholder="PakPulse AI"
          value={form.title}
          onChange={handleChange}
          required
        />
        <Input
          id="tagline"
          name="tagline"
          label="Tagline"
          placeholder="Disease early-warning, built on real data"
          value={form.tagline}
          onChange={handleChange}
          required
        />
        <TextArea
          id="description"
          name="description"
          label="Description"
          placeholder="What are you building, and why does it matter?"
          value={form.description}
          onChange={handleChange}
          required
        />
        <Input
          id="tech_stack"
          name="tech_stack"
          label="Tech stack"
          placeholder="React, Node.js, PostgreSQL"
          hint="Comma-separated"
          value={form.tech_stack}
          onChange={handleChange}
          required
        />
        <Input
          id="required_roles"
          name="required_roles"
          label="Roles needed"
          placeholder="Frontend Developer, ML Engineer"
          hint="Comma-separated"
          value={form.required_roles}
          onChange={handleChange}
          required
        />
        <Select
          id="status"
          name="status"
          label="Status"
          value={form.status}
          onChange={handleChange}
          options={[
            { value: 'open', label: 'Open — accepting applicants' },
            { value: 'closed', label: 'Closed — not accepting applicants' },
          ]}
        />

        {error && (
          <p className="rounded-sm border border-ink-red/40 bg-ink-red/10 px-3 py-2 font-mono text-xs text-ink-red">
            {error}
          </p>
        )}

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {selectedStartup ? 'Save changes' : 'Post startup'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
