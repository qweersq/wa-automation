const WhatsAppService = require('../services/whatsappService');

class WhatsAppController {
  constructor() {
    this.whatsappService = new WhatsAppService();
  }

  // Get QR code for frontend
  getQRCode(req, res) {
    try {
      const result = this.whatsappService.getQRCode();
      res.json(result);
    } catch (error) {
      console.error('Error getting QR code:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get QR code',
        error: error.message
      });
    }
  }

  // Check connection status
  getStatus(req, res) {
    try {
      const result = this.whatsappService.getStatus();
      res.json(result);
    } catch (error) {
      console.error('Error getting status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get status',
        error: error.message
      });
    }
  }

  // Send message
  async sendMessage(req, res) {
    try {
      const { phone, message } = req.body;

      if (!phone || !message) {
        return res.status(400).json({
          success: false,
          message: 'Phone number and message are required'
        });
      }

      const result = await this.whatsappService.sendMessage(phone, message);
      res.json(result);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Handle specific error types
      if (error.message.includes('not connected')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to send message',
        error: error.message
      });
    }
  }

  // Test endpoint
  test(req, res) {
    try {
      const clientInfo = this.whatsappService.getClientInfo();
      
      res.json({
        success: true,
        message: 'WhatsApp automation API is running',
        timestamp: new Date().toISOString(),
        status: clientInfo
      });
    } catch (error) {
      console.error('Error in test endpoint:', error);
      res.status(500).json({
        success: false,
        message: 'Test endpoint failed',
        error: error.message
      });
    }
  }

  // Health check
  health(req, res) {
    try {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'WhatsApp Automation',
        version: '1.0.0'
      });
    } catch (error) {
      console.error('Error in health check:', error);
      res.status(500).json({
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        service: 'WhatsApp Automation',
        error: error.message
      });
    }
  }

  // Destroy session and reinitialize
  async destroySession(req, res) {
    try {
      console.log('🗑️ Received request to destroy session');
      const result = await this.whatsappService.destroySession();
      
      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message,
          error: result.error,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error destroying session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to destroy session',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Logout and clear session
  async logout(req, res) {
    try {
      console.log('👋 Received request to logout');
      const result = await this.whatsappService.logout();
      
      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          warning: result.warning || null,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message,
          error: result.error,
          forceError: result.forceError || null,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to logout',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Restart WhatsApp service
  async restart(req, res) {
    try {
      console.log('🔄 Received request to restart service');
      const result = await this.whatsappService.restart();
      
      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message,
          error: result.error,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error restarting service:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to restart service',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Force refresh QR code
  async forceRefreshQR(req, res) {
    try {
      console.log('🔄 Received request to force refresh QR code');
      const result = await this.whatsappService.forceRefreshQR();
      
      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          qrCode: result.qrCode,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message,
          error: result.error,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error force refreshing QR code:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to force refresh QR code',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = WhatsAppController;
