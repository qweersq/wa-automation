const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testing WhatsApp Automation API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    console.log('');

    // Test 2: Test endpoint
    console.log('2. Testing API endpoint...');
    const testResponse = await fetch(`${BASE_URL}/api/wa/test`);
    const testData = await testResponse.json();
    console.log('✅ Test endpoint:', testData);
    console.log('');

    // Test 3: Check status
    console.log('3. Checking WhatsApp status...');
    const statusResponse = await fetch(`${BASE_URL}/api/wa/status`);
    const statusData = await statusResponse.json();
    console.log('✅ Status:', statusData);
    console.log('');

    // Test 4: Get QR code
    console.log('4. Getting QR code...');
    const qrResponse = await fetch(`${BASE_URL}/api/wa/qr`);
    const qrData = await qrResponse.json();
    console.log('✅ QR response:', {
      success: qrData.success,
      isReady: qrData.isReady,
      hasQRCode: !!qrData.qrCode,
      message: qrData.message
    });
    console.log('');

    if (qrData.qrCode) {
      console.log('📱 QR Code available! You can scan it with WhatsApp mobile app.');
      console.log('QR Code data URL length:', qrData.qrCode.length);
    }

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. If QR code is available, scan it with WhatsApp mobile app');
    console.log('2. Check status again to confirm connection');
    console.log('3. Test sending a message using the send-message endpoint');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running on port 3001');
  }
}

// Run tests
testAPI();
