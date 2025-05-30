// config/index.js - Configuración maestra que exporta toda la configuración centralizada
const brandConfig = require('./brand');
const catalogConfig = require('./catalog');
const tiersConfig = require('./tiers');

module.exports = {
  brand: brandConfig,
  catalog: catalogConfig,
  tiers: tiersConfig,
  
  // Configuraciones del sistema
  system: {
    initialBalance: 250, // Saldo inicial para nuevos miembros
    maxAchievements: 10, // Número máximo de logros para scoring
    sessionDuration: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
    
    // Configuración de scoring para leaderboard
    scoring: {
      weights: {
        achievements: 0.40,  // 40% - Logros desbloqueados
        levelPoints:  0.25,  // 25% - Puntos de nivel
        rewardPoints: 0.15,  // 15% - Puntos de rewards
        tier:         0.15,  // 15% - Nivel alcanzado
        balance:      0.05   // 5%  - Saldo restante
      },
      maxLevelPoints: 2000, // Puntos de referencia para el máximo
      engagementLevels: {
        90: 'Experto',
        75: 'Entusiasta', 
        60: 'Comprometido',
        40: 'Activo',
        20: 'Casual',
        0: 'Principiante'
      }
    }
  },

  // Función de utilidad para validar configuración
  validate: function() {
    const errors = [];
    
    // Validar que todos los productos tengan imágenes
    catalogConfig.products.forEach(product => {
      if (!product.image) {
        errors.push(`Producto ${product.name} no tiene imagen definida`);
      }
    });
    
    // Validar que todos los tiers tengan colores en brand
    tiersConfig.tiers.forEach(tier => {
      const colorKey = tier.name.toLowerCase() + 'Color';
      if (!brandConfig.colors.tierColors[tier.name.toLowerCase()]) {
        errors.push(`Tier ${tier.name} no tiene color definido en brand.colors.tierColors`);
      }
    });
    
    // Validar que exista logro de bienvenida
    const welcomeAchievement = catalogConfig.achievements.find(a => a.autoUnlock);
    if (!welcomeAchievement) {
      errors.push('No se encontró logro de bienvenida con autoUnlock: true');
    }
    
    return errors;
  }
};