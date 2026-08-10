import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input.jsx';
import TextArea from '../ui/TextArea.jsx';
import Button from '../ui/Button.jsx';
import ResumeUpload from './ResumeUpload.jsx';
import { Send, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ApplicationForm({
  startup,
  initialData = null,
  onSubmit,
  isEditing = false,
}) {
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [relevantExperience, setRelevantExperience] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [availability, setAvailability] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setMessage(initialData.message || '');
      setRelevantExperience(initialData.relevant_experience || '');
      setGithubUrl(initialData.github_url || '');
      setPortfolioUrl(initialData.portfolio_url || '');
      setAvailability(initialData.availability || '');
      if (Array.isArray(initialData.skills)) {
        setSkills(initialData.skills);
      }
    }
  }, [initialData]);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (trimmed && !skills.includes(trimmed)) {
        setSkills([...skills, trimmed]);
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFileError('');

    if (!isEditing && !selectedFile && !initialData?.resume_filename) {
      setFileError('Please upload your CV / Resume before submitting.');
      return;
    }

    if (!message.trim()) {
      setError('Please write a short cover message describing why you are interested.');
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      if (startup?.id) {
        formData.append('startup_id', startup.id);
      }
      formData.append('message', message.trim());
      formData.append('relevant_experience', relevantExperience.trim());
      formData.append('github_url', githubUrl.trim());
      formData.append('portfolio_url', portfolioUrl.trim());
      formData.append('availability', availability.trim());
      formData.append('skills', JSON.stringify(skills));

      if (selectedFile) {
        formData.append('resume', selectedFile);
      }

      await onSubmit(formData);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to submit application.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Info */}
      {startup && (
        <div className="rounded-xl border border-blueprint-line bg-blueprint-900/80 p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan">
                {isEditing ? 'Edit Application' : 'Apply To Project'}
              </span>
              <h1 className="mt-1 font-display text-2xl font-bold text-paper">
                {startup.title}
              </h1>
              {startup.tagline && (
                <p className="mt-1 text-sm text-paper-dim">{startup.tagline}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-ink-red/30 bg-ink-red/10 p-4 text-sm text-ink-red">
          {error}
        </div>
      )}

      {/* Form Fields */}
      <div className="blueprint-card space-y-6 p-6">
        <TextArea
          id="cover-message"
          label="Cover Message / Why are you interested?"
          placeholder="Introduce yourself and explain why you're a great fit for this startup..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
        />

        <TextArea
          id="relevant-experience"
          label="Relevant Experience"
          placeholder="Highlight your previous projects, roles, or relevant work..."
          value={relevantExperience}
          onChange={(e) => setRelevantExperience(e.target.value)}
          rows={4}
        />

        {/* Skills Tag Input */}
        <div>
          <label className="text-sm font-medium text-paper">Skills</label>
          <div className="mt-1.5 flex flex-wrap gap-2 rounded-lg border border-blueprint-line bg-slate-900 p-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-md bg-cyan/20 px-2.5 py-1 text-xs font-medium text-cyan"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-1 text-cyan/70 hover:text-cyan"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder={
                skills.length === 0 ? 'Type a skill and press Enter or comma...' : 'Add more...'
              }
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              className="flex-1 bg-transparent text-sm text-paper outline-none placeholder:text-paper-faint"
            />
          </div>
          <span className="mt-1 text-xs text-paper-faint">Press Enter or comma to add each skill tag</span>
        </div>

        {/* URLs & Availability */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="github-url"
            label="GitHub URL"
            placeholder="https://github.com/yourusername"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />

          <Input
            id="portfolio-url"
            label="Portfolio / Website URL"
            placeholder="https://yourportfolio.com"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
          />
        </div>

        <Input
          id="availability"
          label="Availability / Commitment"
          placeholder="e.g. 15-20 hrs/week, Immediate join"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        />

        {/* Resume Upload */}
        <ResumeUpload
          selectedFile={selectedFile}
          existingFileName={initialData?.resume_filename}
          onFileSelect={(file) => {
            setSelectedFile(file);
            setFileError('');
          }}
          onFileRemove={() => setSelectedFile(null)}
          error={fileError}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={submitting}
        >
          <ArrowLeft size={16} className="mr-1.5" />
          Cancel
        </Button>

        <Button type="submit" loading={submitting}>
          {isEditing ? (
            <>
              <CheckCircle2 size={16} className="mr-1.5" />
              Save Changes
            </>
          ) : (
            <>
              <Send size={16} className="mr-1.5" />
              Submit Application
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
