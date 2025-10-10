describe('URLs', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('should use localhost URL when LIVE is false', () => {
    jest.doMock('../urls', () => ({
      __esModule: true,
      default: {
        LIVE: false,
        LIVEURL: 'http://localhost:5000/',
        FILEURL: 'http://localhost:5000/',
        SETTINGS_ID: '68ad8844bfdf0cec7f623bc2',
        API: expect.any(Object)
      }
    }));
    
    const urls = require('../urls').default;
    expect(urls.LIVEURL).toBe('http://localhost:5000/');
  });

  test('should use production URL when LIVE is true', () => {
    jest.doMock('../urls', () => ({
      __esModule: true,
      default: {
        LIVE: true,
        LIVEURL: 'https://bookadzonebackend.onrender.com/',
        FILEURL: 'https://bookadzonebackend.onrender.com/',
        SETTINGS_ID: '68ad8844bfdf0cec7f623bc2',
        API: expect.any(Object)
      }
    }));
    
    const urls = require('../urls').default;
    expect(urls.LIVEURL).toBe('https://bookadzonebackend.onrender.com/');
  });
});