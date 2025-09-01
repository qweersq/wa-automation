const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

class WhatsAppService {
  constructor() {
    this.client = null;
    this.qrCodeData = null;
    this.isReady = false;
    this.initializeWhatsApp();
  }

  // Initialize WhatsApp client
  initializeWhatsApp() {
    console.log('Initializing WhatsApp client...');
    
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        timeout: 60000, // Increase timeout to 60 seconds
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection'
        ],
        executablePath: process.env.CHROME_PATH || undefined
      }
    });

    this.setupEventListeners();
    this.initializeClient();
  }

  // Setup event listeners
  setupEventListeners() {
    this.client.on('qr', async (qr) => {
      console.log('QR Code received');
      try {
        this.qrCodeData = await qrcode.toDataURL(qr);
        console.log('QR Code generated successfully');
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    });

    this.client.on('ready', () => {
      console.log('WhatsApp client is ready!');
      this.isReady = true;
      this.qrCodeData = null; // Clear QR code once ready
    });

    this.client.on('authenticated', () => {
      console.log('WhatsApp client authenticated');
    });

    this.client.on('auth_failure', (msg) => {
      console.error('WhatsApp authentication failed:', msg);
      this.isReady = false;
    });

    this.client.on('disconnected', (reason) => {
      console.log('WhatsApp client disconnected:', reason);
      this.isReady = false;
      // Reinitialize after disconnect
      setTimeout(() => {
        this.initializeWhatsApp();
      }, 5000);
    });

    this.client.on('loading_screen', (percent, message) => {
      console.log(`Loading: ${percent}% - ${message}`);
    });
  }

  // Initialize client with error handling
  initializeClient() {
    this.client.initialize().catch((error) => {
      console.error('Failed to initialize WhatsApp client:', error);
      
      // If it's a timeout error, try again with different settings
      if (error.message.includes('Timed out') || error.message.includes('TimeoutError')) {
        console.log('Timeout detected, retrying with different settings...');
        setTimeout(() => {
          this.retryWithDifferentSettings();
        }, 3000);
      }
    });
  }

  // Retry function with different Puppeteer settings
  retryWithDifferentSettings() {
    console.log('Retrying with different Puppeteer settings...');
    
    if (this.client) {
      try {
        this.client.destroy();
      } catch (error) {
        console.log('Error destroying previous client:', error);
      }
    }
    
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        timeout: 90000, // Even longer timeout
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ],
        executablePath: process.env.CHROME_PATH || undefined
      }
    });

    this.setupEventListeners();
    this.client.initialize().catch((error) => {
      console.error('Retry also failed:', error);
      console.log('Please check your Chrome installation and try again');
    });
  }

  // Get QR code
  getQRCode() {
    if (this.isReady) {
      return {
        success: true,
        message: 'WhatsApp already connected',
        isReady: true
      };
    }

    if (this.qrCodeData) {
      return {
        success: true,
        qrCode: this.qrCodeData,
        isReady: false
      };
    }

    return {
      success: false,
      message: 'QR code not available yet, please wait...',
      isReady: false
    };
  }

  // Get connection status
  getStatus() {
    return {
      success: true,
      isReady: this.isReady,
      message: this.isReady ? 'WhatsApp connected' : 'WhatsApp not connected'
    };
  }

  // Send message
  async sendMessage(phone, message) {
    if (!phone || !message) {
      throw new Error('Phone number and message are required');
    }

    if (!this.isReady) {
      throw new Error('WhatsApp not connected. Please scan QR code first.');
    }

    // Format phone number (remove + if present and add @c.us suffix)
    let formattedPhone = phone.replace(/^\+/, '');
    if (!formattedPhone.endsWith('@c.us')) {
      formattedPhone += '@c.us';
    }

    // Send message
    const result = await this.client.sendMessage(formattedPhone, message);
    
    return {
      success: true,
      message: 'Message sent successfully',
      data: {
        id: result.id._serialized,
        timestamp: result.timestamp,
        to: phone
      }
    };
  }

  // Get client info for testing
  getClientInfo() {
    return {
      isReady: this.isReady,
      hasClient: !!this.client
    };
  }

  // Destroy current session and reinitialize
  async destroySession() {
    try {
      console.log('🗑️ Destroying WhatsApp session...');
      
      if (this.client) {
        try {
          // Destroy the client
          await this.client.destroy();
          console.log('✅ WhatsApp client destroyed');
        } catch (destroyError) {
          console.log('⚠️ Client destroy failed, proceeding anyway');
        }
      }

      // Reset state
      this.client = null;
      this.qrCodeData = null;
      this.isReady = false;

      // Wait a bit before reinitializing
      console.log('⏳ Waiting 3 seconds before reinitializing...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Reinitialize
      console.log('🔄 Reinitializing WhatsApp client...');
      this.initializeWhatsApp();

      // Wait for QR code to be generated
      console.log('⏳ Waiting for QR code generation...');
      let attempts = 0;
      const maxAttempts = 20; // 20 seconds timeout
      
      while (attempts < maxAttempts && !this.qrCodeData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
        console.log(`⏳ Waiting for QR code... (${attempts}/${maxAttempts})`);
      }

      if (this.qrCodeData) {
        console.log('✅ QR code generated successfully after session destroy');
      } else {
        console.log('⚠️ QR code not generated, forcing reinitialize');
        this.initializeWhatsApp();
      }

      console.log('✅ WhatsApp session destroyed and reinitialized');
      return {
        success: true,
        message: 'Session destroyed and reinitialized successfully',
        qrCodeAvailable: !!this.qrCodeData
      };

    } catch (error) {
      console.error('❌ Error destroying session:', error);
      
      // Force reinitialize even if destroy fails
      try {
        this.client = null;
        this.qrCodeData = null;
        this.isReady = false;
        
        console.log('🔄 Force reinitializing after error...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.initializeWhatsApp();
        
        return {
          success: true,
          message: 'Forced session reset completed',
          warning: `Destroy failed but session was reset: ${error.message}`
        };
      } catch (forceError) {
        return {
          success: false,
          message: 'Failed to destroy and reset session',
          error: error.message,
          forceError: forceError.message
        };
      }
    }
  }

  // Logout and clear session data
  async logout() {
    try {
      console.log('👋 Logging out from WhatsApp...');
      
      if (this.client && this.isReady) {
        try {
          // Logout from WhatsApp Web
          await this.client.logout();
          console.log('✅ Logged out from WhatsApp Web');
        } catch (logoutError) {
          console.log('⚠️ Logout failed, proceeding with force reset');
        }
      }

      // Destroy the client
      if (this.client) {
        try {
          await this.client.destroy();
          console.log('✅ WhatsApp client destroyed');
        } catch (destroyError) {
          console.log('⚠️ Client destroy failed, proceeding anyway');
        }
      }

      // Reset state
      this.client = null;
      this.qrCodeData = null;
      this.isReady = false;

      // Wait a bit before reinitializing
      console.log('⏳ Waiting 5 seconds before reinitializing...');
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Force reinitialize with new client
      console.log('🔄 Reinitializing WhatsApp client...');
      this.initializeWhatsApp();

      // Wait for QR code to be generated
      console.log('⏳ Waiting for QR code generation...');
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout
      
      while (attempts < maxAttempts && !this.qrCodeData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
        console.log(`⏳ Waiting for QR code... (${attempts}/${maxAttempts})`);
      }

      if (this.qrCodeData) {
        console.log('✅ QR code generated successfully after logout');
      } else {
        console.log('⚠️ QR code not generated, forcing reinitialize');
        // Force reinitialize again
        this.initializeWhatsApp();
      }

      console.log('✅ Logout completed and session reinitialized');
      return {
        success: true,
        message: 'Logout completed and session reinitialized successfully',
        qrCodeAvailable: !!this.qrCodeData
      };

    } catch (error) {
      console.error('❌ Error during logout:', error);
      
      // Force destroy and reinitialize even if logout fails
      try {
        if (this.client) {
          await this.client.destroy();
        }
        this.client = null;
        this.qrCodeData = null;
        this.isReady = false;
        
        console.log('🔄 Force reinitializing after error...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        this.initializeWhatsApp();
        
        return {
          success: true,
          message: 'Forced session reset completed',
          warning: `Logout failed but session was reset: ${error.message}`
        };
      } catch (forceError) {
        return {
          success: false,
          message: 'Failed to logout and reset session',
          error: error.message,
          forceError: forceError.message
        };
      }
    }
  }

  // Restart WhatsApp service completely
  async restart() {
    try {
      console.log('🔄 Restarting WhatsApp service...');
      
      // First try to logout properly
      if (this.client && this.isReady) {
        try {
          await this.client.logout();
          console.log('✅ Logged out successfully');
        } catch (logoutError) {
          console.log('⚠️ Logout failed, proceeding with force restart');
        }
      }

      // Destroy client
      if (this.client) {
        try {
          await this.client.destroy();
          console.log('✅ Client destroyed');
        } catch (destroyError) {
          console.log('⚠️ Client destroy failed, proceeding anyway');
        }
      }

      // Reset all state
      this.client = null;
      this.qrCodeData = null;
      this.isReady = false;

      // Wait before reinitializing
      console.log('⏳ Waiting 5 seconds before reinitializing...');
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Reinitialize
      this.initializeWhatsApp();

      // Wait for QR code to be generated
      console.log('⏳ Waiting for QR code generation...');
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout
      
      while (attempts < maxAttempts && !this.qrCodeData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
        console.log(`⏳ Waiting for QR code... (${attempts}/${maxAttempts})`);
      }

      if (this.qrCodeData) {
        console.log('✅ QR code generated successfully after restart');
      } else {
        console.log('⚠️ QR code not generated, forcing reinitialize');
        this.initializeWhatsApp();
      }

      console.log('✅ WhatsApp service restarted successfully');
      return {
        success: true,
        message: 'WhatsApp service restarted successfully',
        qrCodeAvailable: !!this.qrCodeData
      };

    } catch (error) {
      console.error('❌ Error restarting WhatsApp service:', error);
      return {
        success: false,
        message: 'Failed to restart WhatsApp service',
        error: error.message
      };
    }
  }

  // Force refresh QR code if stuck
  async forceRefreshQR() {
    try {
      console.log('🔄 Force refreshing QR code...');
      
      if (this.client) {
        try {
          await this.client.destroy();
          console.log('✅ Old client destroyed');
        } catch (destroyError) {
          console.log('⚠️ Client destroy failed, proceeding anyway');
        }
      }

      // Reset state
      this.client = null;
      this.qrCodeData = null;
      this.isReady = false;

      // Wait and reinitialize
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.initializeWhatsApp();

      // Wait for QR code
      let attempts = 0;
      const maxAttempts = 25;
      
      while (attempts < maxAttempts && !this.qrCodeData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
        console.log(`⏳ Waiting for QR code... (${attempts}/${maxAttempts})`);
      }

      if (this.qrCodeData) {
        console.log('✅ QR code refreshed successfully');
        return {
          success: true,
          message: 'QR code refreshed successfully',
          qrCode: this.qrCodeData
        };
      } else {
        console.log('❌ Failed to refresh QR code');
        return {
          success: false,
          message: 'Failed to refresh QR code'
        };
      }

    } catch (error) {
      console.error('❌ Error force refreshing QR code:', error);
      return {
        success: false,
        message: 'Failed to force refresh QR code',
        error: error.message
      };
    }
  }
}

module.exports = WhatsAppService;
