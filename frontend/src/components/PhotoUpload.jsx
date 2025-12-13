import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export const PhotoUpload = ({ orderId, type, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState([]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('order_id', orderId);
        formData.append('type', type); // 'before' or 'after'

        const response = await fetch(`${API_URL}/api/photos/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();
        if (data.success) {
          setPhotos(prev => [...prev, data.data]);
        }
      }

      toast({
        title: "✅ Fotos Enviadas!",
        description: `${files.length} foto(s) carregada(s)`
      });

      if (onUploadComplete) onUploadComplete();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar fotos",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (photoId) => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      await fetch(`${API_URL}/api/photos/${photoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setPhotos(prev => prev.filter(p => p.id !== photoId));
    } catch (error) {
      console.error('Error removing photo:', error);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-bold mb-3">Fotos {type === 'before' ? 'Antes' : 'Depois'}</h3>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        {photos.map((photo) => (
          <div key={photo.id} className="relative">
            <img src={photo.url} alt="" className="w-full h-24 object-cover rounded" />
            <button
              onClick={() => handleRemove(photo.id)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <label className="block">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <Button
          as="span"
          variant="outline"
          className="w-full cursor-pointer"
          disabled={uploading}
        >
          {uploading ? (
            <>Enviando...</>
          ) : (
            <>
              <Upload className="h-5 w-5 mr-2" />
              Adicionar Fotos
            </>
          )}
        </Button>
      </label>
    </Card>
  );
};
