'use client';

import React, { useState, useEffect } from 'react';
// COMPONENTS
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import PrimaryButton from '@/app/components/buttons/PrimaryButton';
import InputText from '@/app/components/inputs/InputText';
import Alert from '@/app/components/Alert';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import Tooltip from '@/app/components/Tooltip';
// TYPES
import { FileObject } from '@/app/types';
// UTILS
import formatPrice from '@/app/utils/formatPrice';
import formatFileSize from '@/app/utils/formatFileSize';
import FileSaver from 'file-saver';
import { downloadFile, getL402Header, parseL402Header } from '@/app/utils/downloadFile';

const FileComponent = ({ file }: { file: FileObject }) => {
  const [credentials, setCredentials] = useState('');
  const [isValidCredentials, setIsValidCredentials] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);

  useEffect(() => {
    // Basic format check: should be "string:string"
    const isValid = /^[^:]+:[^:]+$/.test(credentials.trim());
    setIsValidCredentials(isValid);
  }, [credentials]);

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(e.target.value);
  };

  const handleRetrieveFile = async () => {
    if (!isValidCredentials) {
      setErrorAlert(true);
      return;
    }

    const [macaroon, preimage] = credentials.split(':');

    try {
      const blob = await downloadFile(file.external_id, macaroon, preimage);
      FileSaver.saveAs(blob, file.file_name);
      setSuccessAlert(true);
    } catch (error) {
      console.error('File retrieval failed:', error);
      setErrorAlert(true);
    }
  };

  return (
    <div
      className={
        'mx-auto h-full min-h-screen w-full max-w-screen-1xl flex-col space-y-6 bg-white px-4 pb-8 pt-6 sm:space-y-8 sm:pb-16 sm:pt-8 md:px-14'
      }
    >
      <div className={'flex w-full py-2 text-sm leading-6 text-gray-500'}>
        <Link
          href={'/'}
          className={
            'items-align flex space-x-3 transition-colors hover:text-violet-600'
          }
        >
          <ChevronLeftIcon className={'h-6 w-6'} />
          <span>Back to Catalog</span>
        </Link>
      </div>
      {file && (
        <div className={'w-full'}>
          <div
            className={
              'mb-1 text-2xl font-bold text-zinc-950 sm:mb-4 sm:text-3xl'
            }
          >
            {file.name.replace(file.extension, '')}
          </div>
          <div
            className={
              'mb-6 py-1.5 text-base font-medium leading-6 text-zinc-400 sm:mb-8 md:mb-9'
            }
          >
            Price:
            <span
              className={
                'ml-2 text-lg font-semibold leading-6 text-zinc-950 sm:text-xl'
              }
            >
              {formatPrice(file.price_in_cents)}
            </span>
          </div>
          <div
            className={
              'flex flex-col space-y-6 sm:space-y-8 md:flex-row md:space-y-0'
            }
          >
            <div className={'relative flex-1'}>
              {file.cover_url ? (
                <Image
                  src={file.cover_url}
                  alt={file.name.replace(file.extension, '')}
                  className={`h-auto w-full rounded-lg border border-gray-200`}
                  width={692}
                  height={603}
                />
              ) : (
                <div
                  className={
                    'flex aspect-square items-center justify-center rounded-lg border border-gray-200 bg-black p-2.5 text-sm text-white'
                  }
                >
                  <span
                    className={
                      'line-clamp-2 whitespace-normal break-all text-center'
                    }
                  >
                    {file.name.replace(file.extension, '')}
                  </span>
                </div>
              )}
            </div>
            <div
              className={'flex-1 space-y-6 px-0 sm:space-y-8 md:px-4 lg:px-11'}
            >
              <div className={'text-sm text-zinc-950'}>
                {`Created: ${file.created_at ? new Date(file.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}`}
              </div>
              <div
                className={
                  'whitespace-pre-line text-base font-light text-zinc-950'
                }
                dangerouslySetInnerHTML={{ __html: file.description }}
              />
              <div className={'flex flex-wrap items-start gap-2'}>
                {file.tags
                  ?.filter((tag) => !!tag)
                  .map((tag, i) => (
                    <div
                      key={i}
                      className={
                        'rounded-md bg-purple-100 px-1.5 py-1  text-xs font-medium leading-4 text-purple-700 sm:px-2 sm:py-2 sm:text-base'
                      }
                    >
                      {tag}
                    </div>
                  ))}
              </div>
              <div className={'flex gap-2'}>
                <div
                  className={
                    'flex-1 rounded-lg border border-gray-300 p-3 text-sm leading-4 text-zinc-400 sm:p-4 sm:text-base'
                  }
                  style={{ display: 'none' }}
                >
                  Size:
                  <span className={'ml-2 font-medium text-zinc-950'}>
                    {file.size && formatFileSize(file.size)}
                  </span>
                </div>
                <div
                  className={
                    'flex-1 rounded-lg border border-gray-300 p-3 text-sm leading-4 text-zinc-400 sm:p-4 sm:text-base'
                  }
                >
                  File Name:
                  <span className={'ml-2 break-all font-medium text-zinc-950'}>
                    {file.file_name}
                  </span>
                </div>
              </div>
              <div className={'w-full flex flex-col space-y-4'}>
                <PrimaryButton
                  buttonText={'Buy'}
                  link={`/billing/${file.external_id}`}
                />
                <div className="flex items-center justify-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 flex-shrink text-gray-500 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 text-center">
                    Pay with Hub and get instant access to your file:
                  </p>
                  <PrimaryButton
                    buttonText={'Pay with Hub'}
                    link={`http://app.paywithhub.com/purchases?l402_url=${encodeURIComponent(`${process.env.API_URL}/v0/storage/download/${file.external_id}`)}`}
                    openInNewTab={true}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 flex-shrink text-gray-500 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <div className="space-y-2 relative">
                  <p className="text-sm text-gray-600 text-center flex items-center justify-center">
                    After paying with Hub, enter the provided credentials here:
                  </p>
                  <InputText
                    type="text"
                    name="credentials"
                    placeholder="Enter credentials"
                    value={credentials}
                    onChange={handleCredentialsChange}
                    isError={credentials !== '' && !isValidCredentials}
                    errorText={credentials !== '' && !isValidCredentials ? "Invalid format. Should be 'macaroon:preimage'." : ""}
                  />
                  <PrimaryButton
                    buttonText={'Download File'}
                    action={handleRetrieveFile}
                    disabled={!isValidCredentials}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Alert
        open={successAlert}
        onClose={() => setSuccessAlert(false)}
        title={'File retrieved successfully'}
        text={'Your file has been downloaded!'}
        button={'Close'}
        theme={'success'}
      />
      <Alert
        open={errorAlert}
        onClose={() => setErrorAlert(false)}
        title={'File retrieval failed'}
        text={'We could not retrieve the file. Please check your credentials and try again.'}
        button={'Close'}
        theme={'error'}
      />
    </div>
  );
};

export default FileComponent;