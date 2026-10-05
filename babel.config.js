module.exports = function (api) {
  // Guarda o resultado da configuração em cache para builds mais rápidos.
  api.cache(true);
  return {
    presets: [
      // O preset padrão do Expo, avisando que o JSX deve passar pelo NativeWind.
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};