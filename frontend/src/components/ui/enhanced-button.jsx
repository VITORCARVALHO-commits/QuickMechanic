import React from 'react';
import { Button } from './button';
import { Loader2 } from 'lucide-react';

export const EnhancedButton = ({ 
  children, 
  loading = false, 
  icon: Icon, 
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  return (
    <Button 
      className={`btn-ripple transition-all ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Carregando...
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="h-5 w-5 mr-2" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="h-5 w-5 ml-2" />}
        </>
      )}
    </Button>
  );
};
