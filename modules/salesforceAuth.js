// modules/salesforceAuth.js - Versión simplificada
const axios = require('axios');
const querystring = require('querystring');

// Clase para gestionar la autenticación de Salesforce
class SalesforceAuth {
  constructor() {
    this.accessToken = null;
    this.instanceUrl = null;
  }

  /**
   * Obtiene un token de acceso desde Salesforce usando OAuth 2.0 username-password flow
   * @returns {Promise<string>} Access token
   */
  async getAccessToken() {
    try {
      // Configuración desde variables de entorno
      const clientId = process.env.SF_CLIENT_ID;
      const clientSecret = process.env.SF_CLIENT_SECRET;
      const username = process.env.SF_USERNAME;
      const password = process.env.SF_PASSWORD;
      const loginUrl = process.env.SF_LOGIN_URL || 'https://login.salesforce.com';

      if (!clientId || !clientSecret || !username || !password) {
        throw new Error('Faltan credenciales de Salesforce en las variables de entorno');
      }

      // Prepara la solicitud para obtener el token
      const data = querystring.stringify({
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        username: username,
        password: password
      });

      console.log('Solicitando token de acceso a Salesforce...');
      
      const response = await axios.post(`${loginUrl}/services/oauth2/token`, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // Guardar la respuesta
      this.accessToken = response.data.access_token;
      this.instanceUrl = response.data.instance_url;
      
      console.log('Token de Salesforce obtenido correctamente');
      console.log(`Instance URL: ${this.instanceUrl}`);
      
      return this.accessToken;
    } catch (error) {
      console.error('Error al obtener token de Salesforce:', error.message);
      
      if (error.response) {
        console.error('Detalles del error:');
        console.error('- Status:', error.response.status);
        console.error('- Datos:', JSON.stringify(error.response.data));
      }
      
      throw new Error(`Error de autenticación: ${error.message}`);
    }
  }

  /**
   * Obtiene la URL de la instancia
   * @returns {Promise<string>}
   */
  async getInstanceUrl() {
    if (!this.instanceUrl) {
      await this.getAccessToken();
    }
    return this.instanceUrl;
  }
}

// Exportamos una instancia única para toda la aplicación
module.exports = new SalesforceAuth();