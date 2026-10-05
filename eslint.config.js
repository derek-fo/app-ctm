// eslint.config.js
// Arquivos de configuração de ferramentas costumam continuar em JavaScript,
// porque as próprias ferramentas leem esse formato com mais facilidade.
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = defineConfig([
  // Regras recomendadas pelo Expo (inclui regras de React e de hooks).
  expoConfig,
  // Desliga as regras de ESLint que brigariam com o Prettier.
  // Assim, o ESLint cuida de problemas e o Prettier cuida da formatação.
  eslintConfigPrettier,
  // Pastas que o ESLint deve ignorar.
  { ignores: ['dist/*', 'android/*', 'ios/*'] },
]);
