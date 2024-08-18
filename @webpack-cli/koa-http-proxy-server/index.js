"use strict";
/*
 https://www.npmjs.com/package/http-proxy-middleware
https://www.npmjs.com/package/http-proxy-middleware

*/
const koaConnect = require("koa2-connect");
const {
  createProxyMiddleware,
  fixRequestBody
} = require("http-proxy-middleware");


module.exports = {
  createProxyMiddleware: function (context, options) {
    if ((context) instanceof Object) {
      options = context
      context = context.context
      delete options.context
    }

    var proxy = createProxyMiddleware(context, options);
    return async function (ctx, next) {
      ctx.req.body || (ctx.req.body = ctx.request.body);
      await koaConnect(proxy)(ctx, next);
    };
  },
  fixRequestBody
};
