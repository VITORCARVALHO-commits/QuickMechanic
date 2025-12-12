import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';
import { 
  Package, DollarSign, CheckCircle, Clock, 
  LogOut, User, Plus, Edit, Trash2, Search, TrendingUp
} from 'lucide-react';

export const AutoPartsDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('reservations');
  const [parts, setParts] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPart, setShowAddPart] = useState(false);
  const [pickupCode, setPickupCode] = useState('');
  const [newPart, setNewPart] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    car_make: '',
    car_model: '',
    service_type: '',
    part_number: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const [partsRes, reservationsRes] = await Promise.all([
        fetch(`${API_URL}/api/autoparts/parts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/autoparts/reservations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (partsRes.ok) {
        const partsData = await partsRes.json();
        setParts(partsData.data || []);
      }

      if (reservationsRes.ok) {
        const reservationsData = await reservationsRes.json();
        setReservations(reservationsData.data || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPart = async (e) => {
    e.preventDefault();
    
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/autoparts/parts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newPart,
          price: parseFloat(newPart.price),
          stock: parseInt(newPart.stock)
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Part added successfully"
        });
        setShowAddPart(false);
        setNewPart({
          name: '', description: '', price: '', stock: '',
          car_make: '', car_model: '', service_type: '', part_number: ''
        });
        loadData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add part",
        variant: "destructive"
      });
    }
  };

  const handleConfirmReservation = async (reservationId, confirm) => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/autoparts/confirm-reservation/${reservationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ confirm })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: confirm ? `Reservation confirmed! Code: ${data.data?.pickup_code}` : "Reservation refused"
        });
        loadData();
      } else {
        toast({
          title: "Error",
          description: data.detail || "Failed to process reservation",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process reservation",
        variant: "destructive"
      });
    }
  };

  const handleConfirmPickup = async () => {
    if (!pickupCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter pickup code",
        variant: "destructive"
      });
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/autoparts/confirm-pickup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pickup_code: pickupCode })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Pickup confirmed successfully"
        });
        setPickupCode('');
        loadData();
      } else {
        toast({
          title: "Error",
          description: data.detail || "Invalid pickup code",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm pickup",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-[#1EC6C6]">Loading...</div>
      </div>
    );
  }

  const totalRevenue = reservations
    .filter(r => r.status === 'RETIRADO')
    .reduce((sum, r) => sum + (r.part_info?.price || 0), 0);
  
  const pendingReservations = reservations.filter(r => r.status === 'PENDENTE_CONFIRMACAO').length;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0E1A2C] to-[#1EC6C6] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AutoParts Dashboard</h1>
                <p className="text-white/80">{user?.shop_name || user?.name}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Parts"
            value={parts.length}
            icon={Package}
            color="bg-blue-500"
          />
          <StatCard
            title="Pending Pickups"
            value={pendingReservations}
            icon={Clock}
            color="bg-yellow-500"
          />
          <StatCard
            title="Total Sales"
            value={reservations.filter(r => r.status === 'picked_up').length}
            icon={CheckCircle}
            color="bg-[#27AE60]"
          />
          <StatCard
            title="Revenue"
            value={`£${totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            color="bg-[#1EC6C6]"
            trend="up"
            trendValue="+15%"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white border-b mb-6 rounded-t-lg">
          <div className="flex gap-8 px-6">
            {[
              { id: 'reservations', label: 'Reservations', count: reservations.length },
              { id: 'catalog', label: 'Parts Catalog', count: parts.length },
              { id: 'confirm', label: 'Confirm Pickup' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#1EC6C6] text-[#1EC6C6] font-semibold'
                    : 'border-transparent text-gray-600 hover:text-[#1EC6C6]'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <Badge className="bg-[#1EC6C6]/10 text-[#1EC6C6]">{tab.count}</Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0E1A2C]">Part Reservations</h2>
            {reservations.length === 0 ? (
              <Card className="p-8 text-center">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No reservations yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {reservations.map((res) => (
                  <Card key={res.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#0E1A2C]">
                          {res.part_info?.name || 'Unknown Part'}
                        </h3>
                        <p className="text-gray-600">
                          For: {res.quote_info?.make} {res.quote_info?.model} - {res.quote_info?.service}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Mechanic: {res.mechanic_info?.name} • {res.mechanic_info?.phone}
                        </p>
                      </div>
                      <Badge className={
                        res.status === 'RETIRADO' ? 'bg-green-100 text-green-800' :
                        res.status === 'PRONTO_PARA_RETIRADA' ? 'bg-blue-100 text-blue-800' :
                        res.status === 'PENDENTE_CONFIRMACAO' ? 'bg-yellow-100 text-yellow-800' :
                        res.status === 'RECUSADO' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {res.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    
                    {res.status === 'PENDENTE_CONFIRMACAO' && (
                      <div className="flex gap-3 pt-4 border-t mb-4">
                        <Button
                          onClick={() => handleConfirmReservation(res.id, true)}
                          className="flex-1 bg-[#27AE60] hover:bg-[#229954] text-white"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Confirm Reservation
                        </Button>
                        <Button
                          onClick={() => handleConfirmReservation(res.id, false)}
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Refuse
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="text-sm text-gray-600">Pickup Code</div>
                        <div className="text-2xl font-bold text-[#1EC6C6] font-mono">
                          {res.pickup_code || 'Pending'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Price</div>
                        <div className="text-2xl font-bold text-[#0E1A2C]">
                          £{res.part_info?.price?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Catalog Tab */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#0E1A2C]">Parts Catalog</h2>
              <Button
                onClick={() => setShowAddPart(true)}
                className="bg-[#1EC6C6] hover:bg-[#1AB5B5]"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Part
              </Button>
            </div>

            {showAddPart && (
              <Card className="p-6">
                <h3 className="text-xl font-bold text-[#0E1A2C] mb-4">Add New Part</h3>
                <form onSubmit={handleAddPart} className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Part Name *</label>
                    <Input
                      value={newPart.name}
                      onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Part Number</label>
                    <Input
                      value={newPart.part_number}
                      onChange={(e) => setNewPart({ ...newPart, part_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Price (£) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newPart.price}
                      onChange={(e) => setNewPart({ ...newPart, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Stock *</label>
                    <Input
                      type="number"
                      value={newPart.stock}
                      onChange={(e) => setNewPart({ ...newPart, stock: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Car Make</label>
                    <Input
                      value={newPart.car_make}
                      onChange={(e) => setNewPart({ ...newPart, car_make: e.target.value })}
                      placeholder="e.g., Ford, BMW"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Car Model</label>
                    <Input
                      value={newPart.car_model}
                      onChange={(e) => setNewPart({ ...newPart, car_model: e.target.value })}
                      placeholder="e.g., Fiesta, 3 Series"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Service Type</label>
                    <Input
                      value={newPart.service_type}
                      onChange={(e) => setNewPart({ ...newPart, service_type: e.target.value })}
                      placeholder="e.g., oil_change, brakes"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Description</label>
                    <Input
                      value={newPart.description}
                      onChange={(e) => setNewPart({ ...newPart, description: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddPart(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#1EC6C6] hover:bg-[#1AB5B5]"
                    >
                      Add Part
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parts.map((part) => (
                <Card key={part.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-[#0E1A2C]">{part.name}</h4>
                    <Badge className={part.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {part.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                  {part.description && (
                    <p className="text-sm text-gray-600 mb-2">{part.description}</p>
                  )}
                  <div className="text-sm text-gray-500 space-y-1">
                    {part.car_make && <div>Make: {part.car_make}</div>}
                    {part.car_model && <div>Model: {part.car_model}</div>}
                    {part.part_number && <div>Part #: {part.part_number}</div>}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div>
                      <div className="text-sm text-gray-600">Price</div>
                      <div className="text-xl font-bold text-[#1EC6C6]">£{part.price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Stock</div>
                      <div className="text-xl font-bold text-[#0E1A2C]">{part.stock}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Confirm Pickup Tab */}
        {activeTab === 'confirm' && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#0E1A2C] mb-6 text-center">Confirm Part Pickup</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
                    Enter Pickup Code
                  </label>
                  <Input
                    value={pickupCode}
                    onChange={(e) => setPickupCode(e.target.value.toUpperCase())}
                    placeholder="QM-XXXXXX"
                    className="h-14 text-lg font-mono text-center"
                  />
                </div>
                <Button
                  onClick={handleConfirmPickup}
                  className="w-full h-12 bg-[#27AE60] hover:bg-[#229954] text-white font-semibold"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirm Pickup
                </Button>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Instructions:</strong> Ask the mechanic for their pickup code and enter it above to confirm that they&apos;ve collected the part.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
