import { useEffect } from 'react';
import type { Ref } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { searchSchema, type SearchFormValues } from '@/lib/schemas';
import { SearchInputVisual } from './SearchInputVisual';

interface SearchFormFieldsProps {
  variant: 'mobile' | 'desktop';
  initialQuery: string;
  onQueryChange: (value: string) => void;
  onSubmitQuery: (value: string) => void;
  inputRef: Ref<HTMLInputElement>;
  autoFocus?: boolean;
}

export default function SearchFormFields({
  variant,
  initialQuery,
  onQueryChange,
  onSubmitQuery,
  inputRef,
  autoFocus,
}: SearchFormFieldsProps) {
  const {
    control,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: initialQuery },
    mode: 'onChange',
  });
  const query = useWatch({ control, name: 'query' });

  // --- Validate value seeded from the eager fallback ---
  useEffect(() => {
    trigger('query');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Sync external resets (openSearch, closeSearch, closeMenu) ---
  useEffect(() => {
    if (initialQuery !== query) {
      setValue('query', initialQuery, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleChangeText = (value: string) => {
    setValue('query', value, { shouldValidate: true });
    onQueryChange(value);
  };

  const onSubmit = handleSubmit((values) => onSubmitQuery(values.query));

  return (
    <SearchInputVisual
      variant={variant}
      value={query ?? ''}
      onChangeText={handleChangeText}
      onSubmit={onSubmit}
      errorMessage={errors.query?.message}
      inputRef={inputRef}
      autoFocus={autoFocus}
    />
  );
}
