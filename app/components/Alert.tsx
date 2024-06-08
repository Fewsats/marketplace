// COMPONENTS
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  ExclamationTriangleIcon,
  CheckIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import PrimaryButton from '@/app/components/buttons/PrimaryButton';

export default function Alert({
  open,
  onClose,
  title,
  text,
  button,
  theme,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  text: string | JSX.Element;
  button: string;
  theme: string;
  className?: string;
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='fixed z-50' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-100 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className={`relative my-8 max-w-xl transform overflow-hidden rounded-lg bg-white p-4 shadow-md transition-all sm:w-full sm:p-9 ${className}`}>
                <div className='flex flex-col items-center'>
                  <div
                    className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${theme === 'success' ? 'bg-emerald-100' : 'bg-red-100'} sm:mx-0`}
                  >
                    {theme === 'success' && (
                      <CheckIcon
                        className='h-6 w-6 text-emerald-500 md:mt-0.5'
                        aria-hidden='true'
                      />
                    )}
                    {theme === 'error' && (
                      <XCircleIcon
                        className='h-6 w-6 text-red-600 md:mt-0.5'
                        aria-hidden='true'
                      />
                    )}
                    {!theme && (
                      <ExclamationTriangleIcon
                        className='h-6 w-6 text-red-600'
                        aria-hidden='true'
                      />
                    )}
                  </div>
                  <Dialog.Title
                    as='h3'
                    className='mt-3 text-center text-base text-lg font-semibold leading-6 text-zinc-950'
                  >
                    {title}
                  </Dialog.Title>
                  <div className='mt-3'>
                    <p className='text-center text-base text-zinc-500'>
                      {text}
                    </p>
                  </div>
                </div>
                <div className='mt-6 flex justify-end space-x-6'>
                  <PrimaryButton action={onClose} buttonText={button} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
