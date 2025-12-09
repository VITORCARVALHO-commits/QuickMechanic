export const carMakes = [
  { id: 'volkswagen', name: 'Volkswagen', models: ['Gol', 'Polo', 'T-Cross', 'Nivus', 'Virtus', 'Saveiro'] },
  { id: 'fiat', name: 'Fiat', models: ['Argo', 'Mobi', 'Cronos', 'Toro', 'Strada', 'Pulse'] },
  { id: 'chevrolet', name: 'Chevrolet', models: ['Onix', 'Tracker', 'S10', 'Montana', 'Spin'] },
  { id: 'ford', name: 'Ford', models: ['Ka', 'Ranger', 'Territory', 'Maverick'] },
  { id: 'toyota', name: 'Toyota', models: ['Corolla', 'Hilux', 'SW4', 'Yaris', 'Camry'] },
  { id: 'honda', name: 'Honda', models: ['Civic', 'HR-V', 'City', 'WR-V', 'Accord'] },
  { id: 'nissan', name: 'Nissan', models: ['Kicks', 'Versa', 'Frontier', 'Sentra'] },
  { id: 'hyundai', name: 'Hyundai', models: ['HB20', 'Creta', 'Tucson', 'ix35'] },
  { id: 'jeep', name: 'Jeep', models: ['Renegade', 'Compass', 'Commander'] },
  { id: 'renault', name: 'Renault', models: ['Kwid', 'Sandero', 'Duster', 'Oroch'] }
];

export const serviceTypes = [
  { id: 'oil_change', name: { pt: 'Troca de Óleo', en: 'Oil Change' }, basePrice: 150 },
  { id: 'brakes', name: { pt: 'Sistema de Freios', en: 'Brake System' }, basePrice: 300 },
  { id: 'suspension', name: { pt: 'Suspensão', en: 'Suspension' }, basePrice: 450 },
  { id: 'diagnostic', name: { pt: 'Diagnóstico Completo', en: 'Full Diagnostic' }, basePrice: 200 },
  { id: 'maintenance', name: { pt: 'Revisão Preventiva', en: 'Preventive Maintenance' }, basePrice: 350 },
  { id: 'battery', name: { pt: 'Bateria', en: 'Battery' }, basePrice: 250 },
  { id: 'air_conditioning', name: { pt: 'Ar Condicionado', en: 'Air Conditioning' }, basePrice: 280 },
  { id: 'transmission', name: { pt: 'Transmissão', en: 'Transmission' }, basePrice: 800 },
  { id: 'engine', name: { pt: 'Motor', en: 'Engine' }, basePrice: 1200 },
  { id: 'electrical', name: { pt: 'Elétrica', en: 'Electrical' }, basePrice: 350 }
];

export const mockMechanics = [
  {
    id: '1',
    name: 'Carlos Silva',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    rating: 4.9,
    reviewCount: 127,
    specialties: ['oil_change', 'brakes', 'maintenance'],
    mobile: true,
    workshop: true,
    location: 'São Paulo, SP',
    yearsExperience: 12,
    certifications: ['ASE Certified', 'Bosch Trained'],
    about: 'Especialista em manutenção preventiva com mais de 12 anos de experiência.',
    reviews: [
      { id: 1, user: 'João Pedro', rating: 5, comment: 'Excelente profissional! Muito atencioso e rápido.', date: '2025-06-15' },
      { id: 2, user: 'Maria Santos', rating: 5, comment: 'Serviço impecável. Recomendo!', date: '2025-06-10' }
    ]
  },
  {
    id: '2',
    name: 'Roberto Oliveira',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    rating: 4.8,
    reviewCount: 95,
    specialties: ['engine', 'transmission', 'diagnostic'],
    mobile: false,
    workshop: true,
    location: 'Rio de Janeiro, RJ',
    yearsExperience: 15,
    certifications: ['Master Technician', 'Volkswagen Specialist'],
    about: 'Especializado em motores e diagnósticos complexos.',
    reviews: [
      { id: 1, user: 'Ana Costa', rating: 5, comment: 'Resolveu um problema que outros não conseguiram!', date: '2025-06-12' }
    ]
  },
  {
    id: '3',
    name: 'Fernando Santos',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    rating: 4.7,
    reviewCount: 83,
    specialties: ['brakes', 'suspension', 'electrical'],
    mobile: true,
    workshop: false,
    location: 'Belo Horizonte, MG',
    yearsExperience: 8,
    certifications: ['Brake Specialist', 'Mobile Service Expert'],
    about: 'Atendimento móvel rápido e eficiente em toda BH.',
    reviews: []
  },
  {
    id: '4',
    name: 'André Costa',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    rating: 4.9,
    reviewCount: 156,
    specialties: ['air_conditioning', 'electrical', 'diagnostic'],
    mobile: true,
    workshop: true,
    location: 'Curitiba, PR',
    yearsExperience: 10,
    certifications: ['AC Specialist', 'Electrical Systems Expert'],
    about: 'Especialista em ar condicionado e sistemas elétricos.',
    reviews: [
      { id: 1, user: 'Lucas Mendes', rating: 5, comment: 'Ar condicionado ficou perfeito!', date: '2025-06-08' },
      { id: 2, user: 'Paula Lima', rating: 5, comment: 'Muito profissional e pontual.', date: '2025-06-05' }
    ]
  },
  {
    id: '5',
    name: 'Marcos Pereira',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    rating: 4.6,
    reviewCount: 72,
    specialties: ['battery', 'oil_change', 'maintenance'],
    mobile: true,
    workshop: false,
    location: 'Porto Alegre, RS',
    yearsExperience: 6,
    certifications: ['Quick Service Certified'],
    about: 'Serviços rápidos e confiáveis no local.',
    reviews: []
  },
  {
    id: '6',
    name: 'Paulo Rodrigues',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
    rating: 4.8,
    reviewCount: 104,
    specialties: ['transmission', 'engine', 'suspension'],
    mobile: false,
    workshop: true,
    location: 'Brasília, DF',
    yearsExperience: 14,
    certifications: ['Transmission Specialist', 'Heavy Repair Expert'],
    about: 'Oficina completa para reparos complexos.',
    reviews: [
      { id: 1, user: 'Ricardo Alves', rating: 5, comment: 'Consertou minha transmissão perfeitamente!', date: '2025-06-07' }
    ]
  },
  {
    id: '7',
    name: 'Luiz Ferreira',
    photo: 'https://images.unsplash.com/photo-1502767089025-6572583495f9?w=400',
    rating: 4.7,
    reviewCount: 89,
    specialties: ['brakes', 'diagnostic', 'maintenance'],
    mobile: true,
    workshop: true,
    location: 'Salvador, BA',
    yearsExperience: 9,
    certifications: ['Safety Systems Expert'],
    about: 'Foco em segurança e manutenção preventiva.',
    reviews: []
  },
  {
    id: '8',
    name: 'José Almeida',
    photo: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca44?w=400',
    rating: 4.9,
    reviewCount: 142,
    specialties: ['oil_change', 'battery', 'air_conditioning'],
    mobile: true,
    workshop: false,
    location: 'Fortaleza, CE',
    yearsExperience: 11,
    certifications: ['Express Service Certified', 'AC Expert'],
    about: 'Atendimento express e de qualidade.',
    reviews: [
      { id: 1, user: 'Carla Souza', rating: 5, comment: 'Muito rápido e eficiente!', date: '2025-06-14' },
      { id: 2, user: 'Bruno Martins', rating: 5, comment: 'Excelente atendimento!', date: '2025-06-11' }
    ]
  }
];

export const mockBookings = [
  {
    id: 'B001',
    service: 'Troca de Óleo',
    mechanic: 'Carlos Silva',
    date: '2025-07-10',
    time: '14:00',
    status: 'confirmed',
    price: 180,
    car: 'Volkswagen Gol 2020'
  },
  {
    id: 'B002',
    service: 'Sistema de Freios',
    mechanic: 'Roberto Oliveira',
    date: '2025-07-05',
    time: '10:00',
    status: 'completed',
    price: 350,
    car: 'Fiat Argo 2021'
  }
];
