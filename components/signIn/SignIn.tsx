'use client'

import { signIn } from "next-auth/react";
import Button from "../ui/button";
import clsx from "clsx";
import { Field, Form, Formik } from 'formik'
import { TextInput } from "../ui/textInput";
import * as Yup from 'yup'
import { useTranslation } from "next-i18next";

interface ILogin{
  email:string;
  password:string;
}

export default function SignIn({ className, onRegister }: { className?: string, onRegister: ()=>void }) {
  const {t} = useTranslation('common')
  // const credentialsAction = (formData: FormData) => {
  //   signIn('credentials', { email, password });
  // }

  return <div className={clsx(className)}>
    <h1 className="mt-8 lg:mt-12 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
      {t("signIn-title")}
    </h1>
    <Formik<ILogin>
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={Yup.object({
        email: Yup.string()
          .email('Invalid email address')
          .required('Required'),
        password: Yup.string()
          .max(20, 'Must be 20 characters or less')
          .min(4, 'Must be 4 characters or more')
          .required('Required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        signIn('credentials', values as any);
        setSubmitting(false);
      }}
    >
      <Form className="flex flex-col mt-2">
        <Field
          component={TextInput}
          name='email'
          placeholder='example@email.com'
          label='Email'
          type='email'
        />
        <Field
          component={TextInput}
          name="password"
          placeholder="********"
          label='Password'
          type='password'
        />
        {/* <MyTextInput
          type="email"
          name="email"
          placeholder='example@email.com'
          label='Email'
        />
        <MyTextInput
          type="password"
          name="password"
          placeholder="********"
          label='Password'
        /> */}
        <div className='text-right'>
          <span onClick={() => { onRegister() }} className="mt-2 text-indigo-500 underline text-sm cursor-pointer h-min text-right">{t('dontHaveAccount')}</span>
        </div>
        <div className="mt-1 flex justify-between">
          <Button type="submit" disabled={false} >{t('confirm')}</Button>
          <div className="flex">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" display="inline-block" overflow="visible"
              className="ml-2 h-full cursor-pointer"
              onClick={() => signIn('github')}><path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"></path>
            </svg>
          </div>
        </div>
      </Form>
    </Formik>
  </div>
}

