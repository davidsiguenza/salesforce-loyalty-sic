// Almacenamiento en memoria para la demo
const members = [];
let currentId = 1;

// Importar configuraciones centralizadas
const brandConfig = require('../config/brand');
const catalogConfig = require('../config/catalog');
const tiersConfig = require('../config/tiers');

class Member {
  constructor(name, email, preferences = []) {
    this.id = currentId++;
    this.name = name;
    this.email = email;
    this.preferences = preferences;
    this.balance = 250; // Mantenemos el balance para funcionalidades futuras
    this.points = 0; // Solo puntos (equivalente a levelPoints)
    this.tier = tiersConfig.tiers[0].name; // Primer tier por defecto
    this.achievements = []; // Logros desbloqueados
    this.vouchers = []; // Nuevos vouchers
    this.promotions = []; // Nuevas promociones
    this.createdAt = new Date();
    this.salesforceId = null;
    
    // Atributos para el leaderboard
    this.leaderboardSubmitted = false;
    this.leaderboardScore = null;
    this.leaderboardSubmittedAt = null;
    
    // Inicializar logro de bienvenida
    this.initializeWelcomeAchievement();
  }

  // Inicializar logro de bienvenida
  initializeWelcomeAchievement() {
    const welcomeAchievement = catalogConfig.achievements.find(a => a.autoUnlock);
    if (welcomeAchievement) {
      this.unlockAchievement({
        id: welcomeAchievement.id,
        name: welcomeAchievement.name,
        description: brandConfig.messages.welcomeDescription,
        points: welcomeAchievement.points,
        icon: welcomeAchievement.icon
      });
    }
  }

  // Métodos para gestionar puntos (simplificado)
  addPoints(amount, reason) {
    this.points += amount;
    this._checkTierUpdate();
    
    return this.points;
  }

  // Desbloquear un logro
  unlockAchievement(achievement) {
    if (!this.hasAchievement(achievement.id)) {
      achievement.unlockedAt = new Date();
      this.achievements.push(achievement);
      
      // Si el logro tiene puntos, añadirlos
      if (achievement.points > 0) {
        this.addPoints(achievement.points, `Logro: ${achievement.name}`);
      }
      
      return achievement;
    }
    return null;
  }
  
  // Comprobar si ya tiene un logro
  hasAchievement(achievementId) {
    return this.achievements.some(a => a.id === achievementId);
  }

  // Agregar voucher
  addVoucher(voucher) {
    voucher.id = Date.now();
    voucher.createdAt = new Date();
    voucher.used = false;
    this.vouchers.push(voucher);
    return voucher;
  }

  // Agregar promoción
  addPromotion(promotion) {
    promotion.id = Date.now();
    promotion.createdAt = new Date();
    promotion.active = true;
    this.promotions.push(promotion);
    return promotion;
  }

  // Método privado para actualizar tier
  _checkTierUpdate() {
    const currentTierObj = tiersConfig.getTierByPoints(this.points);
    const newTierName = currentTierObj.name;

    // Si hubo cambio de tier
    if (newTierName !== this.tier) {
      this.tier = newTierName;
      
      // Trigger achievement de tier si existe
      const tierAchievement = catalogConfig.achievements.find(a => 
        a.trigger === 'tier_update' && a.tierRequired === newTierName
      );
      
      if (tierAchievement && !this.hasAchievement(tierAchievement.id)) {
        this.unlockAchievement({
          id: tierAchievement.id,
          name: tierAchievement.name,
          description: tierAchievement.description,
          points: tierAchievement.points,
          icon: tierAchievement.icon
        });
      }
    }
  }
  
  // Obtener el próximo tier
  getNextTier() {
    return tiersConfig.getNextTier(this.tier)?.name || null;
  }
  
  // Obtener puntos necesarios para el próximo tier
  getPointsForNextTier() {
    const nextTier = tiersConfig.getNextTier(this.tier);
    return nextTier ? nextTier.threshold : null;
  }
  
  // Calcular progreso hacia el próximo nivel (0-100%)
  getProgressToNextTier() {
    const currentTierObj = tiersConfig.getTierByName(this.tier);
    const nextTierObj = tiersConfig.getNextTier(this.tier);
    
    if (!nextTierObj) return 100;
    
    return tiersConfig.getProgressCalculation(this.points, currentTierObj, nextTierObj);
  }

  // Calcular engagement score simplificado
  getEngagementScore() {
    const achievementsScore = (this.achievements.length / 10) * 40; // 40% por logros
    const pointsScore = Math.min((this.points / 2000) * 50, 50); // 50% por puntos
    const tierScore = {
      'Bronze': 2.5,
      'Silver': 5,
      'Gold': 7.5,
      'Platinum': 10
    }[this.tier] || 0; // 10% por tier
    
    return Math.round(achievementsScore + pointsScore + tierScore);
  }

  // Métodos estáticos
  static findById(id) {
    return members.find(member => member.id === parseInt(id));
  }

  static findByEmail(email) {
    return members.find(member => member.email === email);
  }

  static save(member) {
    members.push(member);
    return member;
  }

  static getAll() {
    return members;
  }
}

module.exports = Member;