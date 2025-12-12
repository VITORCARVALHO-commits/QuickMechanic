import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../contexts/AuthContext';
import { getMyQuotes, updateQuoteStatus, createPayment } from '../services/api';
import { toast } from '../hooks/use-toast';
import { 
  Car, Calendar, MapPin, Wrench, Clock, CheckCircle, 
  XCircle, DollarSign, Loader2, CreditCard, User, LogOut,
  FileText, TrendingUp, AlertCircle
} from 'lucide-react';

export const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(null);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const response = await getMyQuotes();
      if (response.success) {
        setQuotes(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quotes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (quote) => {
    try {
      const response = await updateQuoteStatus(quote.id, {
        status: 'accepted'
      });

      if (response.success) {
        toast({
          title: "Quote accepted!",
          description: "Proceeding to payment..."
        });
        
        // Navigate to payment
        handlePayment(quote);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept quote",
        variant: "destructive"
      });
    }
  };

  const handlePayment = async (quote) => {
    setProcessingPayment(quote.id);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await createPayment({
        quote_id: quote.id,
        amount: quote.final_price || quote.estimated_price,
        payment_method: 'mock'
      });

      if (response.success) {
        toast({
          title: "Payment successful!",
          description: "Your service has been booked"
        });
        loadQuotes(); // Reload quotes
      }
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error.detail || "Please try again",
        variant: "destructive"
      });
    } finally {
      setProcessingPayment(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Waiting for Quote', color: 'bg-yellow-100 text-yellow-800' },
      quoted: { label: 'Quote Received', color: 'bg-blue-100 text-blue-800' },
      accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800' },
      paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
      in_progress: { label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
      completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1EC6C6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1EC6C6] rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0E1A2C]">Client Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="h-10"
              >
                New Booking
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="h-10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        {quotes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Bookings"
              value={quotes.length}
              icon={FileText}
              color="bg-[#1EC6C6]"
            />
            <StatCard
              title="Pending Quotes"
              value={quotes.filter(q => q.status === 'pending').length}
              icon={Clock}
              color="bg-yellow-500"
            />
            <StatCard
              title="Active Jobs"
              value={quotes.filter(q => ['paid', 'in_progress'].includes(q.status)).length}
              icon={Wrench}
              color="bg-blue-500"
            />
            <StatCard
              title="Completed"
              value={quotes.filter(q => q.status === 'completed').length}
              icon={CheckCircle}
              color="bg-[#27AE60]"
            />
          </div>
        )}

        {quotes.length === 0 ? (
          <Card className="p-12 text-center">
            <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#0E1A2C] mb-2">No bookings yet</h2>
            <p className="text-gray-600 mb-6">Start by searching for your vehicle</p>
            <Button
              onClick={() => navigate('/')}
              className="bg-[#1EC6C6] hover:bg-[#1AB5B5]"
            >
              Get Started
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">My Bookings</h2>
            
            {quotes.map((quote) => (
              <Card key={quote.id} className="p-6 hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1EC6C6]/10 rounded-lg flex items-center justify-center">
                      <Car className="h-6 w-6 text-[#1EC6C6]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0E1A2C]">
                        {quote.make} {quote.model} ({quote.year})
                      </h3>
                      <p className="text-gray-600">{quote.plate}</p>
                    </div>
                  </div>
                  {getStatusBadge(quote.status)}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Wrench className="h-5 w-5 text-[#1EC6C6]" />
                    <span className="font-semibold">Service:</span>
                    <span>{quote.service.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-5 w-5 text-[#1EC6C6]" />
                    <span className="font-semibold">Location:</span>
                    <span>{quote.location}</span>
                  </div>
                  {quote.date && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-5 w-5 text-[#1EC6C6]" />
                      <span className="font-semibold">Date:</span>
                      <span>{quote.date} at {quote.time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="h-5 w-5 text-[#1EC6C6]" />
                    <span className="font-semibold">Created:</span>
                    <span>{new Date(quote.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {quote.description && (
                  <div className="bg-[#F5F7FA] rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700">{quote.description}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <div className="text-sm text-gray-600">
                      {quote.status === 'quoted' ? 'Final Quote' : 'Estimated Price'}
                    </div>
                    <div className="text-3xl font-bold text-[#1EC6C6]">
                      £{quote.final_price || quote.estimated_price || '---'}
                    </div>
                  </div>

                  {quote.status === 'quoted' && (
                    <Button
                      onClick={() => handleAcceptQuote(quote)}
                      disabled={processingPayment === quote.id}
                      className="bg-[#27AE60] hover:bg-[#229954] text-white"
                    >
                      {processingPayment === quote.id ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Accept & Pay
                        </>
                      )}
                    </Button>
                  )}

                  {quote.status === 'paid' && (
                    <div className="flex items-center gap-2 text-[#27AE60] font-semibold">
                      <CheckCircle className="h-5 w-5" />
                      Payment Complete
                    </div>
                  )}

                  {quote.status === 'pending' && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="h-5 w-5" />
                      Waiting for mechanic quote
                    </div>
                  )}

                  {/* Track Order Button */}
                  <Button
                    onClick={() => navigate(`/order/${quote.id}`)}
                    variant="outline"
                    className="border-[#1EC6C6] text-[#1EC6C6] hover:bg-[#1EC6C6]/10"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Track Order
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
