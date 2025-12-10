import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Calendar, Clock, MapPin, Wrench, Star, TrendingUp, 
  FileText, CheckCircle, XCircle, AlertCircle 
} from 'lucide-react';
import { mockBookings } from '../utils/mockData';

export const Dashboard = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('bookings');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-[#27AE60]" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-[#1EC6C6]" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-[#E84141]" />;
      default:
        return <AlertCircle className="h-5 w-5 text-[#FF9F1C]" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-[#27AE60]/10 text-[#27AE60] border-[#27AE60]/20';
      case 'completed':
        return 'bg-[#1EC6C6]/10 text-[#1EC6C6] border-[#1EC6C6]/20';
      case 'cancelled':
        return 'bg-[#E84141]/10 text-[#E84141] border-[#E84141]/20';
      default:
        return 'bg-[#FF9F1C]/10 text-[#FF9F1C] border-[#FF9F1C]/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0E1A2C] mb-2">{t('dashboard.client.title')}</h1>
          <p className="text-gray-600">Gerencie suas solicitações e histórico</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-[#1EC6C6] to-[#1AB5B5] text-white border-0">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-8 w-8" />
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-3xl font-bold mb-1">2</div>
            <div className="text-white/90 text-sm">Agendamentos Ativos</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#27AE60] to-[#229954] text-white border-0">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div className="text-3xl font-bold mb-1">8</div>
            <div className="text-white/90 text-sm">Serviços Concluídos</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#FF9F1C] to-[#FF8C00] text-white border-0">
            <div className="flex items-center justify-between mb-2">
              <Star className="h-8 w-8" />
            </div>
            <div className="text-3xl font-bold mb-1">4.9</div>
            <div className="text-white/90 text-sm">Sua Avaliação</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#2D9CDB] to-[#1976D2] text-white border-0">
            <div className="flex items-center justify-between mb-2">
              <Wrench className="h-8 w-8" />
            </div>
            <div className="text-3xl font-bold mb-1">R$ 2.4k</div>
            <div className="text-white/90 text-sm">Total Investido</div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="bookings">
              <Calendar className="h-4 w-4 mr-2" />
              {t('dashboard.client.bookings')}
            </TabsTrigger>
            <TabsTrigger value="history">
              <FileText className="h-4 w-4 mr-2" />
              {t('dashboard.client.history')}
            </TabsTrigger>
            <TabsTrigger value="profile">
              Perfil
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="space-y-4">
              {mockBookings.map(booking => (
                <Card key={booking.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-[#0E1A2C]">{booking.service}</h3>
                        <Badge className={`border ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1">{t(`common.${booking.status}`)}</span>
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4" />
                          <span>Mecânico: <strong>{booking.mechanic}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(booking.date).toLocaleDateString('pt-BR')}</span>
                          <Clock className="h-4 w-4 ml-4" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.car}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#1EC6C6]">£{booking.price}</div>
                        <div className="text-sm text-gray-600">ID: {booking.id}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Ver Detalhes</Button>
                        {booking.status === 'confirmed' && (
                          <Button variant="outline" size="sm" className="text-[#E84141] border-[#E84141]">
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="p-8 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0E1A2C] mb-2">Histórico de Serviços</h3>
              <p className="text-gray-600">Todos os seus serviços concluídos aparecerão aqui.</p>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-[#0E1A2C] mb-6">Informações Pessoais</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Nome Completo</label>
                  <div className="mt-1 p-3 bg-[#F5F7FA] rounded-lg">João da Silva</div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <div className="mt-1 p-3 bg-[#F5F7FA] rounded-lg">joao@example.com</div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Telefone</label>
                  <div className="mt-1 p-3 bg-[#F5F7FA] rounded-lg">+55 11 99999-9999</div>
                </div>
                <Button className="bg-[#1EC6C6] hover:bg-[#1AB5B5] text-white">
                  Editar Perfil
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
