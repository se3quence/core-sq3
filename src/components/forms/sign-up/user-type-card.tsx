'use client'

import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'

type UserTypeCardProps = {
  register: UseFormRegister<FieldValues>
  userType: 'owner' | 'student'
  setUserType: React.Dispatch<React.SetStateAction<'owner' | 'student'>>
  value: 'owner' | 'student'
  title: string
  text: string
}

const UserTypeCard = ({
  register,
  userType,
  setUserType,
  value,
  title,
  text,
}: UserTypeCardProps) => {
  const isSelected = userType === value

  return (
    <label
      className={`
        flex flex-col gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all
        ${isSelected ? 'border-[#4913ec] bg-[#4913ec]/5' : 'border-[#dedbe6] hover:border-[#4913ec]/50'}
      `}
    >
      <div className="flex items-center gap-3">
        <input
          type="radio"
          {...register('type')}
          value={value}
          checked={isSelected}
          onChange={(e) => setUserType(e.target.value as 'owner' | 'student')}
          className="w-4 h-4 text-[#4913ec] focus:ring-[#4913ec] focus:ring-2"
        />
        <span className="font-semibold text-[#131118]">{title}</span>
      </div>
      <p className="text-sm text-[#6b6189] ml-7">{text}</p>
    </label>
  )
}

export default UserTypeCard

