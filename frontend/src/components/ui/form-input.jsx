import React, { useState } from 'react';
import { Input } from './input';
import { Eye, EyeOff, Check, X } from 'lucide-react';

export const FormInput = ({ 
  type = 'text',
  label,
  error,
  success,
  showValidation = false,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      {label && (
        <label className={`text-sm font-semibold transition-colors ${
          isFocused ? 'text-[#1EC6C6]' : 'text-[#0E1A2C] dark:text-gray-200'
        }`}>
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          type={inputType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`transition-all duration-200 ${
            error ? 'border-red-500 focus:ring-red-500' :
            success ? 'border-green-500 focus:ring-green-500' :
            'border-gray-300 dark:border-gray-600'
          } ${isPassword || showValidation ? 'pr-10' : ''}`}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
        
        {showValidation && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {error && <X className="h-5 w-5 text-red-500" />}
            {success && <Check className="h-5 w-5 text-green-500" />}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1">
          <X className="h-4 w-4" />
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-500 flex items-center gap-1 animate-in slide-in-from-top-1">
          <Check className="h-4 w-4" />
          {success}
        </p>
      )}
    </div>
  );
};
