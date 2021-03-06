/* eslint-disable complexity */
const MIN_BABEL_VERSION = 7;

module.exports = function preset(api, opts) {
  api.assertVersion(MIN_BABEL_VERSION);

  const transformRuntime = opts.transformRuntime || false;
  const useBuiltIns = opts.useBuiltIns || false;
  const angularSupport = opts.angular || false;
  const corejs = opts.corejs || '2';

  return {
    presets: [
      require('@babel/preset-react'),
      [require('@babel/preset-env'), {
        useBuiltIns,
        corejs,
        include: angularSupport
          ? ['transform-parameters'] // This fixes an issue with transforming Angular code like `constructor(...args)`
          : []
      }]
    ],
    plugins: [
      require('@babel/plugin-transform-strict-mode'),

      // Non-standard transformations
      require('@babel/plugin-proposal-class-properties'),
      require('@babel/plugin-proposal-optional-chaining'),

      /*
      For an unknown reason preset-env doesn't transform rest spread, e.g. `const foo = {...bar.foo, test: 123}`
      Probably because of this issue: https://github.com/babel/babel/issues/7215
       */
      require('@babel/plugin-proposal-object-rest-spread'),

      // Optional transformations
      angularSupport ? require('babel-plugin-angularjs-annotate') : null,
      transformRuntime ? require('@babel/plugin-transform-runtime') : null
    ].filter(it => !!it)
  };
};
