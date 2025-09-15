import { afterEach, expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

// Extend Vitest's expect with Jest DOM matchers
expect.extend(matchers);

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});
