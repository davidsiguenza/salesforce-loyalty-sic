const express = require('express');
const router = express.Router();
const Member = require('../models/member');
const catalogConfig = require('../config/catalog');

// Middleware para verificar autenticación en API
const requireAuth = (req, res, next) => {
  if (!req.session.memberId) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  const member = Member.findById(req.session.memberId);
  if (!member) {
    req.session.destroy();
    return res.status(401).json({ error: 'Sesión inválida' });
  }
  
  req.member = member;
  next();
};

// Obtener datos del miembro actual
router.get('/member', requireAuth, (req, res) => {
  const member = req.member;
  
  res.json({
    id: member.id,
    name: member.name,
    email: member.email,
    points: member.points,
    tier: member.tier,
    nextTier: member.getNextTier(),
    pointsForNextTier: member.getPointsForNextTier(),
    progressToNextTier: member.getProgressToNextTier(),
    achievements: member.achievements,
    vouchers: member.vouchers,
    promotions: member.promotions,
    engagementScore: member.getEngagementScore()
  });
});

// Obtener logros disponibles
router.get('/achievements', requireAuth, (req, res) => {
  const member = req.member;
  
  const achievementsWithStatus = catalogConfig.achievements.map(achievement => ({
    ...achievement,
    unlocked: member.hasAchievement(achievement.id),
    unlockedAt: member.achievements.find(a => a.id === achievement.id)?.unlockedAt || null
  }));
  
  res.json(achievementsWithStatus);
});

// Desbloquear logro manualmente (para testing)
router.post('/achievements/:id/unlock', requireAuth, (req, res) => {
  const member = req.member;
  const achievementId = req.params.id;
  
  const achievement = catalogConfig.achievements.find(a => a.id === achievementId);
  if (!achievement) {
    return res.status(404).json({ error: 'Logro no encontrado' });
  }
  
  if (member.hasAchievement(achievementId)) {
    return res.status(400).json({ error: 'Logro ya desbloqueado' });
  }
  
  const unlockedAchievement = member.unlockAchievement({
    id: achievement.id,
    name: achievement.name,
    description: achievement.description,
    points: achievement.points,
    icon: achievement.icon
  });
  
  res.json({
    success: true,
    achievement: unlockedAchievement,
    newPoints: member.points,
    newTier: member.tier
  });
});

// Agregar puntos manualmente (para testing del agente)
router.post('/points/add', requireAuth, (req, res) => {
  const member = req.member;
  const { amount, reason } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Cantidad de puntos inválida' });
  }
  
  const oldTier = member.tier;
  member.addPoints(amount, reason || 'Puntos agregados por agente');
  
  res.json({
    success: true,
    pointsAdded: amount,
    totalPoints: member.points,
    tierChanged: oldTier !== member.tier,
    newTier: member.tier,
    reason: reason || 'Puntos agregados por agente'
  });
});

// Agregar voucher (será llamado por el agente)
router.post('/vouchers/add', requireAuth, (req, res) => {
  const member = req.member;
  const { title, description, discount, code, expiresAt } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: 'Título y descripción son requeridos' });
  }
  
  const voucher = member.addVoucher({
    title,
    description,
    discount: discount || 10,
    code: code || `VOUCHER-${Date.now()}`,
    expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
  });
  
  res.json({
    success: true,
    voucher: voucher
  });
});

// Agregar promoción (será llamado por el agente)
router.post('/promotions/add', requireAuth, (req, res) => {
  const member = req.member;
  const { title, description, type, value, validUntil } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: 'Título y descripción son requeridos' });
  }
  
  const promotion = member.addPromotion({
    title,
    description,
    type: type || 'discount', // discount, freeShipping, etc.
    value: value || 15,
    validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
  });
  
  res.json({
    success: true,
    promotion: promotion
  });
});

// Obtener leaderboard
router.get('/leaderboard', requireAuth, (req, res) => {
  const allMembers = Member.getAll();
  
  const leaderboard = allMembers
    .map(member => ({
      id: member.id,
      name: member.name,
      points: member.points,
      tier: member.tier,
      achievements: member.achievements.length,
      engagementScore: member.getEngagementScore()
    }))
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, 20); // Top 20
  
  res.json(leaderboard);
});

// Enviar score al leaderboard (simplificado)
router.post('/leaderboard/submit', requireAuth, (req, res) => {
  const member = req.member;
  
  if (member.leaderboardSubmitted) {
    return res.status(400).json({ error: 'Ya has enviado tu puntuación' });
  }
  
  const engagementScore = member.getEngagementScore();
  member.leaderboardScore = engagementScore;
  member.leaderboardSubmitted = true;
  member.leaderboardSubmittedAt = new Date();
  
  res.json({
    success: true,
    score: engagementScore,
    submittedAt: member.leaderboardSubmittedAt
  });
});

module.exports = router;