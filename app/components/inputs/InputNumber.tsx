import React, { useEffect, useRef } from 'react';
// COMPONENTS
import IMask, { InputMask } from 'imask';

export default function InputNumber({
  id,
  name,
  value,
  placeholder,
  onChange,
  isError,
  errorText,
  theme,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  isError?: string | boolean;
  errorText?: string;
  theme?: string;
}) {
  const ref: React.RefObject<HTMLInputElement> = useRef(null);
  const maskOptions = {
    mask: Number,
  };
  const mask: React.RefObject<InputMask<any> | null | any> | any = useRef(null);

  useEffect(() => {
    if (ref.current) {
      mask.current = IMask(ref.current, maskOptions);
      mask.current.on('accept', handleChange);
    }

    return () => {
      mask.current.off('accept', handleChange);
      mask.current?.destroy();
    };
  }, [ref]);

  const handleChange = () => {
    onChange(mask.current?.value);
  };

  useEffect(() => mask.current?.updateValue(), [value]);

  return (
    <div className={'w-full'}>
      <div className='relative w-full rounded-md'>
        <input
          ref={ref}
          type='text'
          name={name}
          id={id || name}
          className={`block w-full rounded-md border-0 ${
            theme !== 'landing' ? 'px-2 py-1.5' : 'px-3 py-1.5 lg:py-3.5'
          } text-black ring-1 ring-inset ${
            isError ? 'ring-red-600' : 'ring-gray-300'
          } placeholder:text-gray-400 focus:ring-1 focus:ring-inset ${
            isError ? 'focus:ring-red-600' : 'focus:ring-zinc-950'
          } shadow-none outline-none ${
            theme !== 'landing' ? 'sm:text-sm' : 'sm:text-base'
          } sm:leading-6`}
          placeholder={placeholder}
          defaultValue={value}
        />
      </div>
      {isError && errorText && (
        <p className='mt-2 text-sm text-red-600' id={`${id || name}-error`}>
          {errorText}
        </p>
      )}
    </div>
  );
}
