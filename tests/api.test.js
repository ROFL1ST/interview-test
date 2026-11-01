const request = require('supertest');
const app = require('../src/app');
const userRepository = require('../src/repositories/userRepository');
const { generateToken } = require('../src/utils/jwt');

// Mock userRepository to test endpoints independently of DB availability
jest.mock('../src/repositories/userRepository');

describe('API Endpoints Test Suite', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET / and GET /api/v1/health', () => {
    it('GET / should return 200 with API info', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.apiDocumentation).toBe('/api-docs');
    });

    it('GET /api/v1/health should return health status', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('healthy');
    });
  });

  describe('POST /api/v1/auth/register', () => {
    it('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@widya.ai',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 400 when email format is invalid', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Budi Test',
          email: 'invalid-email-format',
          password: 'password123',
          gender: 'laki-laki',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 409 if email is already registered', async () => {
      userRepository.findByEmail.mockResolvedValueOnce({
        id: 1,
        email: 'budi@widya.ai',
      });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Budi Test',
          email: 'budi@widya.ai',
          password: 'password123',
          gender: 'laki-laki',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('sudah terdaftar');
    });

    it('should register successfully with 201 Created', async () => {
      userRepository.findByEmail.mockResolvedValueOnce(null);
      userRepository.create.mockResolvedValueOnce({
        id: 1,
        name: 'Budi Test',
        email: 'budi@widya.ai',
        gender: 'laki-laki',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Budi Test',
          email: 'budi@widya.ai',
          password: 'password123',
          gender: 'laki-laki',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('budi@widya.ai');
      expect(res.body.data.password).toBeUndefined(); // ensure password is not leaked
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 401 when user email is not found', async () => {
      userRepository.findByEmail.mockResolvedValueOnce(null);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'notfound@widya.ai',
          password: 'password123',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/users/profile', () => {
    it('should return 401 Unauthorized when no Authorization header is provided', async () => {
      const res = await request(app).get('/api/v1/users/profile');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Authorization');
    });

    it('should return 401 Unauthorized when token is invalid', async () => {
      const res = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 200 with user profile when token is valid', async () => {
      const mockUser = {
        id: 1,
        name: 'Budi Test',
        email: 'budi@widya.ai',
        gender: 'laki-laki',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const token = generateToken({ id: mockUser.id, email: mockUser.email });

      // authMiddleware checks findById
      userRepository.findById.mockResolvedValueOnce(mockUser);
      // userService.getProfile calls findById
      userRepository.findById.mockResolvedValueOnce(mockUser);

      const res = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(mockUser.email);
      expect(res.body.data.gender).toBe(mockUser.gender);
    });
  });
});
