/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/jrs/': {
      target: 'https://i2.hanbell.com.cn/Hanbell-JRS/',
      changeOrigin: true,
      pathRewrite: {
        'jrs': '',
      },
    },
    '/wco/': {
      target: 'https://i2.hanbell.com.cn/Hanbell-WCO/',
      changeOrigin: true,
      pathRewrite: {
        'wco': '',
      },
    },
  },
  test: {
    '/api/': {
      target: 'https://i2.hanbell.com.cn/Hanbell-JRS/',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
};
