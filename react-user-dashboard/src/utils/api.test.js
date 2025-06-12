import api from './api';

// Mock axios completely
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe('api module', () => {
  it('should export an axios instance', () => {
    expect(api).toBeDefined();
    expect(typeof api).toBe('object');
  });

  it('should have common HTTP methods', () => {
    expect(api.get).toBeDefined();
    expect(api.post).toBeDefined();
    expect(api.put).toBeDefined();
    expect(api.delete).toBeDefined();
  });
});