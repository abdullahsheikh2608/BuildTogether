import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

// Wraps a dark-themed input with a leading lock icon and a show/hide
// toggle — used for every password field on Login and Register.
export default function PasswordInput({ id, label, error, className = '', ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-auth-text-dim">
          {label}
        </label>
      )}
      <div className="relative">
        <Lock
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-auth-text-muted"
        />
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className={`h-[52px] w-full rounded-[14px] border bg-auth-input py-2.5 pl-11 pr-11 text-sm text-auth-text
            placeholder:text-auth-text-muted outline-none transition-all duration-200
            ${error
              ? 'border-red-500/60 focus:ring-2 focus:ring-red-500/20'
              : 'border-auth-border focus:border-auth-blue-bright focus:ring-2 focus:ring-auth-blue-bright/20'}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-auth-text-muted transition-colors hover:text-auth-text-dim"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
