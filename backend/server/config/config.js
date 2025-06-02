require('dotenv').config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // MongoDB configuration
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://marputtt:admin@clusterwads.mfcml5y.mongodb.net/PRIVData',

  // File upload configuration
  uploadDir: 'uploads',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],

  // CORS configuration - allow all origins during development
  corsOptions: {
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-User-Id', 'Authorization'],
    credentials: true
  }
}; 