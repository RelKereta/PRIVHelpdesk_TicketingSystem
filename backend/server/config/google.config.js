const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

// Only configure Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && 
    process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here' && 
    process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret_here') {
  
  console.log('🔐 Configuring Google OAuth...');
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            // Create new user if doesn't exist
            user = await User.create({
              email: profile.emails[0].value,
              username: profile.displayName.replace(/\s+/g, '').toLowerCase(),
              firstName: profile.name?.givenName || profile.displayName,
              lastName: profile.name?.familyName || '',
              department: 'Other',
              role: 'user',
              password: Math.random().toString(36).slice(-8) // Generate random password
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  console.log('✅ Google OAuth configured successfully');
} else {
  console.log('⚠️  Google OAuth not configured - missing or invalid credentials');
  console.log('   Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file to enable Google OAuth');
}

module.exports = passport; 