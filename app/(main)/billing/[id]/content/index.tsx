'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
// COMPONENTS
import Link from 'next/link';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import PrimaryButton from '@/app/components/buttons/PrimaryButton';
import InputText from '@/app/components/inputs/InputText';
import InputNumber from '@/app/components/inputs/InputNumber';
import InputPhone from '@/app/components/inputs/InputPhone';
import Alert from '@/app/components/Alert';
import { init, launchPaymentModal } from '@getalby/bitcoin-connect-react';
// TYPES
import { FileObject } from '@/app/types';
// UTILS
import formatPrice from '@/app/utils/formatPrice';
import apiClient from '@/app/services/apiClient';
import parseWWWAuthenticateHeader from '@/app/utils/parseWWWAuthenticateHeader';

const BillingComponent = ({ file }: { file: FileObject }) => {
  const [submitting, setSubmitting] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      init({ appName: 'Fewsats' });
    }
  }, []);

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        email: Yup.string()
          .matches(/^(.*)?\S+(.*)?$/, 'Field cannot be empty')
          .email('Not a valid email')
          .required('*Please enter required information'),
        phone: Yup.string()
          .matches(/^(.*)?\S+(.*)?$/, 'Field cannot be empty')
          .required('*Please enter required information'),
        firstName: Yup.string()
          .matches(/^(.*)?\S+(.*)?$/, 'Field cannot be empty')
          .required('*Please enter required information'),
        lastName: Yup.string()
          .matches(/^(.*)?\S+(.*)?$/, 'Field cannot be empty')
          .required('*Please enter required information'),
        address: Yup.string()
          .matches(/^(.*)?\S+(.*)?$/, 'Field cannot be empty')
          .required('*Please enter required information'),
        country: Yup.string()
          .matches(/^(.*)?\S+(.*)?$/, 'Field cannot be empty')
          .required('*Please enter required information'),
        postalCode: Yup.string()
          .matches(/^(.*)?\S+(.*)?$/, 'Field cannot be empty')
          .required('*Please enter required information'),
        city: Yup.string()
          .matches(/^(.*)?\S+(.*)?$/, 'Field cannot be empty')
          .required('*Please enter required information'),
        state: Yup.string()
          .matches(/^(.*)?\S+(.*)?$/, 'Field cannot be empty')
          .required('*Please enter required information'),
        company: Yup.string()
          .matches(/^(.*)?\S+(.*)?$/, 'Field cannot be empty')
          .required('*Please enter required information'),
      }),
    []
  );

  const initialValues: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    country: string;
    postalCode: string;
    city: string;
    state: string;
    company: string;
  } = {
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    country: '',
    postalCode: '',
    city: '',
    state: '',
    company: '',
  };

  const formik = useFormik({
    initialValues: initialValues,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    //validationSchema,
    onSubmit: async (values, { resetForm, setErrors }) => {
      const data = {
        'contact.email': values.email.trim(),
        'contact.phone': values.phone.trim(),
        'contact.first_name': values.firstName.trim(),
        'contact.last_name': values.lastName.trim(),
        'contact.address': values.address.trim(),
        'contact.country': values.country.trim(),
        'contact.zip': values.postalCode.trim(),
        'contact.city': values.city.trim(),
        'contact.state': values.state.trim(),
        'contact.company': values.company.trim(),
        'contact.nickname': '.',
      };

      setSubmitting(true);

      // const id = toast.loading('Processing payment...')

      const payload = {
        name: file.name,
        ...data,
      };

      try {
        let l402Header = null;

        // First try to buy the domain which will return a 402 and the WWW-Authenticate header
        await apiClient
          .get(`${process.env.API_URL}/v0/storage/download/${file.external_id}`)
          .catch((err) => {
            console.log(
              `err?.response?.status`,
              err?.response?.status
            );
            console.log(
              ` err.response.headers['WWW-Authenticate']`,
              err.response.headers['WWW-Authenticate']
            );

            console.log('fullerror', err);
            if (err.response.headers) {
              console.log('err.response.headers', err.response.headers);
              Object.keys(err.response.headers).forEach((key) => {
                console.log(key, err.response.headers[key]);
              });
            }

            if (
              err?.response?.status === 402 &&
              err?.response?.headers &&
              err?.response?.headers.get('WWW-Authenticate')
            ) {
              console.log('err.response.headers', err.response);
              l402Header = err.response.headers.get('WWW-Authenticate');
            }
            return null;
          });
        console.log('l402Header', l402Header);
        if (!l402Header) {
          // toast.error('Payment unsuccessful, no 402 header found')
          return;
        }

        const { macaroon, invoice }: { macaroon?: string; invoice?: string } =
          parseWWWAuthenticateHeader(l402Header);

        if (macaroon && invoice) {
          launchPaymentModal({
            invoice,
            paymentMethods: 'internal',
            onPaid: async ({ preimage }) => {
              // Now that the payment is successful, we can buy the domain
              await apiClient.get(
                `${process.env.API_URL}/v0/storage/download/${file.external_id}`,
                {
                  headers: { Authorization: `L402 ${macaroon}:${preimage}` },
                }
              );
              // toast.success('Payment successful')
              console.log('setting success to true');
              setSuccessAlert(true);
            },
            onCancelled: () => {
              // toast.error('Payment cancelled')
            },
          });
        }
      } catch (error) {
        // toast.error(error?.response?.data?.error || 'Payment unsuccessful')
        console.error(error);
      } finally {
        setSubmitting(false);
        // toast.dismiss(id)
      }
    },
  });

  const handleInputChange =
    (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      formik.setFieldValue(name, event.target.value);
      formik.setErrors({ ...formik.errors, [name]: false });
    };

  const handleNumberChange = (name: string) => (value: string) => {
    formik.setFieldValue(name, value);
    formik.setFieldError(name, '');
  };

  const handleCloseSuccess = () => {
    setSuccessAlert(false);
    router.push(`/`);
  };

  const handleCloseError = () => {
    setErrorAlert(false);
    router.push(`/file/${file.external_id}`);
  };

  const isValid = useMemo(
    () =>
      formik.dirty &&
      (Object.keys(formik.errors) as Array<keyof typeof formik.errors>).every(
        (error) => !formik.errors[error]
      ),
    [formik]
  );

  const firstError: string | null | any = useMemo(() => {
    const keys = Object.keys(formik.errors) as Array<
      keyof typeof formik.errors
    >;
    return keys.length && formik.errors[keys[0]];
  }, [formik]);

  return (
    <div
      className={
        'mx-auto h-full min-h-screen w-full max-w-screen-1xl flex-col space-y-6 bg-white px-4 pb-8 pt-6 sm:space-y-8 sm:pb-16 sm:pt-8 md:space-y-14 md:px-14'
      }
    >
      <div className={'flex w-full py-2 text-sm leading-6 text-gray-500'}>
        <Link
          href={`/file/${file.external_id}`}
          className={
            'items-align flex space-x-3 transition-colors hover:text-violet-600'
          }
        >
          <ChevronLeftIcon className={'h-6 w-6'} />
          <span>Go Back</span>
        </Link>
      </div>
      <div
        className={
          'mx-auto flex w-full max-w-4xl flex-col items-center rounded-lg border border-zinc-200 px-0 py-5 sm:px-4 md:px-12'
        }
      >
        <div className={'mb-8 text-xl font-medium text-zinc-950 md:text-2xl'}>
          Billing and Payment info
        </div>

        <form
          className={'flex flex w-full flex-wrap'}
          onSubmit={formik.handleSubmit}
        >
          <div className={'flex w-full flex-col p-4 md:w-1/2'}>
            <label
              htmlFor='email'
              className='block flex-1 text-sm leading-6 text-black'
            >
              Email
            </label>
            <div className='mt-1 flex-1'>
              <InputText
                type={'text'}
                name={'email'}
                id={'email'}
                placeholder={''}
                value={formik.values.email}
                // errorText={formik.errors.email}
                isError={!!formik.errors.email}
                onChange={handleInputChange('email')}
              />
            </div>
          </div>
          <div className={'flex w-full flex-col p-4 md:w-1/2'}>
            <label
              htmlFor='phone'
              className='block flex-1 text-sm leading-6 text-black'
            >
              Phone
            </label>
            <div className='mt-1 flex-1'>
              <InputPhone
                name={'phone'}
                id={'phone'}
                placeholder={''}
                value={formik.values.phone}
                // errorText={formik.errors.phone}
                isError={!!formik.errors.phone}
                onChange={handleNumberChange('phone')}
              />
            </div>
          </div>
          <div className={'flex w-full flex-col p-4 md:w-1/2'}>
            <label
              htmlFor='firstName'
              className='block flex-1 text-sm leading-6 text-black'
            >
              First name
            </label>
            <div className='mt-1 flex-1'>
              <InputText
                type={'text'}
                name={'firstName'}
                id={'firstName'}
                placeholder={''}
                value={formik.values.firstName}
                // errorText={formik.errors.firstName}
                isError={!!formik.errors.firstName}
                onChange={handleInputChange('firstName')}
              />
            </div>
          </div>
          <div className={'flex w-full flex-col p-4 md:w-1/2'}>
            <label
              htmlFor='lastName'
              className='block flex-1 text-sm leading-6 text-black'
            >
              Last name
            </label>
            <div className='mt-1 flex-1'>
              <InputText
                type={'text'}
                name={'lastName'}
                id={'lastName'}
                placeholder={''}
                value={formik.values.lastName}
                // errorText={formik.errors.lastName}
                isError={!!formik.errors.lastName}
                onChange={handleInputChange('lastName')}
              />
            </div>
          </div>
          <div className={'flex w-full flex-col p-4 md:w-1/2'}>
            <label
              htmlFor='address'
              className='block flex-1 text-sm leading-6 text-black'
            >
              Street address
            </label>
            <div className='mt-1 flex-1'>
              <InputText
                type={'text'}
                name={'address'}
                id={'address'}
                placeholder={''}
                value={formik.values.address}
                // errorText={formik.errors.address}
                isError={!!formik.errors.address}
                onChange={handleInputChange('address')}
              />
            </div>
          </div>
          <div className={'flex w-full flex-col p-4 md:w-1/2'}>
            <label
              htmlFor='country'
              className='block flex-1 text-sm leading-6 text-black'
            >
              Country
            </label>
            <div className='mt-1 flex-1'>
              <InputText
                type={'text'}
                name={'country'}
                id={'country'}
                placeholder={''}
                value={formik.values.country}
                // errorText={formik.errors.country}
                isError={!!formik.errors.country}
                onChange={handleInputChange('country')}
              />
            </div>
          </div>
          <div className={'flex w-full flex-col p-4 md:w-1/2'}>
            <label
              htmlFor='postalCode'
              className='block flex-1 text-sm leading-6 text-black'
            >
              ZIP code
            </label>
            <div className='mt-1 flex-1'>
              <InputNumber
                name={'postalCode'}
                id={'postalCode'}
                placeholder={''}
                value={formik.values.postalCode}
                isError={!!formik.errors.postalCode}
                // errorText={formik.errors.postalCode}
                onChange={handleNumberChange('postalCode')}
              />
            </div>
          </div>
          <div className={'flex w-full flex-col p-4 md:w-1/2'}>
            <label
              htmlFor='city'
              className='block flex-1 text-sm leading-6 text-black'
            >
              City
            </label>
            <div className='mt-1 flex-1'>
              <InputText
                type={'text'}
                name={'city'}
                id={'city'}
                placeholder={''}
                value={formik.values.city}
                // errorText={formik.errors.city}
                isError={!!formik.errors.city}
                onChange={handleInputChange('city')}
              />
            </div>
          </div>
          <div className={'flex w-full flex-col p-4 md:w-1/2'}>
            <label
              htmlFor='state'
              className='block flex-1 text-sm leading-6 text-black'
            >
              State
            </label>
            <div className='mt-1 flex-1'>
              <InputText
                type={'text'}
                name={'state'}
                id={'state'}
                placeholder={''}
                value={formik.values.state}
                // errorText={formik.errors.state}
                isError={!!formik.errors.state}
                onChange={handleInputChange('state')}
              />
            </div>
          </div>
          <div className={'flex w-full flex-col p-4 md:w-1/2'}>
            <label
              htmlFor='company'
              className='block flex-1 text-sm leading-6 text-black'
            >
              Company
            </label>
            <div className='mt-1 flex-1'>
              <InputText
                type={'text'}
                name={'company'}
                id={'company'}
                placeholder={''}
                value={formik.values.company}
                isError={!!formik.errors.company}
                // errorText={formik.errors.company}
                onChange={handleInputChange('company')}
              />
            </div>
          </div>

          {!!firstError && (
            <div className={'w-full px-4 pt-3 text-right text-sm text-red-600'}>
              {firstError}
            </div>
          )}

          <div className={'my-8 flex w-full flex-shrink-0 px-4 '}>
            <div
              className={
                'flex w-full flex-col space-y-2.5 rounded-lg border border-zinc-200 bg-zinc-100 p-4'
              }
            >
              <div className={'text-base leading-4 text-zinc-400'}>
                File:
                <span className={'ml-2 font-medium text-zinc-950'}>
                  {file.name.replace(file.extension, '')}
                </span>
              </div>
              <div className={'text-base leading-4 text-zinc-400'}>
                Price:
                <span className={'ml-2 font-medium text-zinc-950'}>
                  {formatPrice(file.price_in_cents)}
                </span>
              </div>
            </div>
          </div>

          <div className={'flex w-full flex-shrink-0 px-4'}>
            <PrimaryButton
              type={'submit'}
              buttonText={'Pay'}
              disabled={!isValid || submitting}
            />
          </div>
        </form>
      </div>
      <Alert
        open={successAlert}
        onClose={handleCloseSuccess}
        title={'Payment successful'}
        text={
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur odio diam. Nam facilisis sit amet velit'
        }
        button={'Go back to Catalog'}
        theme={'success'}
      />
      <Alert
        open={errorAlert}
        onClose={handleCloseError}
        title={'Payment failed'}
        text={
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur odio diam. Nam facilisis sit amet velit'
        }
        button={'Go back to File'}
        theme={'error'}
      />
    </div>
  );
};

export default BillingComponent;
