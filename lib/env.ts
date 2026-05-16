/**
 * Environment variable validation for Funtroo project.
 * Ensures critical services (DB, Auth, Payments) have required configuration.
 */

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'NEXT_PUBLIC_RAZORPAY_KEY_ID'
] as const;

export function validateEnv() {
  const isProd = process.env.NODE_ENV === 'production';
  const missing = REQUIRED_ENV_VARS.filter(name => !process.env[name]);

  if (missing.length > 0) {
    const errorMsg = `[ENV ERROR] Missing required environment variables: ${missing.join(', ')}`;
    
    if (isProd) {
      throw new Error(errorMsg);
    } else {
      console.warn('⚠️ ' + errorMsg);
    }
  }
}

// Run validation on import
validateEnv();
