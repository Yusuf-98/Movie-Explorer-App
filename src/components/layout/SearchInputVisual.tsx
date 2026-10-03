import type { Ref } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import CloseInput from '../../assets/icons/close-input.png';

interface SearchInputVisualProps {
  variant: 'mobile' | 'desktop';
  value: string;
  onChangeText: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errorMessage?: string;
  inputRef: Ref<HTMLInputElement>;
  autoFocus?: boolean;
}

export function SearchInputVisual({
  variant,
  value,
  onChangeText,
  onSubmit,
  errorMessage,
  inputRef,
  autoFocus,
}: SearchInputVisualProps) {
  if (variant === 'mobile') {
    return (
      <form onSubmit={onSubmit} className="flex-1 relative flex items-center">
        <Search
          className="w-6 h-6 absolute left-4 text-neutral-500 pointer-events-none shrink-0"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          type="text"
          placeholder="Search Movie"
          autoFocus={autoFocus}
          className={cn(
            'w-full h-11 pl-11 py-md bg-neutral-950/60 border border-neutral-800 rounded-xl',
            'text-neutral-25 text-size-sm placeholder:text-neutral-500',
            'focus:border-neutral-500/30 transition-all duration-200',
            value ? 'pr-10' : 'pr-xl'
          )}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChangeText('')}
            aria-label="Clear"
            className="absolute right-3 flex items-center justify-center  py-md px-xl cursor-pointer "
          >
            <img src={CloseInput} alt="Clear Typing" className="w-4 h-4" />
          </button>
        )}
        {errorMessage && (
          <p className="absolute top-full left-0 mt-xs text-primary-200 text-size-xs">
            {errorMessage}
          </p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative w-60.75 h-14 hidden md:block">
      <div className="relative w-full h-full flex items-center">
        <Search
          className="w-6 h-6 absolute left-4 text-neutral-500 pointer-events-none"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          type="text"
          placeholder="Search Movie"
          className="h-full w-full border transition-all duration-200 pl-12 pr-10 bg-neutral-950/60 text-neutral-25 placeholder:text-neutral-500 border-neutral-800 focus:border-neutral-500/30 focus:border"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChangeText('')}
            aria-label="Clear"
            className="absolute right-4 p-0.75 transition-colors cursor-pointer"
          >
            <img src={CloseInput} alt="Clear" className="w-5 h-5" />
          </button>
        )}
        {errorMessage && (
          <p className="absolute top-full left-0 mt-xs text-primary-200 text-size-xs whitespace-nowrap">
            {errorMessage}
          </p>
        )}
      </div>
    </form>
  );
}
