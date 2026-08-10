import { Users, ChevronDown } from 'lucide-react';

// Dark-themed replacement for the old two-card role picker — styled
// to match the other auth inputs (icon left, chevron right). Wires
// straight into the same generic onChange handler Register.jsx already
// uses for every other field (name="role"), so no state logic changed.
export default function AuthRoleSelect({ id = 'role', name = 'role', label = 'I am a', value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-auth-text-dim">
        {label}
      </label>
      <div className="relative">
        <Users
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-auth-text-muted"
        />
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="h-[52px] w-full appearance-none rounded-[14px] border border-auth-border bg-auth-input pl-11 pr-10 text-sm text-auth-text outline-none transition-all duration-200 focus:border-auth-blue-bright focus:ring-2 focus:ring-auth-blue-bright/20"
        >
          <option value="founder" className="bg-auth-surface-2 text-auth-text">Founder</option>
          <option value="developer" className="bg-auth-surface-2 text-auth-text">Developer</option>
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-auth-text-muted"
        />
      </div>
    </div>
  );
}
