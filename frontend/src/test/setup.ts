import '@testing-library/jest-dom'

// Polyfill TextEncoder/TextDecoder for JSDOM (Node <18)
if (typeof globalThis.TextEncoder === 'undefined') {
  class TextEncoder {
    encode(str: string) {
      const utf8 = unescape(encodeURIComponent(str));
      const arr = new Uint8Array(utf8.length);
      for (let i = 0; i < utf8.length; ++i) arr[i] = utf8.charCodeAt(i);
      return arr;
    }
  }
  globalThis.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;
}
if (typeof globalThis.TextDecoder === 'undefined') {
  class TextDecoder {
    decode(arr: Uint8Array) {
      let str = '';
      for (let i = 0; i < arr.length; ++i) str += String.fromCharCode(arr[i]);
      return decodeURIComponent(escape(str));
    }
  }
  globalThis.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
}

// Mock import.meta.env for Vite API usage in tests
Object.defineProperty(globalThis, 'importMeta', {
  value: {
    env: {
      VITE_API_URL: 'http://localhost:8080',
    },
  },
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  value: jest.fn(() => true),
})

// Reset mocks before each test
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
}) 