import { useState } from "react";
import Modal from "../common/Modal.jsx";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import TextArea from "../ui/TextArea.jsx";
import Select from "../ui/Select.jsx";

const EMPTY_FORM = {
    assigned_to: "",
    title: "",
    description: "",
    priority: "medium",
    status: "todo", // must match backend TASK_STATUS enum (todo | in_progress | completed)
    deadline: "",
};

export default function AssignTaskModal({
    open,
    onClose,
    members,
    onSubmit,
    loading = false,
}) {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validate = () => {
        if (!formData.assigned_to) {
            return "Pick a developer to assign this task to.";
        }
        if (formData.title.trim().length < 3) {
            return "Title must be at least 3 characters.";
        }
        if (formData.description.trim().length < 10) {
            return "Description must be at least 10 characters.";
        }
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        try {
            // Deadline is optional — send null instead of an empty string.
            await onSubmit({
                ...formData,
                deadline: formData.deadline || null,
            });
        } catch (err) {
            setError(
                err.response?.data?.message ?? "Couldn't assign the task. Try again."
            );
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                    <h2 className="font-display text-2xl font-semibold text-paper">
                        Assign New Task
                    </h2>

                    <p className="mt-2 text-paper-dim">
                        Assign a task to one of your accepted developers.
                    </p>
                </div>

                {members.length === 0 ? (
                    <p className="rounded-sm border border-amber/40 bg-amber/10 px-3 py-2 font-mono text-xs text-amber">
                        No accepted developers on this project yet — accept an application first.
                    </p>
                ) : (
                    <Select
                        label="Assign Developer"
                        name="assigned_to"
                        value={formData.assigned_to}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Developer</option>

                        {members.map((member) => (
                            <option
                                key={member.id}
                                value={member.id}
                            >
                                {member.full_name}
                            </option>
                        ))}
                    </Select>
                )}

                <Input
                    label="Task Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    minLength={3}
                />

                <TextArea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                    minLength={10}
                />

                <div className="grid gap-4 md:grid-cols-2">

                    <Select
                        label="Priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </Select>

                    <Input
                        label="Deadline"
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                    />

                </div>

                {error && (
                    <p className="rounded-sm border border-ink-red/40 bg-ink-red/10 px-3 py-2 font-mono text-xs text-ink-red">
                        {error}
                    </p>
                )}

                <div className="flex justify-end gap-3">

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button type="submit" loading={loading} disabled={members.length === 0}>
                        Assign Task
                    </Button>

                </div>

            </form>
        </Modal>
    );
}