import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Loader2,
  Briefcase,
  ListChecks,
  Rocket,
  FileText,
  X,
} from 'lucide-react';

import { useGlobalSearch } from '../../hooks/useGlobalSearch.js';

const TYPE_ICON = {
  project: Briefcase,
  task: ListChecks,
  startup: Rocket,
  application: FileText,
};

// Reusable global search bar + floating results dropdown.
// Connects to GET /api/search via useGlobalSearch and navigates to the
// correct page for whichever result the user picks.
export default function GlobalSearch() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const {
    query,
    setQuery,
    groupedResults,
    loading,
    error,
    open,
    setOpen,
    clear,
  } = useGlobalSearch();

  const flatItems = useMemo(
    () => groupedResults.flatMap((group) => group.items),
    [groupedResults]
  );

  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query, flatItems.length]);

  // Close on outside click.
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setOpen]);

  // Close on Escape.
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [setOpen]);

  function handleSelect(item) {
    if (!item) return;
    navigate(item.route);
    clear();
    inputRef.current?.blur();
  }

  function handleKeyDown(event) {
    if (!open || flatItems.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, flatItems.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === 'Enter') {
      if (activeIndex >= 0) {
        event.preventDefault();
        handleSelect(flatItems[activeIndex]);
      }
    }
  }

  const showDropdown = open && query.trim().length > 0;

  return (
    <div className="relative hidden max-w-sm flex-1 md:block" ref={containerRef}>
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-faint"
      />

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => {
          if (query.trim()) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search anything..."
        aria-label="Global search"
        role="combobox"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
        autoComplete="off"
        className="w-full rounded-lg border border-blueprint-line bg-blueprint-950 py-2.5 pl-9 pr-9 text-sm text-paper placeholder:text-paper-faint outline-none transition-all duration-200 focus:border-cyan focus:bg-white focus:ring-2 focus:ring-cyan/15"
      />

      {query && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-paper-faint transition-colors hover:text-paper"
        >
          <X size={14} />
        </button>
      )}

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[28rem] overflow-y-auto rounded-xl border border-blueprint-line bg-white shadow-xl">
          {loading ? (
            <div className="flex items-center gap-2 px-4 py-6 text-sm text-paper-dim">
              <Loader2 size={16} className="animate-spin text-cyan" />
              Searching...
            </div>
          ) : error ? (
            <div className="px-4 py-6 text-center text-sm text-ink-red">
              {error}
            </div>
          ) : flatItems.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-paper-dim">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="py-2">
              {groupedResults.map((group) => (
                <div key={group.type} className="px-2 py-1">
                  <p className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-paper-faint">
                    {group.label}
                  </p>

                  {group.items.map((item) => {
                    const Icon = TYPE_ICON[item.type] || Search;
                    const index = flatItems.indexOf(item);
                    const isActive = index === activeIndex;

                    return (
                      <button
                        key={`${item.type}-${item.id}`}
                        type="button"
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => handleSelect(item)}
                        className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors duration-150 cursor-pointer ${
                          isActive ? 'bg-cyan-dim/40' : 'hover:bg-blueprint-800/60'
                        }`}
                      >
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-dim/50 text-cyan">
                          <Icon size={16} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-paper">
                            {item.title}
                          </span>
                          {item.subtitle && (
                            <span className="block truncate text-xs text-paper-dim">
                              {item.subtitle}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}