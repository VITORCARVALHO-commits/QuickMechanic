import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { StatCard } from '../components/StatCard';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';
import { 
  Users, Wrench, FileText, DollarSign, Shield, 
  LogOut, Search, CheckCircle, XCircle, Clock,
  TrendingUp, Eye, Edit, Trash2, UserCheck
} from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      // Fetch all data
      const [usersRes, quotesRes, paymentsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/quotes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/admin/payments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.data || []);
      }

      if (quotesRes.ok) {
        const quotesData = await quotesRes.json();
        setQuotes(quotesData.data || []);
      }

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData.data || []);
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`
        });
        loadData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-[#1EC6C6]">Loading admin panel...</div>
      </div>
    );
  }

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const clientCount = users.filter(u => u.user_type === 'client').length;
  const mechanicCount = users.filter(u => u.user_type === 'mechanic').length;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0E1A2C] to-[#1EC6C6] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-white/80">Welcome back, {user?.name}</p>
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

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'quotes', label: 'Quotes', icon: FileText },
              { id: 'payments', label: 'Payments', icon: DollarSign }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#1EC6C6] text-[#1EC6C6] font-semibold'
                      : 'border-transparent text-gray-600 hover:text-[#1EC6C6]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={users.length}
                icon={Users}
                color="bg-blue-500"
                trend="up"
                trendValue="+12%"
              />
              <StatCard
                title="Mechanics"
                value={mechanicCount}
                icon={Wrench}
                color="bg-[#1EC6C6]"
              />
              <StatCard
                title="Total Quotes"
                value={quotes.length}
                icon={FileText}
                color="bg-yellow-500"
              />
              <StatCard
                title="Revenue"
                value={`£${totalRevenue.toFixed(2)}`}
                icon={DollarSign}
                color="bg-[#27AE60]"
                trend="up"
                trendValue="+24%"
              />
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0E1A2C] mb-4">Recent Quotes</h3>
              <div className="space-y-3">
                {quotes.slice(0, 5).map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-4 bg-[#F5F7FA] rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#1EC6C6]/10 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-[#1EC6C6]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#0E1A2C]">
                          {quote.make} {quote.model} - {quote.service}
                        </div>
                        <div className="text-sm text-gray-600">{quote.location}</div>
                      </div>
                    </div>
                    <Badge className={
                      quote.status === 'completed' ? 'bg-green-100 text-green-800' :
                      quote.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {quote.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#0E1A2C]">User Management</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F5F7FA]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users
                    .filter(u => 
                      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      u.email.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((user) => (
                    <tr key={user.id} className="hover:bg-[#F5F7FA] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#1EC6C6]/10 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-[#1EC6C6]" />
                          </div>
                          <div className="font-semibold text-[#0E1A2C]">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={
                          user.user_type === 'mechanic' ? 'bg-blue-100 text-blue-800' :
                          user.user_type === 'admin' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {user.user_type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        {user.is_active ? (
                          <span className="flex items-center gap-1 text-[#27AE60] text-sm font-semibold">
                            <CheckCircle className="h-4 w-4" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-400 text-sm font-semibold">
                            <XCircle className="h-4 w-4" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                          variant="outline"
                          size="sm"
                          className="mr-2"
                        >
                          {user.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* Quotes Tab */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#0E1A2C]">All Quotes</h2>
            <div className="grid gap-4">
              {quotes.map((quote) => (
                <Card key={quote.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-[#0E1A2C]">
                          {quote.make} {quote.model} ({quote.year})
                        </h3>
                        <Badge>{quote.status}</Badge>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Service:</span>
                          <span className="ml-2 font-semibold">{quote.service}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <span className="ml-2 font-semibold">{quote.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Price:</span>
                          <span className="ml-2 font-semibold text-[#1EC6C6]">
                            £{quote.final_price || quote.estimated_price || 'TBD'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#0E1A2C]">Payment History</h2>
              <div className="text-2xl font-bold text-[#27AE60]">
                Total: £{totalRevenue.toFixed(2)}
              </div>
            </div>
            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F5F7FA]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Payment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quote ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-[#F5F7FA]">
                      <td className="px-6 py-4 font-mono text-sm">{payment.id.slice(0, 8)}...</td>
                      <td className="px-6 py-4 font-mono text-sm">{payment.quote_id.slice(0, 8)}...</td>
                      <td className="px-6 py-4 font-bold text-[#27AE60]">£{payment.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{payment.payment_method}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-green-100 text-green-800">{payment.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
