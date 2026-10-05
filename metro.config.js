const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Liga o NativeWind ao Metro, apontando para o nosso arquivo CSS.
module.exports = withNativeWind(config, { input: './src/global.css' });