import { useState, useEffect } from 'react';
import { Download, ExternalLink, FileText, Loader2 } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { getApplicationResumeBlob, getResumeDownloadUrl } from '../../services/application.service.js';

export default function ResumeViewer({ applicationId, fileName }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fallbackDownloadUrl = applicationId ? getResumeDownloadUrl(applicationId) : '';
  const isPdf = !fileName || fileName.toLowerCase().endsWith('.pdf');

  useEffect(() => {
    if (!applicationId) return;

    let currentUrl = null;
    let isMounted = true;

    async function loadResume() {
      try {
        setLoading(true);
        setError(false);
        const blob = await getApplicationResumeBlob(applicationId);
        if (isMounted) {
          const pdfBlob = new Blob([blob], { type: 'application/pdf' });
          currentUrl = URL.createObjectURL(pdfBlob);
          setBlobUrl(currentUrl);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load resume file:', err);
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadResume();

    return () => {
      isMounted = false;
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [applicationId]);

  if (!applicationId) return null;

  const activeDownloadUrl = blobUrl || fallbackDownloadUrl;

  return (
    <div className="rounded-lg border border-blueprint-line bg-blueprint-900/50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-md bg-cyan/20 p-2 text-cyan">
            <FileText size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-xs text-paper-dim uppercase tracking-wider">
              Resume / CV
            </p>
            <p className="truncate text-sm font-medium text-paper">
              {fileName || 'Applicant_Resume.pdf'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPdf && activeDownloadUrl && (
            <a
              href={activeDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-blueprint-line bg-blueprint-800 px-3 py-1.5 text-xs font-medium text-paper hover:bg-blueprint-700 transition-colors"
            >
              <ExternalLink size={14} />
              <span>Preview</span>
            </a>
          )}
          {activeDownloadUrl && (
            <a href={activeDownloadUrl} download={fileName || 'Resume.pdf'}>
              <Button variant="outline" className="px-3 py-1.5 text-xs">
                <Download size={14} className="mr-1.5" />
                Download
              </Button>
            </a>
          )}
        </div>
      </div>

      {loading && (
        <div className="mt-4 flex h-64 items-center justify-center rounded-lg border border-blueprint-line bg-slate-950 text-paper-dim">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan" />
          <span className="text-xs font-mono">Loading resume preview...</span>
        </div>
      )}

      {error && !loading && (
        <div className="mt-4 flex h-32 items-center justify-center rounded-lg border border-blueprint-line bg-slate-950 text-ink-red text-xs">
          Failed to load resume preview.
        </div>
      )}

      {!loading && !error && blobUrl && isPdf && (
        <div className="mt-4 overflow-hidden rounded-lg border border-blueprint-line bg-slate-950">
          <iframe
            src={blobUrl}
            title="Resume Preview"
            className="h-96 w-full border-none"
          />
        </div>
      )}
    </div>
  );
}

