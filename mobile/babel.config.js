module.exports = {
  presets: ['module:@react-native/babel-preset', '@babel/preset-typescript'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          // This needs to be mirrored in tsconfig.json
          '@page': './src/pages',
          '@zustand': './src/zustand',
          '@routes': './src/routes',
          '@components': './src/components',
          '@requests': './src/requests',
          '@mobile-types': './src/types',
          '@utils': './src/utils',
          '@styles': './src/styles',
          '@assets': './src/assets/',
          '@hooks': './src/hooks/',
          '@blocks': './src/blocks/',
          '@locales': './src/locales/',
          '@config': './src/config/',
        },
      },
    ],
  ],
};
