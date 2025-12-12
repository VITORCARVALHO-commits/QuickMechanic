import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';
import { Loader2, UserPlus, Mail, Lock, User, Phone, Wrench, Users } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    user_type: 'client'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      
      if (result.success) {
        toast({
          title: "Account created!",
          description: `Welcome to QuickMechanic, ${result.user.name}!`,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Registration failed",
          description: result.message || "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.detail || "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1EC6C6] rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#0E1A2C] mb-2">Create Account</h1>
          <p className="text-gray-600">Join QuickMechanic today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Type Selection */}
          <div>
            <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">I am a...</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, user_type: 'client' })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.user_type === 'client'
                    ? 'border-[#1EC6C6] bg-[#1EC6C6]/5'
                    : 'border-gray-200 hover:border-[#1EC6C6]/50'
                }`}
              >
                <Users className="h-6 w-6 text-[#1EC6C6] mx-auto mb-1" />
                <div className="font-semibold text-sm">Client</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, user_type: 'mechanic' })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.user_type === 'mechanic'
                    ? 'border-[#1EC6C6] bg-[#1EC6C6]/5'
                    : 'border-gray-200 hover:border-[#1EC6C6]/50'
                }`}
              >
                <Wrench className="h-6 w-6 text-[#1EC6C6] mx-auto mb-1" />
                <div className="font-semibold text-sm">Mechanic</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, user_type: 'autoparts' })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.user_type === 'autoparts'
                    ? 'border-[#1EC6C6] bg-[#1EC6C6]/5'
                    : 'border-gray-200 hover:border-[#1EC6C6]/50'
                }`}
              >
                <svg className="h-6 w-6 text-[#1EC6C6] mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <div className="font-semibold text-sm">AutoParts</div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Phone (Optional)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="tel"
                placeholder="+44 7XXX XXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="pl-10 h-12"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#1EC6C6] hover:bg-[#1AB5B5] text-white font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1EC6C6] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-[#1EC6C6]">
            ← Back to Home
          </Link>
        </div>
      </Card>
    </div>
  );
};
