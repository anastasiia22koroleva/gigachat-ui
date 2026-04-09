const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Прокси для обхода CORS при запросах к GigaChat из dev-сервера CRA.
 * В production настройте аналогичный прокси на веб-сервере или backend.
 */
module.exports = function setupProxy(app) {
  app.use(
    '/gigachat-api',
    createProxyMiddleware({
      target: 'https://gigachat.devices.sberbank.ru',
      changeOrigin: true,
      pathRewrite: { '^/gigachat-api': '/api' }
    })
  );
  app.use(
    '/gigachat-oauth',
    createProxyMiddleware({
      target: 'https://ngw.devices.sberbank.ru:9443',
      changeOrigin: true,
      pathRewrite: { '^/gigachat-oauth': '/api/v2' }
    })
  );
};
