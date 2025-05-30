// config/brand.js - Configuración centralizada de marca
module.exports = {
  // Información básica de la marca
  name: 'Hang-in-there',
  fullName: 'Hang-in-there Loyalty Club',
  
  // Mensajes y textos
  messages: {
    welcome: '¡Bienvenido a Hang-in-there Loyalty Club!',
    welcomeDescription: 'Gracias por unirte a Hang-in-there Loyalty Club',
    tagline: 'Demo de Salesforce Loyalty Management',
    joinClub: 'UNIRSE AL CLUB',
    benefits: {
      title: 'BENEFICIOS EXCLUSIVOS',
      list: [
        'Acumula puntos con cada compra',
        'Acceso a descuentos exclusivos', 
        'Desbloquea logros y sube de nivel',
        'Experiencias exclusivas especiales'
      ]
    },
    features: [
      {
        title: 'Gana recompensas',
        description: 'Acumula puntos con cada compra y canjéalos por descuentos exclusivos.'
      },
      {
        title: 'Consigue logros', 
        description: 'Desbloquea logros y comparte tus éxitos.'
      },
      {
        title: 'Sube de nivel',
        description: 'Progresa desde Bronze hasta Platinum con beneficios exclusivos.'
      }
    ]
  },
  
  // Paleta de colores - Alegre y elegante
  colors: {
    primary: '#2C5F51',        // Verde bosque elegante
    secondary: '#FF8A47',      // Naranja cálido vibrante
    accent: '#1A4742',         // Verde más oscuro para acentos
    lightGray: '#F7F5F3',      // Beige muy claro, cálido
    midGray: '#D4C5B0',        // Beige medio
    darkGray: '#8B7355',       // Marrón grisáceo cálido
    textColor: '#2C3E50',      // Azul oscuro elegante para texto
    textLight: '#7F8C8D',      // Gris azulado para texto secundario
    backgroundColor: '#FFFFFF',
    cardBackground: '#FFFFFF',
    borderColor: '#E8DDD4',    // Beige claro para bordes
    successColor: '#27AE60',   // Verde éxito
    errorColor: '#E74C3C',     // Rojo elegante
    notificationColor: '#FF8A47', // Naranja para notificaciones
    
    // Colores de tier - Inspirados en metales reales y naturales
    tierColors: {
      bronze: '#CD7F32',       // Bronce clásico
      silver: '#C0C0C0',       // Plata real
      gold: '#FFD700',         // Oro clásico
      platinum: '#E5E4E2'      // Platino elegante
    }
  },
  
  // Rutas de imágenes
  images: {
    logo: '/img/logo.png',
    background: '/img/background.png',
    favicon: '/img/favicon.ico'
  },
  
  // Categorías de productos/intereses para registro
  categories: [
    { id: 'clothing', label: 'Ropa casual' },
    { id: 'accessories', label: 'Accesorios' },
    { id: 'lifestyle', label: 'Estilo de vida' }
  ],
  
  // Copyright
  copyright: '2023-2025 Hang-in-there Loyalty Club'
};