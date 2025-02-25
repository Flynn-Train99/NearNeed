// Simple placeholder authentication middleware
exports.authenticate = (req, res, next) => {
    // In a real implementation, this would verify the JWT token
    // For now, just add a mock user to the request and continue
    req.user = {
      id: '123456789',
      name: 'Test User',
      email: 'test@example.com',
      location: { lat: 51.5074, lon: -0.1278 }
    };
    next();
  };