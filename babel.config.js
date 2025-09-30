/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

module.exports = {
  plugins: [
    [
      require('./scripts/error-codes/transform-error-messages'),
      // 禁用错误信息的压缩/简化处理
      {noMinify: true},
    ],
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    ['@babel/preset-react', {runtime: 'automatic'}],
    '@babel/preset-flow',
  ],
};
