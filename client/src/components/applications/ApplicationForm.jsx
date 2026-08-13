import { useState } from 'react';

import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import Select from '../ui/Select.jsx';
import ResumeUpload from './ResumeUpload.jsx';

const isValidUrl = (value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const AVAILABILITY_OPTIONS = [
  { value: '', label: 'Select availability' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Weekends only', label: 'Weekends only' },
  { value: 'Few hours a week', label: 'Few hours a week' },
];

// Shared between the "Apply Now" flow (StartupApplyPage) and the
// developer's "Edit Application" page — same fields, same validation,
// same resume upload widget, just a different submit handler/labels
// supplied by the caller. Field names here (relevant_experience,
// resume_filename, skills, availability) match the applications table
// exactly — the backend has no "experience"/"resume_name" columns.
export default function ApplicationForm({
  initialValues = {},
  existingResumeName = '',
  submitting = false,
  submitLabel = 'Submit Application',
  onSubmit,
  onCancel,
}) {
  const [message, setMessage] = useState(initialValues.message || '');
  const [experience, setExperience] = useState(initialValues.relevant_experience || '');
  const [githubUrl, setGithubUrl] = useState(initialValues.github_url || '');
  const [portfolioUrl, setPortfolioUrl] = useState(initialValues.portfolio_url || '');
  const [skillsInput, setSkillsInput] = useState(
    Array.isArray(initialValues.skills) ? initialValues.skills.join(', ') : ''
  );
  const [availability, setAvailability] = useState(initialValues.availability || '');
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};

    if (message.length > 1000) {
      nextErrors.message = 'Cover message must be under 1000 characters.';
    }
    if (experience.length > 2000) {
      nextErrors.experience = 'Experience must be under 2000 characters.';
    }
    if (!isValidUrl(githubUrl)) {
      nextErrors.github_url = 'Enter a full URL, e.g. https://github.com/yourname';
    }
    if (!isValidUrl(portfolioUrl)) {
      nextErrors.portfolio_url = 'Enter a full URL, e.g. https://yourportfolio.com';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const skills = skillsInput
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);

    onSubmit(
      {
        message,
        relevant_experience: experience,
        github_url: githubUrl,
        portfolio_url: portfolioUrl,
        skills: JSON.stringify(skills),
        availability,
      },
      resumeFile
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="application-message" className="text-sm font-medium text-paper">
          Cover Message / Why are you interested?
        </label>
        <textarea
          id="application-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell the founder why you're a great fit for this project..."
          className={`rounded-lg border bg-white px-3.5 py-2.5 text-sm text-paper placeholder:text-paper-faint outline-none transition-all duration-200 ${
            errors.message
              ? 'border-ink-red focus:ring-2 focus:ring-ink-red/20'
              : 'border-blueprint-line focus:border-cyan focus:ring-2 focus:ring-cyan/15'
          }`}
        />
        {errors.message && <span className="text-xs text-ink-red">{errors.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="application-experience" className="text-sm font-medium text-paper">
          Relevant Experience
        </label>
        <textarea
          id="application-experience"
          rows={4}
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Summarize the projects, roles, or skills relevant to this application..."
          className={`rounded-lg border bg-white px-3.5 py-2.5 text-sm text-paper placeholder:text-paper-faint outline-none transition-all duration-200 ${
            errors.experience
              ? 'border-ink-red focus:ring-2 focus:ring-ink-red/20'
              : 'border-blueprint-line focus:border-cyan focus:ring-2 focus:ring-cyan/15'
          }`}
        />
        {errors.experience && <span className="text-xs text-ink-red">{errors.experience}</span>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="application-skills"
          label="Skills"
          placeholder="React, Node.js, PostgreSQL"
          hint="Comma-separated"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="application-availability" className="text-sm font-medium text-paper">
            Availability
          </label>
          <Select
            id="application-availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="application-github"
          label="GitHub URL"
          placeholder="https://github.com/yourname"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          error={errors.github_url}
        />
        <Input
          id="application-portfolio"
          label="Portfolio URL"
          placeholder="https://yourportfolio.com"
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
          error={errors.portfolio_url}
        />
      </div>

      <ResumeUpload
        selectedFile={resumeFile}
        existingFileName={existingResumeName}
        onFileSelect={setResumeFile}
        onFileRemove={() => setResumeFile(null)}
      />

      <div className="mt-2 flex items-center gap-3 border-t border-blueprint-line pt-5">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}