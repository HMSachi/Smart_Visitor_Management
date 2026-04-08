const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://visitormanagement.dockyardsoftware.com',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/api': '',
      },
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Origin', 'https://visitormanagement.dockyardsoftware.com');
      },
    })
  );
};
