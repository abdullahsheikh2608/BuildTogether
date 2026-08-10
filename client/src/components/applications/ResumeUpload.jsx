import { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import Button from '../ui/Button.jsx';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

export default function ResumeUpload({
  selectedFile,
  existingFileName,
  onFileSelect,
  onFileRemove,
  error: externalError,
}) {
  const [internalError, setInternalError] = useState('');
  const fileInputRef = useRef(null);

  const validateAndSetFile = (file) => {
    setInternalError('');

    if (!file) return;

    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      setInternalError('Invalid file format. Please upload a PDF, DOC, or DOCX document.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setInternalError('File is too large. Maximum file size allowed is 10MB.');
      return;
    }

    onFileSelect(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const currentError = externalError || internalError;
  const activeFileName = selectedFile?.name || existingFileName;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-paper">
        Resume / CV <span className="text-ink-red">*</span>
      </label>

      {activeFileName ? (
        <div className="flex items-center justify-between rounded-lg border border-cyan/40 bg-blueprint-900/60 p-4 transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-md bg-cyan/20 p-2 text-cyan">
              <FileText size={22} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-paper">
                {activeFileName}
              </p>
              <p className="text-xs text-paper-dim">
                {selectedFile
                  ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Selected for upload`
                  : 'Currently uploaded resume'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="px-3 py-1 text-xs"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace File
            </Button>
            {onFileRemove && (
              <button
                type="button"
                onClick={() => {
                  setInternalError('');
                  onFileRemove();
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="rounded-md p-1.5 text-paper-faint hover:bg-slate-800 hover:text-paper"
                title="Remove file"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className={`group flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-all ${
            currentError
              ? 'border-ink-red bg-ink-red/5'
              : 'border-blueprint-line bg-blueprint-900/40 hover:border-cyan hover:bg-cyan/5'
          }`}
        >
          <div className="rounded-full bg-blueprint-800 p-3 text-cyan group-hover:scale-105 transition-transform">
            <Upload size={24} />
          </div>
          <p className="mt-3 text-sm font-medium text-paper">
            Click to upload or drag & drop CV/Resume
          </p>
          <p className="mt-1 text-xs text-paper-dim">
            Accepted formats: PDF, DOC, DOCX (Max 10MB)
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        className="hidden"
      />

      {currentError && (
        <div className="flex items-center gap-1.5 text-xs text-ink-red mt-1">
          <AlertCircle size={14} />
          <span>{currentError}</span>
        </div>
      )}
    </div>
  );
}
