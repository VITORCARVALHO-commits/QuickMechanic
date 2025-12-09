// Mock database de placas brasileiras e UK para MVP
export const mockPlatesDatabase = {
  // === PLACAS BRASILEIRAS ===
  'ABC1234': {
    plate: 'ABC-1234',
    country: 'BR',
    make: 'volkswagen',
    makeName: 'Volkswagen',
    model: 'Gol',
    year: '2020',
    color: 'Prata',
    fuel: 'Flex',
    version: '1.6 MSI',
    category: 'Hatchback',
    power: '120cv'
  },
  'DEF5678': {
    plate: 'DEF-5678',
    make: 'fiat',
    makeName: 'Fiat',
    model: 'Argo',
    year: '2021',
    color: 'Branco',
    fuel: 'Flex',
    version: '1.0 Fire',
    category: 'Hatchback',
    power: '77cv'
  },
  'GHI9012': {
    plate: 'GHI-9012',
    make: 'chevrolet',
    makeName: 'Chevrolet',
    model: 'Onix',
    year: '2022',
    color: 'Vermelho',
    fuel: 'Flex',
    version: '1.0 Turbo',
    category: 'Hatchback',
    power: '116cv'
  },
  'JKL3456': {
    plate: 'JKL-3456',
    make: 'toyota',
    makeName: 'Toyota',
    model: 'Corolla',
    year: '2023',
    color: 'Preto',
    fuel: 'Híbrido',
    version: '2.0 XEi',
    category: 'Sedan',
    power: '177cv'
  },
  'MNO7890': {
    plate: 'MNO-7890',
    make: 'honda',
    makeName: 'Honda',
    model: 'Civic',
    year: '2021',
    color: 'Cinza',
    fuel: 'Flex',
    version: '2.0 EXL',
    category: 'Sedan',
    power: '155cv'
  },
  'PQR1234': {
    plate: 'PQR-1234',
    make: 'jeep',
    makeName: 'Jeep',
    model: 'Compass',
    year: '2022',
    color: 'Azul',
    fuel: 'Flex',
    version: '1.3 Turbo',
    category: 'SUV',
    power: '185cv'
  },
  'STU5678': {
    plate: 'STU-5678',
    make: 'ford',
    makeName: 'Ford',
    model: 'Ranger',
    year: '2020',
    color: 'Prata',
    fuel: 'Diesel',
    version: '3.2 XLT',
    category: 'Picape',
    power: '200cv'
  },
  'VWX9012': {
    plate: 'VWX-9012',
    make: 'nissan',
    makeName: 'Nissan',
    model: 'Kicks',
    year: '2023',
    color: 'Laranja',
    fuel: 'Flex',
    version: '1.6 S',
    category: 'SUV',
    power: '114cv'
  },
  'YZA3456': {
    plate: 'YZA-3456',
    make: 'hyundai',
    makeName: 'Hyundai',
    model: 'HB20',
    year: '2022',
    color: 'Branco',
    fuel: 'Flex',
    version: '1.0 Turbo',
    category: 'Hatchback',
    power: '120cv'
  },
  'BCD7890': {
    plate: 'BCD-7890',
    make: 'renault',
    makeName: 'Renault',
    model: 'Duster',
    year: '2021',
    color: 'Verde',
    fuel: 'Flex',
    version: '1.6 CVT',
    category: 'SUV',
    power: '120cv'
  },
  'EFG1111': {
    plate: 'EFG-1111',
    make: 'volkswagen',
    makeName: 'Volkswagen',
    model: 'T-Cross',
    year: '2023',
    color: 'Cinza',
    fuel: 'Flex',
    version: '1.4 TSI',
    category: 'SUV',
    power: '150cv'
  },
  'HIJ2222': {
    plate: 'HIJ-2222',
    make: 'fiat',
    makeName: 'Fiat',
    model: 'Toro',
    year: '2022',
    color: 'Preto',
    fuel: 'Diesel',
    version: '2.0 Turbo',
    category: 'Picape',
    power: '170cv'
  },
  'KLM3333': {
    plate: 'KLM-3333',
    make: 'chevrolet',
    makeName: 'Chevrolet',
    model: 'Tracker',
    year: '2023',
    color: 'Vermelho',
    fuel: 'Flex',
    version: '1.2 Turbo',
    category: 'SUV',
    power: '133cv'
  },
  'NOP4444': {
    plate: 'NOP-4444',
    make: 'toyota',
    makeName: 'Toyota',
    model: 'Hilux',
    year: '2022',
    color: 'Branco',
    fuel: 'Diesel',
    version: '2.8 SRX',
    category: 'Picape',
    power: '204cv'
  },
  'QRS5555': {
    plate: 'QRS-5555',
    make: 'honda',
    makeName: 'Honda',
    model: 'HR-V',
    year: '2023',
    color: 'Prata',
    fuel: 'Flex',
    version: '1.5 Turbo',
    category: 'SUV',
    power: '177cv'
  }
};

// Função para buscar placa (simula API)
export const searchPlate = (plateInput) => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      // Remove hífens e espaços, deixa só letras e números
      const cleanPlate = plateInput.replace(/[-\s]/g, '').toUpperCase();
      
      // Busca no banco mock
      const vehicleData = mockPlatesDatabase[cleanPlate];
      
      if (vehicleData) {
        resolve({
          success: true,
          data: vehicleData
        });
      } else {
        reject({
          success: false,
          message: 'Placa não encontrada em nossa base de dados.'
        });
      }
    }, 800); // Simula latência de API
  });
};

// Função para validar formato de placa brasileira
export const validatePlateFormat = (plate) => {
  // Aceita formatos: ABC1234, ABC-1234, ABC 1234
  const plateRegex = /^[A-Z]{3}[-\s]?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/i;
  return plateRegex.test(plate);
};
