// config/catalog.js - Configuración centralizada de productos, actividades y recompensas
module.exports = {
  // Productos para la página de acumulación
  products: [
    { 
      id: 1, 
      name: 'Urban Rider Tee', 
      price: 95, 
      points: 95, 
      image: 'compra1.png',
      description: 'Camiseta negra de algodón premium con logo inspirador de estilo motero y corte entallado para un look urbano.',
      category: 'clothing',
      isPremium: false
    },
    { 
      id: 2, 
      name: 'Denim Breeze Flare', 
      price: 110, 
      points: 110, 
      image: 'compra2.png',
      description: 'Pantalón vaquero de talle alto y pierna acampanada, lavado medio y costuras visibles para un estilo retro-contemporáneo.',
      category: 'clothing',
      isPremium: false
    },
    { 
      id: 3, 
      name: 'Vintage Tan Rider Jacket', 
      price: 150, 
      points: 150, 
      image: 'compra3.png',
      description: 'Chaqueta de piel auténtica color caramelo, diseño clásico con cremallera frontal y bolsillos laterales discretos.',
      category: 'clothing',
      isPremium: true,
      premiumTrigger: 'Vintage Tan Rider Jacket' // Palabra clave que triggerea el logro premium
    },
    { 
      id: 4, 
      name: 'Sunbeam Cable Knit Beanie', 
      price: 35, 
      points: 35, 
      image: 'compra4.png',
      description: 'Gorro de punto grueso con motivo de trenzas y pompones, en vibrante color amarillo mostaza para dar un toque de energía.',
      category: 'accessories',
      isPremium: false
    },
    { 
      id: 5, 
      name: 'SoftStack Trio Socks', 
      price: 45, 
      points: 45, 
      image: 'compra5.png',
      description: 'Pack de tres pares de calcetines de punto suave y elástico, en tonos rojo intenso, azul cielo y negro básico.',
      category: 'accessories',
      isPremium: false
    }
  ],

  // Actividades para ganar puntos
  activities: [
    { 
      id: 1, 
      name: 'Descargar la App de Hang-in-there', 
      points: 100, 
      image: 'actividad1.png',
      category: 'app'
    },
    { 
      id: 2, 
      name: 'Completar perfil', 
      points: 75, 
      image: 'actividad2.png',
      category: 'profile',
      challengeTrigger: 'profile_complete' // Qué challenge actualiza
    },
    { 
      id: 3, 
      name: 'Recomendar a un amigo', 
      points: 50, 
      image: 'actividad3.png',
      category: 'referral'
    },
    { 
      id: 4, 
      name: 'Compartir en Redes Sociales', 
      points: 60, 
      image: 'actividad4.png',
      category: 'social',
      challengeTrigger: 'social_share' // Qué challenge actualiza
    }
  ],

  // Recompensas para la página de redención
  rewards: [
    { 
      id: 1, 
      name: 'Cupón 10% descuento', 
      points: 100, 
      type: 'discount', 
      image: 'descuento1.png',
      codePrefix: 'HANG'
    },
    { 
      id: 2, 
      name: 'Cupón 20% descuento', 
      points: 200, 
      type: 'discount', 
      image: 'descuento2.png',
      codePrefix: 'HANG'
    },
    { 
      id: 3, 
      name: 'Acceso al lanzamiento de nuevas colecciones', 
      points: 500, 
      type: 'experience', 
      image: 'experiencia1.png',
      codePrefix: 'EXP'
    },
    { 
      id: 4, 
      name: 'Showroom con influencers', 
      points: 800, 
      type: 'experience', 
      image: 'experiencia2.png',
      codePrefix: 'EXP'
    }
  ],

  // Configuración de challenges/retos
  challenges: [
    {
      id: 'accessories_lover',
      name: 'Amor por los accesorios',
      description: 'Compra los dos accesorios disponibles (gorro y calcetines)',
      reward: 50,
      goal: 2,
      type: 'accessories',
      triggerCategory: 'accessories' // Se actualiza al comprar productos de esta categoría
    },
    {
      id: 'profile_complete',
      name: 'Perfil Avanzado',
      description: 'Completa toda la información de tu perfil (4 veces)',
      reward: 75,
      goal: 4,
      type: 'profile'
    },
    {
      id: 'social_share',
      name: 'Social ambassador',
      description: 'Comparte 3 productos en redes sociales',
      reward: 75,
      goal: 3,
      type: 'social'
    }
  ],

  // Configuración de logros
  achievements: [
    {
      id: 'welcome',
      name: 'Bienvenida',
      description: 'Te has unido al programa de lealtad', // Se sobrescribe con brand.messages.welcomeDescription
      points: 25,
      icon: 'star',
      category: 'general',
      hideWhenLocked: false,
      autoUnlock: true // Se desbloquea automáticamente al registrarse
    },
    {
      id: 'first_purchase',
      name: 'Primera Compra',
      description: 'Has realizado tu primera compra',
      points: 50,
      icon: 'shopping-bag',
      category: 'purchase',
      hideWhenLocked: false,
      hint: 'Realiza tu primera compra en la tienda',
      trigger: 'purchase' // Se desbloquea con cualquier compra
    },
    {
      id: 'premium_purchase',
      name: 'Compra Premium',
      description: 'Has comprado la Vintage Tan Rider Jacket',
      points: 150,
      icon: 'award',
      category: 'purchase',
      hideWhenLocked: false,
      hint: 'Compra la Vintage Tan Rider Jacket',
      trigger: 'premium_purchase' // Se desbloquea con compra premium específica
    },
    {
      id: 'first_redemption',
      name: 'Primer Canje',
      description: 'Has canjeado tus puntos por primera vez',
      points: 100,
      icon: 'gift',
      category: 'redemption',
      hideWhenLocked: false,
      hint: 'Canjea tus puntos por una recompensa',
      trigger: 'redemption' // Se desbloquea con cualquier canje
    },
    {
      id: 'challenge_accessories_lover',
      name: 'Amor por los accesorios',
      description: 'Completaste el reto de comprar accesorios',
      points: 30,
      icon: 'check-circle',
      category: 'challenge',
      hideWhenLocked: false,
      hint: 'Compra los dos accesorios disponibles (gorro y calcetines)',
      trigger: 'challenge_complete' // Se desbloquea al completar challenge
    },
    {
      id: 'challenge_profile_complete',
      name: 'Perfil Avanzado',
      description: 'Completaste el reto de perfil (4 veces)',
      points: 50,
      icon: 'user-check',
      category: 'challenge',
      hideWhenLocked: false,
      hint: 'Completa toda la información de tu perfil 4 veces',
      trigger: 'challenge_complete'
    },
    {
      id: 'challenge_social_share',
      name: 'Social ambassador',
      description: 'Completaste el reto de compartir en redes',
      points: 60,
      icon: 'share-alt',
      category: 'social',
      hideWhenLocked: false,
      hint: 'Comparte 3 productos en redes sociales',
      trigger: 'challenge_complete'
    },
    {
      id: 'tier_silver',
      name: 'Nivel Silver',
      description: 'Has alcanzado el nivel Silver',
      points: 100,
      icon: 'award',
      category: 'tier',
      hideWhenLocked: false,
      hint: 'Alcanza 500 puntos',
      trigger: 'tier_update',
      tierRequired: 'Silver'
    },
    {
      id: 'tier_gold',
      name: 'Nivel Gold',
      description: 'Has alcanzado el nivel Gold',
      points: 200,
      icon: 'award',
      category: 'tier',
      hideWhenLocked: false,
      hint: 'Alcanza 1000 puntos',
      trigger: 'tier_update',
      tierRequired: 'Gold'
    },
    {
      id: 'tier_platinum',
      name: 'Nivel Platinum',
      description: 'Has alcanzado el nivel Platinum',
      points: 300,
      icon: 'crown',
      category: 'tier',
      hideWhenLocked: false,
      hint: 'Alcanza 2000 puntos',
      trigger: 'tier_update',
      tierRequired: 'Platinum'
    }
  ]
};