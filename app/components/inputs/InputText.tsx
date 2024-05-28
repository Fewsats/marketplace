import React from 'react';

export default function InputText({
  isError,
  errorText,
  type = 'text',
  name,
  id,
  placeholder,
  value,
  onChange,
  maxLength,
  theme,
  autoComplete,
}: {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  isError?: string | boolean;
  errorText?: string;
  autoComplete?: string;
  theme?: string;
}) {
  return (
    <div className={'w-full'}>
      <div className='relative rounded-md'>
        {maxLength && (
          <div
            className={'mb-1 text-right text-sm text-gray-300'}
          >{`${value.length}/${maxLength}`}</div>
        )}
        <input
          type={type}
          name={name}
          id={id || name}
          className={`block w-full rounded-md border-0 ${
            theme !== 'landing' ? 'px-2 py-1.5' : 'px-3 py-1.5 lg:py-3.5'
          } text-black ring-1 ring-inset ${
            isError ? `ring-red-600` : 'ring-gray-300'
          } placeholder:text-gray-400 focus:ring-1 focus:ring-inset ${
            isError ? `focus:ring-red-600` : `focus:ring-zinc-950`
          } shadow-none outline-none ${
            theme !== 'landing' ? 'sm:text-sm' : 'sm:text-base'
          } sm:leading-6`}
          placeholder={placeholder}
          aria-describedby={`${id || name}-error`}
          onChange={onChange}
          value={value}
          maxLength={maxLength}
          autoComplete={autoComplete}
        />
      </div>
      {isError && errorText && (
        <p className={`mt-2 text-sm text-red-600`} id={`${id || name}-error`}>
          {errorText}
        </p>
      )}
    </div>
  );
}
