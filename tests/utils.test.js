const { hashPassword, comparePassword } = require('../src/utils/password');
const { generateToken, verifyToken } = require('../src/utils/jwt');

describe('Utils', () => {
  describe('password', () => {
    it('should hash and compare password correctly', async () => {
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

  describe('jwt', () => {
    it('should generate and verify JWT token', () => {
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
