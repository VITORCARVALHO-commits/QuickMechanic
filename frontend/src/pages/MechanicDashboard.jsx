import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { getMyQuotes, updateQuoteStatus } from '../services/api';
import { toast } from '../hooks/use-toast';
import { 
  Car, Calendar, MapPin, Wrench, Clock, CheckCircle, 
  DollarSign, Loader2, User, LogOut, Send
} from 'lucide-react';

export const MechanicDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingQuote, setSubmittingQuote] = useState(null);
  const [quotePrice, setQuotePrice] = useState({});

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

  const handleSubmitQuote = async (quoteId) => {
    const price = quotePrice[quoteId];
    
    if (!price || price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price",
        variant: "destructive"
      });
      return;
    }

    setSubmittingQuote(quoteId);

    try {
      const response = await updateQuoteStatus(quoteId, {
        status: 'quoted',
        final_price: parseFloat(price)
      });

      if (response.success) {
        toast({
          title: "Quote submitted!",
          description: "Client will be notified"
        });
        loadQuotes();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quote",
        variant: "destructive"
      });
    } finally {
      setSubmittingQuote(null);
    }
  };

  const handleUpdateStatus = async (quoteId, newStatus) => {
    try {
      const response = await updateQuoteStatus(quoteId, {
        status: newStatus
      });

      if (response.success) {
        toast({
          title: "Status updated!",
          description: `Job marked as ${newStatus}`
        });
        loadQuotes();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'New Request', color: 'bg-yellow-100 text-yellow-800' },
      quoted: { label: 'Quote Sent', color: 'bg-blue-100 text-blue-800' },
      accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800' },
      paid: { label: 'Paid - Ready to Start', color: 'bg-green-100 text-green-800' },
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

  // Separate quotes into categories
  const pendingQuotes = quotes.filter(q => q.status === 'pending');
  const myActiveJobs = quotes.filter(q => 
    q.mechanic_id === user?.id && ['quoted', 'accepted', 'paid', 'in_progress'].includes(q.status)
  );
  const myCompletedJobs = quotes.filter(q => 
    q.mechanic_id === user?.id && q.status === 'completed'
  );

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
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0E1A2C]">Mechanic Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Pending Requests */}
        <div>
          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">
            New Requests ({pendingQuotes.length})
          </h2>
          
          {pendingQuotes.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No new requests at the moment</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingQuotes.map((quote) => (
                <Card key={quote.id} className="p-6 border-2 border-yellow-200 bg-yellow-50/30">
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
                        <span className="font-semibold">Requested Date:</span>
                        <span>{quote.date} at {quote.time}</span>
                      </div>
                    )}
                  </div>

                  {quote.description && (
                    <div className="bg-white rounded-lg p-3 mb-4 border">
                      <p className="text-sm text-gray-700"><strong>Notes:</strong> {quote.description}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
                        Your Quote (£)
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter price..."
                        value={quotePrice[quote.id] || ''}
                        onChange={(e) => setQuotePrice({ ...quotePrice, [quote.id]: e.target.value })}
                        className="h-10"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <Button
                      onClick={() => handleSubmitQuote(quote.id)}
                      disabled={submittingQuote === quote.id || !quotePrice[quote.id]}
                      className="bg-[#1EC6C6] hover:bg-[#1AB5B5] text-white mt-6"
                    >
                      {submittingQuote === quote.id ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Submit Quote
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* My Active Jobs */}
        <div>
          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">
            My Active Jobs ({myActiveJobs.length})
          </h2>
          
          {myActiveJobs.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No active jobs</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {myActiveJobs.map((quote) => (
                <Card key={quote.id} className="p-6">
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

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Wrench className="h-5 w-5 text-[#1EC6C6]" />
                      <span>{quote.service.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-5 w-5 text-[#1EC6C6]" />
                      <span>{quote.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <DollarSign className="h-5 w-5 text-[#1EC6C6]" />
                      <span className="font-bold">£{quote.final_price}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    {quote.status === 'paid' && (
                      <Button
                        onClick={() => handleUpdateStatus(quote.id, 'in_progress')}
                        className="bg-[#1EC6C6] hover:bg-[#1AB5B5]"
                      >
                        Start Job
                      </Button>
                    )}
                    {quote.status === 'in_progress' && (
                      <Button
                        onClick={() => handleUpdateStatus(quote.id, 'completed')}
                        className="bg-[#27AE60] hover:bg-[#229954]"
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Mark as Complete
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Completed Jobs */}
        {myCompletedJobs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">
              Completed Jobs ({myCompletedJobs.length})
            </h2>
            <div className="space-y-4">
              {myCompletedJobs.slice(0, 5).map((quote) => (
                <Card key={quote.id} className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#0E1A2C]">
                        {quote.make} {quote.model} - {quote.service.replace('_', ' ').toUpperCase()}
                      </h4>
                      <p className="text-sm text-gray-600">{quote.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#27AE60]">£{quote.final_price}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(quote.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
