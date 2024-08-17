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
  createProxyMiddleware: function (context, option) {
    // if (typeof options == "string") {
    //      options = { target: options };
    // }


    console.log('option==========',option)
    console.log('context==========',option)

    var proxy = createProxyMiddleware(context, option);

    return async function (ctx, next) {
      ctx.req.body || (ctx.req.body = ctx.request.body);
      await koaConnect(proxy)(ctx, next);
    };
  },
  fixRequestBody
};
