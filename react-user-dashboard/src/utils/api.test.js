import api from './api';
import MockAdapter from 'axios-mock-adapter';

describe('Axios API Instance', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(api);
    localStorage.clear();
  });

  afterEach(() => {
    mock.reset();
  });

  it('should use correct base URL', async () => {
    mock.onGet('/test').reply((config) => {
      expect(config.baseURL).toBe('https://dummyjson.com');
      return [200, { success: true }];
    });

    const res = await api.get('/test');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('should attach Authorization header if token exists', async () => {
    localStorage.setItem('token', 'mock-token');

    mock.onGet('/auth-test').reply((config) => {
      expect(config.headers.Authorization).toBe('Bearer mock-token');
      return [200, { authorized: true }];
    });

    const res = await api.get('/auth-test');
    expect(res.data.authorized).toBe(true);
  });

  it('should not attach Authorization header if token is missing', async () => {
    mock.onGet('/auth-test').reply((config) => {
      expect(config.headers.Authorization).toBeUndefined();
      return [200, { authorized: false }];
    });

    const res = await api.get('/auth-test');
    expect(res.data.authorized).toBe(false);
  });
});
