import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

export const ErrorMessage = ({ title = 'Erro', message, onRetry }) => {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#0E1A2C] mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} className="bg-[#1EC6C6] hover:bg-[#1AB5B5]">
            Tentar Novamente
          </Button>
        )}
      </Card>
    </div>
  );
};
