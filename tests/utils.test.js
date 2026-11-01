const { hashPassword, comparePassword } = require('../src/utils/password');
const { generateToken, verifyToken } = require('../src/utils/jwt');

describe('Utility Functions Test Suite', () => {
  describe('Password Hashing Utility', () => {
    it('should hash a plain password properly and match via comparePassword', async () => {
      const password = 'SecretPassword123';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toEqual(password);

      const isMatch = await comparePassword(password, hash);
      expect(isMatch).toBe(true);

      const isWrongMatch = await comparePassword('wrongpassword', hash);
      expect(isWrongMatch).toBe(false);
    });
  });

  describe('JWT Token Utility', () => {
    it('should generate and verify JWT token successfully', () => {
      const payload = { id: 1, email: 'test@widya.ai' };
      const token = generateToken(payload);

      expect(typeof token).toBe('string');

      const decoded = verifyToken(token);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
    });

    it('should throw error when verifying invalid token', () => {
      expect(() => {
        verifyToken('invalid.jwt.token');
      }).toThrow();
    });
  });
});
