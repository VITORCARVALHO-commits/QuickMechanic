import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../contexts/AuthContext';
import { getMyQuotes, updateQuoteStatus } from '../services/api';
import { toast } from '../hooks/use-toast';
import { 
  Car, Calendar, MapPin, Wrench, Clock, CheckCircle, 
  DollarSign, Loader2, User, LogOut, Send, FileText, TrendingUp
} from 'lucide-react';

export const MechanicDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingQuote, setSubmittingQuote] = useState(null);
  const [quotePrice, setQuotePrice] = useState({});
  const [travelFee, setTravelFee] = useState({});
  const [wallet, setWallet] = useState(null);
  const [showPartsModal, setShowPartsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [availableParts, setAvailableParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);

  useEffect(() => {
    loadQuotes();
    loadWallet();
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

  const loadWallet = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/wallet/balance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setWallet(data.data);
      }
    } catch (error) {
      console.error('Failed to load wallet:', error);
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
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/orders/${quoteId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          labor_price: parseFloat(price)
        })
      });

      if (response.ok) {
        toast({
          title: "Order accepted!",
          description: "Order status updated"
        });
        loadQuotes();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept order",
        variant: "destructive"
      });
    } finally {
      setSubmittingQuote(null);
    }
  };

  const handleSelectParts = async (order) => {
    setSelectedOrder(order);
    
    // Fetch available parts based on service
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_URL}/api/parts/search?service_type=${order.service}&car_make=${order.make}&car_model=${order.model}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const data = await response.json();
      if (data.success) {
        setAvailableParts(data.data);
        setShowPartsModal(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load parts",
        variant: "destructive"
      });
    }
  };

  const handleReservePart = async () => {
    if (!selectedPart) {
      toast({
        title: "Error",
        description: "Please select a part",
        variant: "destructive"
      });
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/parts/prereserve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          part_id: selectedPart.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Part reservation request sent to AutoPeça"
        });
        setShowPartsModal(false);
        setSelectedPart(null);
        loadQuotes();
      } else {
        toast({
          title: "Error",
          description: data.detail || "Failed to reserve part",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reserve part",
        variant: "destructive"
      });
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
  const pendingQuotes = quotes.filter(q => q.status === 'pending' || q.status === 'AGUARDANDO_MECANICO');
  const myActiveJobs = quotes.filter(q => 
    q.mechanic_id === user?.id && ['quoted', 'accepted', 'paid', 'in_progress', 'ACEITO', 'PECA_CONFIRMADA', 'SERVICO_EM_ANDAMENTO'].includes(q.status)
  );
  const myCompletedJobs = quotes.filter(q => 
    q.mechanic_id === user?.id && (q.status === 'completed' || q.status === 'SERVICO_FINALIZADO')
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
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="New Requests"
            value={pendingQuotes.length}
            icon={FileText}
            color="bg-yellow-500"
          />
          <StatCard
            title="Active Jobs"
            value={myActiveJobs.length}
            icon={Wrench}
            color="bg-blue-500"
          />
          <StatCard
            title="Completed"
            value={myCompletedJobs.length}
            icon={CheckCircle}
            color="bg-[#27AE60]"
          />
          <StatCard
            title="Total Earnings"
            value={`£${myCompletedJobs.reduce((sum, q) => sum + (q.final_price || 0), 0).toFixed(2)}`}
            icon={DollarSign}
            color="bg-[#1EC6C6]"
            trend="up"
            trendValue="+12%"
          />
        </div>

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
                <Card key={quote.id} className="p-6 border-2 border-yellow-200 bg-yellow-50/30 hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-left-4">
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
                        Labor Price (£)
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter labor price..."
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
                          Accept Order
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
                <Card key={quote.id} className="p-6 hover:shadow-xl transition-all duration-300 animate-in fade-in">
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
                    {quote.status === 'ACEITO' && !quote.has_parts && (
                      <Button
                        onClick={() => handleSelectParts(quote)}
                        className="bg-[#1EC6C6] hover:bg-[#1AB5B5]"
                      >
                        <Wrench className="h-5 w-5 mr-2" />
                        Select Parts from AutoPeça
                      </Button>
                    )}
                    {(quote.status === 'PECA_CONFIRMADA' || quote.status === 'PECA_RETIRADA') && quote.pickup_code && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Pickup Code</div>
                        <div className="text-2xl font-bold text-[#1EC6C6] font-mono">{quote.pickup_code}</div>
                        <div className="text-xs text-gray-500 mt-1">Show this to AutoPeça</div>
                      </div>
                    )}
                    {quote.status === 'paid' && (
                      <Button
                        onClick={() => handleUpdateStatus(quote.id, 'in_progress')}
                        className="bg-[#1EC6C6] hover:bg-[#1AB5B5]"
                      >
                        Start Job
                      </Button>
                    )}
                    {(quote.status === 'in_progress' || quote.status === 'SERVICO_EM_ANDAMENTO') && (
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

      {/* Parts Selection Modal */}
      {showPartsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full p-6 bg-white max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0E1A2C]">Select Part from AutoPeça</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPartsModal(false)}
              >
                Close
              </Button>
            </div>

            {availableParts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No parts available for this service</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableParts.map((part) => (
                  <div
                    key={part.id}
                    onClick={() => setSelectedPart(part)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPart?.id === part.id
                        ? 'border-[#1EC6C6] bg-[#1EC6C6]/10'
                        : 'border-gray-200 hover:border-[#1EC6C6]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#0E1A2C]">{part.name}</h3>
                        {part.description && (
                          <p className="text-sm text-gray-600 mt-1">{part.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          {part.part_number && <span>Part #: {part.part_number}</span>}
                          {part.stock && <span>Stock: {part.stock}</span>}
                        </div>
                        {part.shop_info && (
                          <div className="mt-2 text-sm">
                            <span className="font-semibold text-gray-700">Shop: </span>
                            <span className="text-gray-600">{part.shop_info.shop_name}</span>
                            {part.shop_info.shop_address && (
                              <span className="text-gray-500"> • {part.shop_info.shop_address}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-[#1EC6C6]">£{part.price.toFixed(2)}</div>
                        {selectedPart?.id === part.id && (
                          <CheckCircle className="h-6 w-6 text-[#1EC6C6] mt-2" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedPart && (
              <Button
                onClick={handleReservePart}
                className="w-full mt-6 h-12 bg-[#1EC6C6] hover:bg-[#1AB5B5]"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Reserve This Part
              </Button>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
