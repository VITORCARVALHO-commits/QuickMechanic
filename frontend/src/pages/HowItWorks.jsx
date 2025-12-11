import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Search, Calendar, Wrench, CreditCard, Shield, Clock, Award, CheckCircle } from 'lucide-react';

export const HowItWorks = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const steps = [
    {
      icon: Search,
      number: '01',
      title: 'Search Your Vehicle',
      description: 'Find your car instantly with UK registration',
      details: 'Enter your UK vehicle registration number and we\'ll automatically fetch all your car details from the DVLA database. No manual entry needed - we make it quick and easy!',
      color: 'from-[#1EC6C6] to-[#1AB5B5]'
    },
    {
      icon: Calendar,
      number: '02',
      title: 'Book & Pay £12 Deposit',
      description: 'Secure your booking with a small deposit',
      details: 'Choose your service, preferred date and location. Pay just £12 to confirm your booking - this will be deducted from your final bill. The deposit prevents fake bookings and guarantees serious enquiries.',
      color: 'from-[#FF9F1C] to-[#FF8C00]'
    },
    {
      icon: Wrench,
      number: '03',
      title: 'Get Quotes from Mechanics',
      description: 'Receive competitive quotes',
      details: 'Local mechanics will see your request and send you quotes with their final prices. Compare prices, ratings, and reviews. Choose the mechanic that best fits your needs and budget.',
      color: 'from-[#27AE60] to-[#229954]'
    },
    {
      icon: CreditCard,
      number: '04',
      title: 'Accept Quote & Get Service',
      description: 'Pay securely and get your car fixed',
      details: 'Accept the quote you like best and pay the remaining amount securely. The mechanic comes to your location or you visit their workshop. Only pay when you\'re 100% satisfied with the service!',
      color: 'from-[#2D9CDB] to-[#1976D2]'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: '12-Month Guarantee',
      description: 'Full warranty on all services and parts. Your safety is our top priority.'
    },
    {
      icon: Clock,
      title: 'Fast Response',
      description: 'Mechanics respond within 24 hours. Flexible scheduling to suit you.'
    },
    {
      icon: Award,
      title: 'Verified Professionals',
      description: 'All mechanics are verified, certified and rated by real customers.'
    },
    {
      icon: CheckCircle,
      title: 'Fair Pricing',
      description: 'No hidden fees. £12 deposit deducted from final bill. Transparent pricing.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#1EC6C6] to-[#1AB5B5] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">How QuickMechanic Works</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Car repairs made simple. Get competitive quotes from local mechanics in just 4 easy steps. Pay only £12 to secure your booking!
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center gap-12`}>
                {/* Visual */}
                <div className="flex-1">
                  <div className={`relative w-full h-80 bg-gradient-to-br ${step.color} rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden group`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                    <step.icon className="h-40 w-40 text-white relative z-10 transform group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-8 right-8 text-white/20 text-9xl font-bold">
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="inline-block mb-4">
                    <span className={`bg-gradient-to-r ${step.color} text-white px-6 py-2 rounded-full text-lg font-bold`}>
                      Step {step.number}
                    </span>
                  </div>
                  <h2 className="text-4xl font-bold text-[#0E1A2C] mb-4">{step.title}</h2>
                  <p className="text-xl text-gray-600 mb-4">{step.description}</p>
                  <p className="text-gray-700 leading-relaxed">{step.details}</p>
                  
                  {step.number === '02' && (
                    <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Why £12 deposit?</strong> It prevents fake bookings and ensures serious requests. This amount is fully deducted from your final bill!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0E1A2C] mb-4">Why Choose QuickMechanic?</h2>
            <p className="text-xl text-gray-600">Benefits that make the difference</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-b from-white to-[#F5F7FA] group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1EC6C6] to-[#1AB5B5] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#0E1A2C] mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Info */}
      <section className="py-16 bg-[#F5F7FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 bg-white shadow-xl">
            <h3 className="text-2xl font-bold text-[#0E1A2C] mb-6 text-center">How Our Pricing Works</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-[#1EC6C6] mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-[#0E1A2C]">£12 Pre-booking Deposit:</strong>
                  <p className="text-gray-600">Secures your booking and prevents fake requests. Fully deducted from your final bill.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-[#1EC6C6] mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-[#0E1A2C]">Competitive Quotes:</strong>
                  <p className="text-gray-600">Multiple mechanics compete for your job, ensuring you get the best price.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-[#1EC6C6] mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-[#0E1A2C]">Transparent Platform Fee:</strong>
                  <p className="text-gray-600">Small service fee (£5 + 10%) helps us maintain the platform and verify mechanics.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-[#1EC6C6] mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-[#0E1A2C]">No Hidden Charges:</strong>
                  <p className="text-gray-600">What you see is what you pay. No surprise fees or extra costs.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#1EC6C6] to-[#1AB5B5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get competitive quotes from local mechanics in minutes. Just £12 to secure your booking!
          </p>
          <Button 
            size="lg" 
            className="bg-white text-[#1EC6C6] hover:bg-gray-100 px-12 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate('/')}
          >
            Search Your Vehicle Now
          </Button>
        </div>
      </section>
    </div>
  );
};
