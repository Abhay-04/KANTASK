import { ChevronDown } from 'lucide-react';

// Native <select> (accessible + mobile friendly) with consistent styling.
// options: [{ value, label }]
export default function Select({ id, value, onChange, options, className = '', ...props }) {
  return (
    <div className={`relative ${className}`}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="form-input cursor-pointer appearance-none pr-9"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-400"
        aria-hidden="true"
      />
    </div>
  );
}
