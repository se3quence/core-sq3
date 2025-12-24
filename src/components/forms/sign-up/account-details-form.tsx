'use client'

import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'

type AccountDetailsFormProps = {
  register: UseFormRegister<any>
  errors: FieldErrors<any>
}

const AccountDetailsForm = ({ register, errors }: AccountDetailsFormProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          {...register('fullname')}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.fullname && (
          <p className="text-red-500 text-xs mt-1">{errors.fullname.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Confirm Email</label>
        <input
          type="email"
          {...register('confirmEmail')}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.confirmEmail && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmEmail.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          {...register('password')}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Confirm Password</label>
        <input
          type="password"
          {...register('confirmPassword')}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message as string}</p>
        )}
      </div>
    </div>
  )
}

export default AccountDetailsForm

