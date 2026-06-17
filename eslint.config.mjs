import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'data/snapshots/**'],
  },
  ...nextVitals,
]

export default eslintConfig
