const express = require('express');
const router = express.Router();
const Member = require('../models/member');
const salesforceLoyalty = require('../modules/salesforceLoyalty');
const brandConfig = require('../config/brand');

// Middleware para redirigir si ya está autenticado
const redirectIfAuthenticated = (req, res, next) => {
  if (req.session.memberId) {
    const member = Member.findById(req.session.memberId);
    if (member) {
      return res.redirect('/');
    }
  }
  next();
};

// Mostrar formulario de registro
router.get('/', redirectIfAuthenticated, (req, res) => {
  const message = req.query.message;
  res.render('register', { 
    currentPage: 'register',
    message: message || null
  });
});

// Procesar formulario de registro
router.post('/', redirectIfAuthenticated, async (req, res) => {
  const { name, email, preferences } = req.body;
  
  // Validaciones básicas
  if (!name || !email) {
    return res.render('register', { 
      error: 'Nombre y email son obligatorios',
      formData: req.body,
      currentPage: 'register'
    });
  }
  
  // Verificar si ya existe un miembro con este email
  const existingMember = Member.findByEmail(email);
  if (existingMember) {
    return res.render('register', {
      error: 'Ya existe una cuenta con este email. Usa un email diferente.',
      formData: req.body,
      currentPage: 'register'
    });
  }
  
  // Verificar si debemos usar Salesforce o el modo demo
  const useSalesforce = process.env.USE_SALESFORCE === 'true';
  let sfMemberId = null;
  let salesforceError = null;
  
  if (useSalesforce) {
    try {
      console.log('🚀 Iniciando registro en Salesforce Loyalty Management...');
      
      const salesforcePromise = salesforceLoyalty.enrollMember({
        name,
        email,
        preferences: preferences || []
      });
      
      // Timeout para evitar que Heroku corte la conexión
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('El registro está tardando demasiado. Por favor, inténtalo de nuevo.'));
        }, 25000);
      });
      
      const sfResponse = await Promise.race([salesforcePromise, timeoutPromise]);
      
      console.log('✅ Miembro registrado exitosamente en Salesforce');
      sfMemberId = sfResponse.loyaltyProgramMemberId || sfResponse.id;
      
      if (sfMemberId) {
        console.log('🆔 ID del miembro en Salesforce:', sfMemberId);
      }
      
    } catch (sfError) {
      console.error('❌ Error al registrar en Salesforce:', sfError.message);
      salesforceError = sfError.message;
      console.log('📝 Continuando con registro local debido a error de Salesforce');
    }
  }
  
  try {
    // Crear nuevo miembro en nuestra aplicación local
    const newMember = new Member(name, email, preferences || []);
    
    // Si hemos creado el miembro en Salesforce, guardar su ID
    if (sfMemberId) {
      newMember.salesforceId = sfMemberId;
    }
    
    // Guardar miembro localmente
    Member.save(newMember);
    
    // Crear sesión para el nuevo miembro
    req.session.memberId = newMember.id;
    
    console.log(`✅ Nuevo miembro registrado: ${newMember.name} (ID: ${newMember.id})`);
    
    // Redirigir al dashboard con mensaje de bienvenida
    let welcomeMessage = brandConfig.messages.welcome;
    
    if (salesforceError) {
      welcomeMessage = `${welcomeMessage} (Nota: Hubo un problema conectando con Salesforce, pero tu cuenta se creó correctamente en modo local)`;
    }
    
    res.redirect(`/?message=${encodeURIComponent(welcomeMessage)}`);
    
  } catch (error) {
    console.error('❌ Error al registrar miembro localmente:', error);
    
    let errorMessage = 'Error interno al crear la cuenta';
    
    if (salesforceError) {
      errorMessage = `Error de Salesforce: ${salesforceError}`;
    }
    
    res.render('register', { 
      error: errorMessage,
      formData: req.body,
      currentPage: 'register'
    });
  }
});

module.exports = router;