import { Fragment, useMemo } from 'react';
// COMPONENTS
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
// TYPES
import { Option } from '@/app/types';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function InputSelect({
  options,
  onChange,
  selected,
  autoWidth,
}: {
  onChange: (option: Option) => void;
  selected: Option | any;
  options: Option[] | any;
  autoWidth?: boolean;
}) {
  const active = useMemo(
    () => options.find((option: Option | any) => option.id === selected),
    [options, selected]
  );
  return (
    <div className={`${!autoWidth ? 'w-full' : 'w-fit'}`}>
      <Listbox value={selected} onChange={onChange}>
        {({ open }) => (
          <>
            <div className='relative z-20'>
              <Listbox.Button className='relative w-full cursor-pointer py-2 pl-0 pr-6 text-left text-base leading-5 text-white outline-none focus:outline-none'>
                <span className='block truncate'>{active?.name || ''}</span>
                <span className='pointer-events-none absolute inset-y-0 right-0 ml-2 flex items-center'>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-white ${
                      open ? 'rotate-180' : 'rotate-0'
                    } transition duration-300 ease-in-out`}
                    aria-hidden='true'
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave='transition ease-in duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Listbox.Options className='absolute right-0 z-10 mt-1 max-h-60 w-fit w-full min-w-36 overflow-auto rounded-md bg-white py-0.5 text-sm shadow-lg ring-1 ring-gray-300 focus:outline-none sm:text-sm'>
                  {options.map((option: Option | any) => (
                    <Listbox.Option
                      key={option.id}
                      className={({ active }) =>
                        classNames(
                          option.id === selected
                            ? 'text-gray-700'
                            : 'text-gray-500',
                          active ? 'bg-gray-100' : '',
                          'relative cursor-pointer select-none py-1.5 pl-3 pr-3'
                        )
                      }
                      value={option}
                    >
                      {({ active }) => (
                        <>
                          <span
                            className={classNames(
                              option.id === selected
                                ? 'font-medium'
                                : 'font-normal',
                              'block truncate'
                            )}
                          >
                            {option.name}
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
}
