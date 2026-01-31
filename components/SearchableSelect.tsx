'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  label,
  required = false,
  disabled = false,
  className,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = value ? options.find((opt) => opt === value) : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={cn('relative w-full', className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full box-border px-3 sm:px-4 py-3 rounded-lg border border-border bg-background text-foreground',
          'flex items-center gap-2 min-w-0',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'transition-all text-left overflow-hidden',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'hover:border-primary/50'
        )}
      >
        <span className={cn('truncate flex-1 min-w-0 text-left text-ellipsis overflow-hidden whitespace-nowrap', !selectedOption && 'text-muted-foreground')}>
          {selectedOption || placeholder}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-hidden left-0 right-0 max-w-full">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full box-border pl-9 pr-8 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto overflow-x-hidden">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={cn(
                    'w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors',
                    value === option && 'bg-primary/10 text-primary font-medium'
                  )}
                >
                  <span className="break-words block whitespace-normal">{option}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

