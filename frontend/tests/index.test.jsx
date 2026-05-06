import { describe, it, expect } from 'vitest';

describe('index.html', () => {
  it('renders root div with id root', () => {
    const root = document.getElementById('root');
    expect(root).toBeTruthy();
  });

  it('includes Vite script injection', () => {
    const scripts = document.querySelectorAll("script[type='module']");
    expect(scripts.length).toBeGreaterThan(0);
  });

  it('sets correct meta charset and viewport', () => {
    const metaCharset = document.querySelector("meta[charset='UTF-8']");
    const metaViewport = document.querySelector("meta[name='viewport']");
    expect(metaCharset).toBeTruthy();
    expect(metaViewport).toBeTruthy();
  });
});