// config/tiers.js - Configuración centralizada del sistema de niveles
module.exports = {
  // Definición de niveles/tiers
  tiers: [
    {
      name: 'Bronze',
      threshold: 0,
      displayName: 'Bronze',
      color: '#CD7F32',
      benefits: ['Puntos base en compras', 'Acceso a recompensas básicas']
    },
    {
      name: 'Silver', 
      threshold: 500,
      displayName: 'Silver',
      color: '#C0C0C0',
      benefits: ['Puntos base + 10% bonus', 'Acceso a recompensas premium', 'Envío gratis']
    },
    {
      name: 'Gold',
      threshold: 1000, 
      displayName: 'Gold',
      color: '#FFD700',
      benefits: ['Puntos base + 25% bonus', 'Acceso prioritario a ventas', 'Soporte premium']
    },
    {
      name: 'Platinum',
      threshold: 2000,
      displayName: 'Platinum', 
      color: '#E5E4E2',
      benefits: ['Puntos base + 50% bonus', 'Experiencias exclusivas', 'Personal shopper']
    }
  ],

  // Configuración de progreso
  maxPoints: 2000, // Puntos para el nivel máximo
  
  // Configuración para cálculo de progreso
  getProgressCalculation: (currentPoints, currentTier, nextTier) => {
    if (!nextTier) return 100;
    const pointsDifference = nextTier.threshold - currentTier.threshold;
    const pointsProgress = currentPoints - currentTier.threshold;
    return Math.round((pointsProgress / pointsDifference) * 100);
  },

  // Función para obtener tier actual basado en puntos
  getTierByPoints: function(points) {
    // Ordenar tiers por threshold descendente y encontrar el primero que califique
    const sortedTiers = [...this.tiers].sort((a, b) => b.threshold - a.threshold);
    return sortedTiers.find(tier => points >= tier.threshold) || this.tiers[0];
  },

  // Función para obtener el siguiente tier
  getNextTier: function(currentTierName) {
    const currentIndex = this.tiers.findIndex(tier => tier.name === currentTierName);
    return currentIndex < this.tiers.length - 1 ? this.tiers[currentIndex + 1] : null;
  },

  // Función para obtener tier por nombre
  getTierByName: function(tierName) {
    return this.tiers.find(tier => tier.name === tierName);
  }
};