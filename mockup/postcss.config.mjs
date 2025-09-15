// Rename from postcss.config.js to postcss.config.mjs
import tailwindcss from '@tailwindcss/postcss';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';

export default {
  plugins: {
    'postcss-import': postcssImport,
    '@tailwindcss/postcss': {
      config: './tailwind.config.js',
    },
    'autoprefixer': autoprefixer,
  },
};