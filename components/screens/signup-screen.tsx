'use client'

import { useState } from 'react'
import type { UserData } from '@/lib/types'

interface SignupScreenProps {
  initialData: UserData
  onSubmit: (data: UserData) => void
}

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
  'France', 'Netherlands', 'Singapore', 'India', 'Brazil', 'Japan',
  'South Korea', 'Mexico', 'Spain', 'Italy', 'Sweden', 'Norway',
  'Denmark', 'Finland', 'Switzerland', 'Austria', 'Belgium', 'Ireland',
  'New Zealand', 'Portugal', 'Poland', 'Czech Republic', 'Other'
]

export function SignupScreen({ initialData, onSubmit }: SignupScreenProps) {
  const [formData, setFormData] = useState<UserData>(initialData)
  const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserData, string>> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'Required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Required'
    
    if (!formData.linkedIn.trim()) {
      newErrors.linkedIn = 'Required'
    } else if (!formData.linkedIn.includes('linkedin.com')) {
      newErrors.linkedIn = 'Must be a valid LinkedIn URL'
    }
    
    if (!formData.gmail.trim()) {
      newErrors.gmail = 'Required'
    } else if (!formData.gmail.includes('@gmail.com')) {
      newErrors.gmail = 'Must be a Gmail address'
    }
    
    if (!formData.phone.trim()) newErrors.phone = 'Required'
    if (!formData.nationality.trim()) newErrors.nationality = 'Required'
    if (!formData.residence.trim()) newErrors.residence = 'Required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-navy via-[#0d1e33] to-navy flex items-center justify-center p-4 overflow-y-auto">
      {/* Background wheel - blurred */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-xl pointer-events-none">
        <div className="w-96 h-96 rounded-full border-8 border-rope" />
      </div>

      {/* Parchment card */}
      <div className="relative w-full max-w-xl parchment rounded-lg p-8 shadow-2xl noise">
        <h2 className="font-serif text-3xl md:text-4xl text-navy text-center mb-2">
          Join the Crew
        </h2>
        <p className="font-mono text-rope text-center text-sm mb-8">
          Fill in your details to come aboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-mono text-xs text-rope uppercase tracking-wider mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={`w-full px-4 py-3 bg-navy/5 border-2 rounded-lg font-mono text-navy
                  focus:outline-none focus:border-gold transition-colors
                  ${errors.firstName ? 'border-red-500' : 'border-rope/30'}`}
                placeholder="Jack"
              />
              {errors.firstName && (
                <p className="text-red-600 text-xs mt-1 font-mono">{errors.firstName}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block font-mono text-xs text-rope uppercase tracking-wider mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={`w-full px-4 py-3 bg-navy/5 border-2 rounded-lg font-mono text-navy
                  focus:outline-none focus:border-gold transition-colors
                  ${errors.lastName ? 'border-red-500' : 'border-rope/30'}`}
                placeholder="Sparrow"
              />
              {errors.lastName && (
                <p className="text-red-600 text-xs mt-1 font-mono">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block font-mono text-xs text-rope uppercase tracking-wider mb-1">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={formData.linkedIn}
              onChange={(e) => handleChange('linkedIn', e.target.value)}
              className={`w-full px-4 py-3 bg-navy/5 border-2 rounded-lg font-mono text-navy
                focus:outline-none focus:border-gold transition-colors
                ${errors.linkedIn ? 'border-red-500' : 'border-rope/30'}`}
              placeholder="https://linkedin.com/in/yourprofile"
            />
            {errors.linkedIn && (
              <p className="text-red-600 text-xs mt-1 font-mono">{errors.linkedIn}</p>
            )}
          </div>

          {/* Gmail */}
          <div>
            <label className="block font-mono text-xs text-rope uppercase tracking-wider mb-1">
              Gmail Address
            </label>
            <input
              type="email"
              value={formData.gmail}
              onChange={(e) => handleChange('gmail', e.target.value)}
              className={`w-full px-4 py-3 bg-navy/5 border-2 rounded-lg font-mono text-navy
                focus:outline-none focus:border-gold transition-colors
                ${errors.gmail ? 'border-red-500' : 'border-rope/30'}`}
              placeholder="you@gmail.com"
            />
            {errors.gmail && (
              <p className="text-red-600 text-xs mt-1 font-mono">{errors.gmail}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block font-mono text-xs text-rope uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full px-4 py-3 bg-navy/5 border-2 rounded-lg font-mono text-navy
                focus:outline-none focus:border-gold transition-colors
                ${errors.phone ? 'border-red-500' : 'border-rope/30'}`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="text-red-600 text-xs mt-1 font-mono">{errors.phone}</p>
            )}
          </div>

          {/* Location row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-mono text-xs text-rope uppercase tracking-wider mb-1">
                Nationality
              </label>
              <select
                value={formData.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
                className={`w-full px-4 py-3 bg-navy/5 border-2 rounded-lg font-mono text-navy
                  focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer
                  ${errors.nationality ? 'border-red-500' : 'border-rope/30'}`}
              >
                <option value="">Select...</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {errors.nationality && (
                <p className="text-red-600 text-xs mt-1 font-mono">{errors.nationality}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block font-mono text-xs text-rope uppercase tracking-wider mb-1">
                Country of Residence
              </label>
              <select
                value={formData.residence}
                onChange={(e) => handleChange('residence', e.target.value)}
                className={`w-full px-4 py-3 bg-navy/5 border-2 rounded-lg font-mono text-navy
                  focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer
                  ${errors.residence ? 'border-red-500' : 'border-rope/30'}`}
              >
                <option value="">Select...</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {errors.residence && (
                <p className="text-red-600 text-xs mt-1 font-mono">{errors.residence}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-6 px-8 py-4 bg-navy text-gold font-mono font-bold text-lg rounded-lg 
              hover:bg-navy/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
              shadow-lg border-2 border-gold/30"
          >
            Set Sail &rarr;
          </button>
        </form>
      </div>
    </div>
  )
}
