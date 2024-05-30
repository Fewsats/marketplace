// COMPONENTS
import Link from 'next/link';

export default function PrimaryButton({
  type = 'button',
  buttonText,
  disabled = false,
  action,
  link,
  autoWidth,
  backgroundColor,
  backgroundColorHover,
  openInNewTab,
}: {
  buttonText: string;
  disabled?: boolean;
  action?: () => void;
  link?: string;
  autoWidth?: boolean;
  backgroundColor?: string;
  backgroundColorHover?: string;
  openInNewTab?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <>
      {link ? (
        <Link
          href={link}
          className={`flex transition-all ${
            !autoWidth ? 'w-full' : 'w-fit'
          } justify-center rounded-lg px-3 py-2 text-base text-white outline-none ${
            !backgroundColorHover ? `hover:bg-violet-800` : backgroundColorHover
          } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            disabled
              ? 'pointer-events-none bg-gray-200 text-gray-500'
              : `${
                  !backgroundColor ? `bg-violet-700` : backgroundColor
                } shadow-inner-white outline-none ring-1 ring-inset ring-zinc-700`
          }`}
          target={openInNewTab ? '_blank' : undefined}
        >
          {buttonText}
        </Link>
      ) : (
        <button
          type={type}
          disabled={disabled}
          className={`flex transition-all ${
            !autoWidth ? 'w-full' : 'w-fit'
          } justify-center rounded-lg px-3 py-2 text-base text-white outline-none ${
            !backgroundColorHover ? `hover:bg-violet-800` : backgroundColorHover
          } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            disabled
              ? 'pointer-events-none bg-gray-200 text-gray-500'
              : `${!backgroundColor ? `bg-violet-700` : backgroundColor} shadow-inner-white outline-none ring-1 ring-inset ring-zinc-700`
          }`}
          onClick={action}
        >
          {buttonText}
        </button>
      )}
    </>
  );
}
