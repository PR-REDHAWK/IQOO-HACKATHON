/**
 * Generates a random 6-digit OTP code as a string.
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Verifies if the entered OTP matches the stored OTP.
 */
export function verifyOTP(enteredOtp, storedOtp) {
  return enteredOtp.trim() === storedOtp.trim();
}

/**
 * Mock parent face verification utility.
 * Simulates latency and verifies parent biometric signature.
 */
export async function verifyParentFace() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        confidence: 99.2,
        timestamp: new Date().toISOString()
      });
    }, 2000);
  });
}
