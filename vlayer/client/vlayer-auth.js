/**
 * vlayer JWT Authentication
 * Generates JWT tokens for vlayer API authentication
 */

/**
 * Generate a JWT token for vlayer API authentication
 * @param {string} clientId - The vlayer client ID
 * @param {string} clientSecret - The vlayer client secret
 * @returns {string} JWT token
 */
function generateVlayerJWT(clientId, clientSecret) {
  // For browser environment, we'll need to use a library or make this server-side
  // This is a simplified version - in production, use a proper JWT library
  
  const header = {
    alg: 'HS256',
    typ: 'JWT',
    kid: clientId
  };

  const now = Math.floor(Date.now() / 1000);
  const expiration = now + (10 * 60); // 10 minutes

  const payload = {
    sub: clientId,
    iat: now,
    exp: expiration,
    iss: 'sdk'
  };

  // Base64 URL encode
  const base64UrlEncode = (str) => {
    return btoa(JSON.stringify(str))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);

  // For HMAC-SHA256, we'd need crypto.subtle or a library
  // This is a placeholder - use a proper JWT library in production
  console.warn('JWT generation requires crypto library - use server-side generation or jwt library');
  
  // Return placeholder - in production, generate proper JWT
  return `${encodedHeader}.${encodedPayload}.signature`;
}

// Export for Node.js (server-side)
if (typeof module !== 'undefined' && module.exports) {
  // Use jsonwebtoken library in Node.js
  const jwt = require('jsonwebtoken');
  
  module.exports.generateVlayerJWT = function(clientId, clientSecret) {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
      kid: clientId
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      sub: clientId,
      iat: now,
      exp: now + (10 * 60), // 10 minutes
      iss: 'sdk'
    };

    return jwt.sign(payload, clientSecret, { 
      header: header,
      algorithm: 'HS256'
    });
  };
}

// Export for browser
if (typeof window !== 'undefined') {
  window.generateVlayerJWT = generateVlayerJWT;
}

