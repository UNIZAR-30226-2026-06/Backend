const authService = require('../src/modules/auth/authService');

describe('Auth service helpers', () => {
  test('hashPassword should create a valid hash and comparePassword should verify it', async () => {
    const password = 'Test1234!';
    const hash = await authService.hashPassword(password);

    expect(typeof hash).toBe('string');
    expect(hash).not.toBe(password);

    const isValid = await authService.comparePassword(password, hash);
    expect(isValid).toBe(true);

    const isInvalid = await authService.comparePassword('wrong-password', hash);
    expect(isInvalid).toBe(false);
  });
});
