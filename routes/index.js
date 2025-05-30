const express = require('express');
const router = express.Router();
const Member = require('../models/member');

// Middleware para obtener el miembro actual
const getCurrentMember = (req, res, next) => {
  if (req.session.memberId) {
    const member = Member.findById(req.session.memberId);
    if (member) {
      req.member = member;
      res.locals.member = member;
    } else {
      // Sesión inválida, limpiarla
      req.session.destroy();
    }
  }
  next();
};

// Aplicar middleware
router.use(getCurrentMember);

// Ruta principal - Landing page o Dashboard
router.get('/', (req, res) => {
  const member = req.member;
  const message = req.query.message;
  
  if (member) {
    // Usuario autenticado - mostrar dashboard mobile
    res.render('dashboard', { 
      member,
      message: message || null,
      currentPage: 'dashboard'
    });
  } else {
    // Usuario no autenticado - mostrar landing page
    res.render('index', { 
      member: null,
      message: message || null,
      currentPage: 'home'
    });
  }
});

// Ruta para resetear cuenta individual
router.post('/reset-account', (req, res) => {
  if (!req.session.memberId) {
    return res.redirect('/register?message=Debes estar registrado para resetear tu cuenta');
  }
  
  const member = Member.findById(req.session.memberId);
  if (member) {
    // Encontrar el índice del miembro en el array
    const members = Member.getAll();
    const memberIndex = members.findIndex(m => m.id === member.id);
    
    if (memberIndex !== -1) {
      // Eliminar el miembro del array
      members.splice(memberIndex, 1);
    }
  }
  
  // Destruir la sesión
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al destruir sesión:', err);
    }
    res.redirect('/register?message=Tu cuenta ha sido eliminada. Puedes registrarte nuevamente');
  });
});

module.exports = router;