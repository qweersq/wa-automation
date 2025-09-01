const express = require('express');
const WhatsAppController = require('../controllers/whatsappController');

const router = express.Router();
const whatsappController = new WhatsAppController();

// General Routes
router.get('/health', (req, res) => whatsappController.health(req, res));

module.exports = router;
