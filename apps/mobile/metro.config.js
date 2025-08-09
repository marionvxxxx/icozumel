const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add web support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Handle react-native-maps for web
config.resolver.alias = {
  'react-native-maps': 'react-native-web-maps',
};

module.exports = config;