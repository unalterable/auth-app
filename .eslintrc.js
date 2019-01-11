module.exports = {
  'env': {
    'node': true,
    'browser': true,
    'commonjs': true,
    'es6': true,
    'mocha': true,
  },
  'plugins': ['react'],
  'extends': ['eslint:recommended', 'plugin:react/recommended'],
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaVersion': 2018,
    'ecmaFeatures': { 'jsx': true },
    'sourceType': 'module'
  },
  'rules': {
    'no-console': [2, { 'allow': ['info', 'error'] }],
    'react/jsx-uses-react': 1,
    'react/prop-types': 0,
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'ignore'
    }],
  },
};
