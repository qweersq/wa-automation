const express = require('express');
const WhatsAppController = require('../controllers/whatsappController');

const router = express.Router();
const whatsappController = new WhatsAppController();

// WhatsApp Routes
router.get('/qr', (req, res) => whatsappController.getQRCode(req, res));
router.get('/status', (req, res) => whatsappController.getStatus(req, res));
router.post('/send-message', (req, res) => whatsappController.sendMessage(req, res));
router.get('/test', (req, res) => whatsappController.test(req, res));

// Session Management Routes
router.post('/destroy-session', (req, res) => whatsappController.destroySession(req, res));
router.post('/logout', (req, res) => whatsappController.logout(req, res));
router.post('/restart', (req, res) => whatsappController.restart(req, res));
router.post('/force-refresh-qr', (req, res) => whatsappController.forceRefreshQR(req, res));

module.exports = router;
