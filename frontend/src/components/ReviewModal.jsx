import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Star, Loader2, X } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export const ReviewModal = ({ order, mechanicName, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Avaliação necessária",
        description: "Por favor, selecione uma avaliação",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: order.id,
          mechanic_id: order.mechanic_id,
          rating: rating,
          comment: comment
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "✅ Avaliação Enviada!",
          description: "Obrigado pelo seu feedback"
        });
        onSuccess();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#0E1A2C]">Avaliar Serviço</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">Como foi o serviço do mecânico?</p>
          <p className="font-semibold text-lg">{mechanicName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-12 w-12 ${
                    star <= (hover || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
              Comentário (Opcional)
            </label>
            <Textarea
              placeholder="Conte-nos sobre sua experiência..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 bg-[#27AE60] hover:bg-[#229954]"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Enviando...</>
              ) : (
                <>Enviar Avaliação</>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
