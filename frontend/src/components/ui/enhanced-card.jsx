import React from 'react';
import { Card } from './card';

export const EnhancedCard = ({ children, className = '', hover = true, ...props }) => {
  return (
    <Card 
      className={`card-elevated fade-in ${hover ? 'hover-lift' : ''} ${className}`}
      {...props}
    >
      {children}
    </Card>
  );
};
