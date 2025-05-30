// modules/salesforceLoyalty.js - Versión mejorada con manejo de timeout
const axios = require('axios');
const salesforceAuth = require('./salesforceAuth');

class SalesforceLoyalty {
  constructor() {
    this.apiVersion = process.env.SF_API_VERSION || 'v61.0';
    this.loyaltyProgramName = process.env.SF_LOYALTY_PROGRAM_NAME;
    this.timeout = 25000; // 25 segundos - menos que el timeout de Heroku (30s)
  }

  /**
   * Crea un nuevo miembro de loyalty en Salesforce con manejo mejorado de timeout
   * @param {Object} memberData - Datos del miembro
   * @returns {Promise<Object>} - Respuesta de Salesforce
   */
  async enrollMember(memberData) {
    try {
      if (!this.loyaltyProgramName) {
        throw new Error('No se ha definido el nombre del programa de loyalty (SF_LOYALTY_PROGRAM_NAME)');
      }

      console.log('⏱️ Iniciando registro en Salesforce (timeout: 25s)...');

      // Obtener token y URL de instancia con timeout
      const accessToken = await Promise.race([
        salesforceAuth.getAccessToken(),
        this._createTimeoutPromise(10000, 'Timeout obteniendo token de Salesforce')
      ]);

      const instanceUrl = await salesforceAuth.getInstanceUrl();

      // Construir el payload para el enrollment
      const enrollmentDate = new Date().toISOString();
      const membershipNumber = `Member-${Date.now()}`;

      const payload = {
        enrollmentDate,
        membershipNumber,
        associatedContactDetails: {
          firstName: memberData.name.split(' ')[0] || memberData.name,
          lastName: memberData.name.split(' ').slice(1).join(' ') || 'Apellido',
          email: memberData.email,
          allowDuplicateRecords: "false"
        },
        memberStatus: "Active",
        createTransactionJournals: "true",
        transactionJournalStatementFrequency: "Monthly",
        transactionJournalStatementMethod: "Email",
        enrollmentChannel: "Web",
        canReceivePromotions: "true",
        canReceivePartnerPromotions: "true",
        membershipEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
      };

      // Construir la URL del endpoint
      const url = `${instanceUrl}/services/data/${this.apiVersion}/loyalty-programs/${this.loyaltyProgramName}/individual-member-enrollments`;
      
      console.log('📤 Enviando solicitud de enrollment a Salesforce...');
      console.log('URL:', url);

      // Configurar headers y timeout
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };

      // Realizar la petición con timeout personalizado
      const response = await Promise.race([
        axios.post(url, payload, { 
          headers,
          timeout: this.timeout 
        }),
        this._createTimeoutPromise(this.timeout, 'Timeout en registro de Salesforce')
      ]);

      console.log('✅ Miembro inscrito correctamente en Salesforce');
      return response.data;

    } catch (error) {
      console.error('❌ Error al inscribir miembro en Loyalty:', error.message);
      
      // Manejo específico de diferentes tipos de error
      if (error.message.includes('Timeout')) {
        console.error('⏰ La operación tardó demasiado tiempo. Salesforce puede estar experimentando lentitud.');
        throw new Error('El registro está tardando más de lo esperado. Por favor, inténtalo de nuevo en unos minutos.');
      }
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Tiempo de espera agotado. Salesforce puede estar ocupado. Inténtalo de nuevo.');
      }
      
      if (error.response) {
        console.error('📋 Detalles del error HTTP:');
        console.error('- Status:', error.response.status);
        
        if (error.response.data) {
          console.error('- Respuesta detallada:', JSON.stringify(error.response.data, null, 2));
          
          // Manejo específico de errores de Salesforce
          if (error.response.data.error && error.response.data.error.message) {
            throw new Error(`Error de Salesforce: ${error.response.data.error.message}`);
          }
        }
        
        throw new Error(`Error HTTP ${error.response.status}: ${error.response.statusText}`);
      }
      
      throw error;
    }
  }

  /**
   * Crea una promesa que se rechaza después del timeout especificado
   * @param {number} ms - Milisegundos para el timeout
   * @param {string} message - Mensaje de error
   * @returns {Promise} - Promesa que se rechaza
   */
  _createTimeoutPromise(ms, message) {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(message));
      }, ms);
    });
  }

  /**
   * Obtiene los detalles de un miembro de loyalty por email
   * @param {string} email - Email del miembro
   * @returns {Promise<Object>} - Detalles del miembro
   */
  async getMemberByEmail(email) {
    try {
      if (!this.loyaltyProgramName) {
        throw new Error('No se ha definido el nombre del programa de loyalty (SF_LOYALTY_PROGRAM_NAME)');
      }

      const instanceUrl = await salesforceAuth.getInstanceUrl();
      const url = `${instanceUrl}/services/data/${this.apiVersion}/loyalty-programs/${this.loyaltyProgramName}/members?contactEmail=${email}`;
      
      console.log('🔍 Buscando miembro por email en Salesforce:', email);
      
      const headers = await this.getHeaders();
      
      // Búsqueda con timeout más corto
      const response = await Promise.race([
        axios.get(url, { headers, timeout: 15000 }),
        this._createTimeoutPromise(15000, 'Timeout buscando miembro')
      ]);

      console.log('✅ Búsqueda completada');
      return response.data.records && response.data.records.length > 0 
        ? response.data.records[0] 
        : null;

    } catch (error) {
      if (error.response?.status === 404) {
        console.log('ℹ️ Miembro no encontrado (404)');
        return null;
      }
      
      if (error.message.includes('Timeout')) {
        console.error('⏰ Timeout buscando miembro - continuando sin búsqueda previa');
        return null;
      }
      
      console.error('⚠️ Error al buscar miembro por email:', error.message);
      return null; // No bloquear el flujo de registro
    }
  }

  /**
   * Obtiene los headers necesarios para las peticiones a la API
   * @returns {Promise<Object>} Headers para las peticiones
   */
  async getHeaders() {
    const accessToken = await salesforceAuth.getAccessToken();
    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
  }
}

module.exports = new SalesforceLoyalty();