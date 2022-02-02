var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// node_modules/@middy/core/index.js
var require_core = __commonJS({
  "node_modules/@middy/core/index.js"(exports, module2) {
    "use strict";
    var middy2 = (baseHandler = () => {
    }, plugin) => {
      var _plugin$beforePrefetc;
      plugin === null || plugin === void 0 ? void 0 : (_plugin$beforePrefetc = plugin.beforePrefetch) === null || _plugin$beforePrefetc === void 0 ? void 0 : _plugin$beforePrefetc.call(plugin);
      const beforeMiddlewares = [];
      const afterMiddlewares = [];
      const onErrorMiddlewares = [];
      const instance = (event = {}, context = {}) => {
        var _plugin$requestStart;
        plugin === null || plugin === void 0 ? void 0 : (_plugin$requestStart = plugin.requestStart) === null || _plugin$requestStart === void 0 ? void 0 : _plugin$requestStart.call(plugin);
        const request = {
          event,
          context,
          response: void 0,
          error: void 0,
          internal: {}
        };
        return runRequest(request, [...beforeMiddlewares], baseHandler, [...afterMiddlewares], [...onErrorMiddlewares], plugin);
      };
      instance.use = (middlewares) => {
        if (Array.isArray(middlewares)) {
          for (const middleware of middlewares) {
            instance.applyMiddleware(middleware);
          }
          return instance;
        }
        return instance.applyMiddleware(middlewares);
      };
      instance.applyMiddleware = (middleware) => {
        const {
          before,
          after,
          onError
        } = middleware;
        if (!before && !after && !onError) {
          throw new Error('Middleware must be an object containing at least one key among "before", "after", "onError"');
        }
        if (before)
          instance.before(before);
        if (after)
          instance.after(after);
        if (onError)
          instance.onError(onError);
        return instance;
      };
      instance.before = (beforeMiddleware) => {
        beforeMiddlewares.push(beforeMiddleware);
        return instance;
      };
      instance.after = (afterMiddleware) => {
        afterMiddlewares.unshift(afterMiddleware);
        return instance;
      };
      instance.onError = (onErrorMiddleware) => {
        onErrorMiddlewares.push(onErrorMiddleware);
        return instance;
      };
      instance.__middlewares = {
        before: beforeMiddlewares,
        after: afterMiddlewares,
        onError: onErrorMiddlewares
      };
      return instance;
    };
    var runRequest = async (request, beforeMiddlewares, baseHandler, afterMiddlewares, onErrorMiddlewares, plugin) => {
      try {
        await runMiddlewares(request, beforeMiddlewares, plugin);
        if (request.response === void 0) {
          var _plugin$beforeHandler, _plugin$afterHandler;
          plugin === null || plugin === void 0 ? void 0 : (_plugin$beforeHandler = plugin.beforeHandler) === null || _plugin$beforeHandler === void 0 ? void 0 : _plugin$beforeHandler.call(plugin);
          request.response = await baseHandler(request.event, request.context);
          plugin === null || plugin === void 0 ? void 0 : (_plugin$afterHandler = plugin.afterHandler) === null || _plugin$afterHandler === void 0 ? void 0 : _plugin$afterHandler.call(plugin);
          await runMiddlewares(request, afterMiddlewares, plugin);
        }
      } catch (e) {
        request.response = void 0;
        request.error = e;
        try {
          await runMiddlewares(request, onErrorMiddlewares, plugin);
        } catch (e2) {
          e2.originalError = request.error;
          request.error = e2;
          throw request.error;
        }
        if (request.response === void 0)
          throw request.error;
      } finally {
        var _plugin$requestEnd;
        await (plugin === null || plugin === void 0 ? void 0 : (_plugin$requestEnd = plugin.requestEnd) === null || _plugin$requestEnd === void 0 ? void 0 : _plugin$requestEnd.call(plugin, request));
      }
      return request.response;
    };
    var runMiddlewares = async (request, middlewares, plugin) => {
      for (const nextMiddleware of middlewares) {
        var _plugin$beforeMiddlew, _plugin$afterMiddlewa;
        plugin === null || plugin === void 0 ? void 0 : (_plugin$beforeMiddlew = plugin.beforeMiddleware) === null || _plugin$beforeMiddlew === void 0 ? void 0 : _plugin$beforeMiddlew.call(plugin, nextMiddleware === null || nextMiddleware === void 0 ? void 0 : nextMiddleware.name);
        const res = await (nextMiddleware === null || nextMiddleware === void 0 ? void 0 : nextMiddleware(request));
        plugin === null || plugin === void 0 ? void 0 : (_plugin$afterMiddlewa = plugin.afterMiddleware) === null || _plugin$afterMiddlewa === void 0 ? void 0 : _plugin$afterMiddlewa.call(plugin, nextMiddleware === null || nextMiddleware === void 0 ? void 0 : nextMiddleware.name);
        if (res !== void 0) {
          request.response = res;
          return;
        }
      }
    };
    module2.exports = middy2;
  }
});

// node_modules/@middy/util/codes.json
var require_codes = __commonJS({
  "node_modules/@middy/util/codes.json"(exports, module2) {
    module2.exports = {
      "100": "Continue",
      "101": "Switching Protocols",
      "102": "Processing",
      "103": "Early Hints",
      "200": "OK",
      "201": "Created",
      "202": "Accepted",
      "203": "Non-Authoritative Information",
      "204": "No Content",
      "205": "Reset Content",
      "206": "Partial Content",
      "207": "Multi-Status",
      "208": "Already Reported",
      "226": "IM Used",
      "300": "Multiple Choices",
      "301": "Moved Permanently",
      "302": "Found",
      "303": "See Other",
      "304": "Not Modified",
      "305": "Use Proxy",
      "306": "(Unused)",
      "307": "Temporary Redirect",
      "308": "Permanent Redirect",
      "400": "Bad Request",
      "401": "Unauthorized",
      "402": "Payment Required",
      "403": "Forbidden",
      "404": "Not Found",
      "405": "Method Not Allowed",
      "406": "Not Acceptable",
      "407": "Proxy Authentication Required",
      "408": "Request Timeout",
      "409": "Conflict",
      "410": "Gone",
      "411": "Length Required",
      "412": "Precondition Failed",
      "413": "Payload Too Large",
      "414": "URI Too Long",
      "415": "Unsupported Media Type",
      "416": "Range Not Satisfiable",
      "417": "Expectation Failed",
      "418": "I'm a teapot",
      "421": "Misdirected Request",
      "422": "Unprocessable Entity",
      "423": "Locked",
      "424": "Failed Dependency",
      "425": "Unordered Collection",
      "426": "Upgrade Required",
      "428": "Precondition Required",
      "429": "Too Many Requests",
      "431": "Request Header Fields Too Large",
      "451": "Unavailable For Legal Reasons",
      "500": "Internal Server Error",
      "501": "Not Implemented",
      "502": "Bad Gateway",
      "503": "Service Unavailable",
      "504": "Gateway Timeout",
      "505": "HTTP Version Not Supported",
      "506": "Variant Also Negotiates",
      "507": "Insufficient Storage",
      "508": "Loop Detected",
      "509": "Bandwidth Limit Exceeded",
      "510": "Not Extended",
      "511": "Network Authentication Required"
    };
  }
});

// node_modules/@middy/util/index.js
var require_util = __commonJS({
  "node_modules/@middy/util/index.js"(exports, module2) {
    "use strict";
    var {
      Agent
    } = require("https");
    var awsClientDefaultOptions = {
      httpOptions: {
        agent: new Agent({
          secureProtocol: "TLSv1_2_method"
        })
      }
    };
    var createPrefetchClient = (options) => {
      const awsClientOptions = __spreadValues(__spreadValues({}, awsClientDefaultOptions), options.awsClientOptions);
      const client = new options.AwsClient(awsClientOptions);
      if (options.awsClientCapture) {
        return options.awsClientCapture(client);
      }
      return client;
    };
    var createClient = async (options, request) => {
      let awsClientCredentials = {};
      if (options.awsClientAssumeRole) {
        if (!request)
          throw new Error("Request required when assuming role");
        awsClientCredentials = await getInternal({
          credentials: options.awsClientAssumeRole
        }, request);
      }
      awsClientCredentials = __spreadValues(__spreadValues({}, awsClientCredentials), options.awsClientOptions);
      return createPrefetchClient(__spreadProps(__spreadValues({}, options), {
        awsClientOptions: awsClientCredentials
      }));
    };
    var canPrefetch = (options) => {
      return !(options !== null && options !== void 0 && options.awsClientAssumeRole) && !(options !== null && options !== void 0 && options.disablePrefetch);
    };
    var getInternal = async (variables, request) => {
      if (!variables || !request)
        return {};
      let keys = [];
      let values = [];
      if (variables === true) {
        keys = values = Object.keys(request.internal);
      } else if (typeof variables === "string") {
        keys = values = [variables];
      } else if (Array.isArray(variables)) {
        keys = values = variables;
      } else if (typeof variables === "object") {
        keys = Object.keys(variables);
        values = Object.values(variables);
      }
      const promises = [];
      for (const internalKey of values) {
        var _valuePromise;
        const pathOptionKey = internalKey.split(".");
        const rootOptionKey = pathOptionKey.shift();
        let valuePromise = request.internal[rootOptionKey];
        if (typeof ((_valuePromise = valuePromise) === null || _valuePromise === void 0 ? void 0 : _valuePromise.then) !== "function") {
          valuePromise = Promise.resolve(valuePromise);
        }
        promises.push(valuePromise.then((value) => pathOptionKey.reduce((p, c) => p === null || p === void 0 ? void 0 : p[c], value)));
      }
      values = await Promise.allSettled(promises);
      const errors = values.filter((res) => res.status === "rejected").map((res) => res.reason.message);
      if (errors.length)
        throw new Error(JSON.stringify(errors));
      return keys.reduce((obj, key, index) => __spreadProps(__spreadValues({}, obj), {
        [sanitizeKey(key)]: values[index].value
      }), {});
    };
    var sanitizeKeyPrefixLeadingNumber = /^([0-9])/;
    var sanitizeKeyRemoveDisallowedChar = /[^a-zA-Z0-9]+/g;
    var sanitizeKey = (key) => {
      return key.replace(sanitizeKeyPrefixLeadingNumber, "_$1").replace(sanitizeKeyRemoveDisallowedChar, "_");
    };
    var cache = {};
    var processCache = (options, fetch = () => void 0, request) => {
      const {
        cacheExpiry,
        cacheKey
      } = options;
      if (cacheExpiry) {
        const cached = getCache(cacheKey);
        const unexpired = cached && (cacheExpiry < 0 || cached.expiry > Date.now());
        if (unexpired && cached.modified) {
          const value2 = fetch(request, cached.value);
          cache[cacheKey] = {
            value: __spreadValues(__spreadValues({}, cached.value), value2),
            expiry: cached.expiry
          };
          return cache[cacheKey];
        }
        if (unexpired) {
          return __spreadProps(__spreadValues({}, cached), {
            cache: true
          });
        }
      }
      const value = fetch(request);
      const expiry = Date.now() + cacheExpiry;
      if (cacheExpiry) {
        cache[cacheKey] = {
          value,
          expiry
        };
      }
      return {
        value,
        expiry
      };
    };
    var getCache = (key) => {
      return cache[key];
    };
    var modifyCache = (cacheKey, value) => {
      if (!cache[cacheKey])
        return;
      cache[cacheKey] = __spreadProps(__spreadValues({}, cache[cacheKey]), {
        value,
        modified: true
      });
    };
    var clearCache = (keys = null) => {
      var _keys;
      keys = (_keys = keys) !== null && _keys !== void 0 ? _keys : Object.keys(cache);
      if (!Array.isArray(keys))
        keys = [keys];
      for (const cacheKey of keys) {
        cache[cacheKey] = void 0;
      }
    };
    var jsonSafeParse = (string, reviver) => {
      if (typeof string !== "string")
        return string;
      const firstChar = string[0];
      if (firstChar !== "{" && firstChar !== "[" && firstChar !== '"')
        return string;
      try {
        return JSON.parse(string, reviver);
      } catch (e) {
      }
      return string;
    };
    var normalizeHttpResponse = (response) => {
      var _response$headers, _response;
      if (response === void 0) {
        response = {};
      } else if (Array.isArray(response) || typeof response !== "object" || response === null) {
        response = {
          body: response
        };
      }
      response.headers = (_response$headers = (_response = response) === null || _response === void 0 ? void 0 : _response.headers) !== null && _response$headers !== void 0 ? _response$headers : {};
      return response;
    };
    var statuses = require_codes();
    var {
      inherits
    } = require("util");
    var createErrorRegexp = /[^a-zA-Z]/g;
    var createError = (code, message, properties = {}) => {
      const name = statuses[code].replace(createErrorRegexp, "");
      const className = name.substr(-5) !== "Error" ? name + "Error" : name;
      function HttpError(message2) {
        const msg = message2 !== null && message2 !== void 0 ? message2 : statuses[code];
        const err = new Error(msg);
        Error.captureStackTrace(err, HttpError);
        Object.setPrototypeOf(err, HttpError.prototype);
        Object.defineProperty(err, "message", {
          enumerable: true,
          configurable: true,
          value: msg,
          writable: true
        });
        Object.defineProperty(err, "name", {
          enumerable: false,
          configurable: true,
          value: className,
          writable: true
        });
        return err;
      }
      inherits(HttpError, Error);
      const desc = Object.getOwnPropertyDescriptor(HttpError, "name");
      desc.value = className;
      Object.defineProperty(HttpError, "name", desc);
      Object.assign(HttpError.prototype, {
        status: code,
        statusCode: code,
        expose: code < 500
      }, properties);
      return new HttpError(message);
    };
    module2.exports = {
      createPrefetchClient,
      createClient,
      canPrefetch,
      getInternal,
      sanitizeKey,
      processCache,
      getCache,
      modifyCache,
      clearCache,
      jsonSafeParse,
      normalizeHttpResponse,
      createError
    };
  }
});

// node_modules/@middy/http-json-body-parser/index.js
var require_http_json_body_parser = __commonJS({
  "node_modules/@middy/http-json-body-parser/index.js"(exports, module2) {
    "use strict";
    var mimePattern = /^application\/(.+\+)?json(;.*)?$/;
    var defaults = {
      reviver: void 0
    };
    var httpJsonBodyParserMiddleware = (opts = {}) => {
      const options = __spreadValues(__spreadValues({}, defaults), opts);
      const httpJsonBodyParserMiddlewareBefore = async (request) => {
        var _headers$ContentType;
        const {
          headers,
          body
        } = request.event;
        const contentTypeHeader = (_headers$ContentType = headers === null || headers === void 0 ? void 0 : headers["Content-Type"]) !== null && _headers$ContentType !== void 0 ? _headers$ContentType : headers === null || headers === void 0 ? void 0 : headers["content-type"];
        if (mimePattern.test(contentTypeHeader)) {
          try {
            const data = request.event.isBase64Encoded ? Buffer.from(body, "base64").toString() : body;
            request.event.rawBody = body;
            request.event.body = JSON.parse(data, options.reviver);
          } catch (err) {
            const {
              createError
            } = require_util();
            throw createError(422, "Content type defined as JSON but an invalid JSON was provided");
          }
        }
      };
      return {
        before: httpJsonBodyParserMiddlewareBefore
      };
    };
    module2.exports = httpJsonBodyParserMiddleware;
  }
});

// node_modules/@honeybadger-io/js/dist/server/honeybadger.js
var require_honeybadger = __commonJS({
  "node_modules/@honeybadger-io/js/dist/server/honeybadger.js"(exports, module2) {
    "use strict";
    var https = require("https");
    var http = require("http");
    var url = require("url");
    var os = require("os");
    var fs = require("fs");
    var domain = require("domain");
    function _interopDefaultLegacy(e) {
      return e && typeof e === "object" && "default" in e ? e : { "default": e };
    }
    var https__default = /* @__PURE__ */ _interopDefaultLegacy(https);
    var http__default = /* @__PURE__ */ _interopDefaultLegacy(http);
    var url__default = /* @__PURE__ */ _interopDefaultLegacy(url);
    var os__default = /* @__PURE__ */ _interopDefaultLegacy(os);
    var fs__default = /* @__PURE__ */ _interopDefaultLegacy(fs);
    var domain__default = /* @__PURE__ */ _interopDefaultLegacy(domain);
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    function __extends(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function() {
      __assign = Object.assign || function __assign2(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var UNKNOWN_FUNCTION = "<unknown>";
    function parse(stackString) {
      var lines = stackString.split("\n");
      return lines.reduce(function(stack, line) {
        var parseResult = parseChrome(line) || parseWinjs(line) || parseGecko(line) || parseNode(line) || parseJSC(line);
        if (parseResult) {
          stack.push(parseResult);
        }
        return stack;
      }, []);
    }
    var chromeRe = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\/|[a-z]:\\|\\\\).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
    var chromeEvalRe = /\((\S*)(?::(\d+))(?::(\d+))\)/;
    function parseChrome(line) {
      var parts = chromeRe.exec(line);
      if (!parts) {
        return null;
      }
      var isNative = parts[2] && parts[2].indexOf("native") === 0;
      var isEval = parts[2] && parts[2].indexOf("eval") === 0;
      var submatch = chromeEvalRe.exec(parts[2]);
      if (isEval && submatch != null) {
        parts[2] = submatch[1];
        parts[3] = submatch[2];
        parts[4] = submatch[3];
      }
      return {
        file: !isNative ? parts[2] : null,
        methodName: parts[1] || UNKNOWN_FUNCTION,
        arguments: isNative ? [parts[2]] : [],
        lineNumber: parts[3] ? +parts[3] : null,
        column: parts[4] ? +parts[4] : null
      };
    }
    var winjsRe = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
    function parseWinjs(line) {
      var parts = winjsRe.exec(line);
      if (!parts) {
        return null;
      }
      return {
        file: parts[2],
        methodName: parts[1] || UNKNOWN_FUNCTION,
        arguments: [],
        lineNumber: +parts[3],
        column: parts[4] ? +parts[4] : null
      };
    }
    var geckoRe = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
    var geckoEvalRe = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
    function parseGecko(line) {
      var parts = geckoRe.exec(line);
      if (!parts) {
        return null;
      }
      var isEval = parts[3] && parts[3].indexOf(" > eval") > -1;
      var submatch = geckoEvalRe.exec(parts[3]);
      if (isEval && submatch != null) {
        parts[3] = submatch[1];
        parts[4] = submatch[2];
        parts[5] = null;
      }
      return {
        file: parts[3],
        methodName: parts[1] || UNKNOWN_FUNCTION,
        arguments: parts[2] ? parts[2].split(",") : [],
        lineNumber: parts[4] ? +parts[4] : null,
        column: parts[5] ? +parts[5] : null
      };
    }
    var javaScriptCoreRe = /^\s*(?:([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i;
    function parseJSC(line) {
      var parts = javaScriptCoreRe.exec(line);
      if (!parts) {
        return null;
      }
      return {
        file: parts[3],
        methodName: parts[1] || UNKNOWN_FUNCTION,
        arguments: [],
        lineNumber: +parts[4],
        column: parts[5] ? +parts[5] : null
      };
    }
    var nodeRe = /^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;
    function parseNode(line) {
      var parts = nodeRe.exec(line);
      if (!parts) {
        return null;
      }
      return {
        file: parts[2],
        methodName: parts[1] || UNKNOWN_FUNCTION,
        arguments: [],
        lineNumber: +parts[3],
        column: parts[4] ? +parts[4] : null
      };
    }
    function merge(obj1, obj2) {
      var result = {};
      for (var k in obj1) {
        result[k] = obj1[k];
      }
      for (var k in obj2) {
        result[k] = obj2[k];
      }
      return result;
    }
    function mergeNotice(notice1, notice2) {
      var result = merge(notice1, notice2);
      if (notice1.context && notice2.context) {
        result.context = merge(notice1.context, notice2.context);
      }
      return result;
    }
    function objectIsEmpty(obj) {
      for (var k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          return false;
        }
      }
      return true;
    }
    function makeBacktrace(stack, shift) {
      if (shift === void 0) {
        shift = 0;
      }
      try {
        var backtrace = parse(stack).map(function(line) {
          return {
            file: line.file,
            method: line.methodName,
            number: line.lineNumber,
            column: line.column
          };
        });
        backtrace.splice(0, shift);
        return backtrace;
      } catch (_err) {
        return [];
      }
    }
    function runBeforeNotifyHandlers(notice, handlers) {
      for (var i = 0, len = handlers.length; i < len; i++) {
        var handler = handlers[i];
        if (handler(notice) === false) {
          return false;
        }
      }
      return true;
    }
    function runAfterNotifyHandlers(notice, handlers, error) {
      if (error === void 0) {
        error = void 0;
      }
      for (var i = 0, len = handlers.length; i < len; i++) {
        handlers[i](error, notice);
      }
      return true;
    }
    function newObject(obj) {
      if (typeof obj !== "object" || obj === null) {
        return {};
      }
      var result = {};
      for (var k in obj) {
        result[k] = obj[k];
      }
      return result;
    }
    function sanitize(obj, maxDepth) {
      if (maxDepth === void 0) {
        maxDepth = 8;
      }
      var seenObjects = [];
      function seen(obj2) {
        if (!obj2 || typeof obj2 !== "object") {
          return false;
        }
        for (var i = 0; i < seenObjects.length; i++) {
          var value = seenObjects[i];
          if (value === obj2) {
            return true;
          }
        }
        seenObjects.push(obj2);
        return false;
      }
      function canSerialize(obj2) {
        if (/function|symbol/.test(typeof obj2)) {
          return false;
        }
        if (obj2 === null) {
          return false;
        }
        if (typeof obj2 === "object" && typeof obj2.hasOwnProperty === "undefined") {
          return false;
        }
        return true;
      }
      function serialize(obj2, depth) {
        if (depth === void 0) {
          depth = 0;
        }
        if (depth >= maxDepth) {
          return "[DEPTH]";
        }
        if (!canSerialize(obj2)) {
          return Object.prototype.toString.call(obj2);
        }
        if (seen(obj2)) {
          return "[RECURSION]";
        }
        if (Array.isArray(obj2)) {
          return obj2.map(function(o) {
            return serialize(o, depth + 1);
          });
        }
        if (typeof obj2 === "object") {
          var ret = {};
          for (var k in obj2) {
            var v = obj2[k];
            if (Object.prototype.hasOwnProperty.call(obj2, k) && k != null && v != null) {
              ret[k] = serialize(v, depth + 1);
            }
          }
          return ret;
        }
        return obj2;
      }
      return serialize(obj);
    }
    function logger(client) {
      var log = function(method) {
        return function() {
          var _a;
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          if (method === "debug" && !client.config.debug) {
            return;
          }
          args.unshift("[Honeybadger]");
          (_a = client.config.logger)[method].apply(_a, args);
        };
      };
      return {
        log: log("log"),
        info: log("info"),
        debug: log("debug"),
        warn: log("warn"),
        error: log("error")
      };
    }
    function makeNotice(thing) {
      var notice;
      if (!thing) {
        notice = {};
      } else if (Object.prototype.toString.call(thing) === "[object Error]") {
        var e = thing;
        notice = merge(thing, { name: e.name, message: e.message, stack: e.stack });
      } else if (typeof thing === "object") {
        notice = newObject(thing);
      } else {
        var m = String(thing);
        notice = { message: m };
      }
      return notice;
    }
    function endpoint(config, path) {
      var endpoint2 = config.endpoint.trim().replace(/\/$/, "");
      path = path.trim().replace(/(^\/|\/$)/g, "");
      return endpoint2 + "/" + path;
    }
    function generateStackTrace() {
      try {
        throw new Error("");
      } catch (e) {
        if (e.stack) {
          return e.stack;
        }
      }
      var maxStackSize = 10;
      var stack = [];
      var curr = arguments.callee;
      while (curr && stack.length < maxStackSize) {
        if (/function(?:\s+([\w$]+))+\s*\(/.test(curr.toString())) {
          stack.push(RegExp.$1 || "<anonymous>");
        } else {
          stack.push("<anonymous>");
        }
        try {
          curr = curr.caller;
        } catch (e) {
          break;
        }
      }
      return stack.join("\n");
    }
    function filter(obj, filters) {
      if (!is("Object", obj)) {
        return;
      }
      if (!is("Array", filters)) {
        filters = [];
      }
      var seen = [];
      function filter2(obj2) {
        var k, newObj;
        if (is("Object", obj2) || is("Array", obj2)) {
          if (seen.indexOf(obj2) !== -1) {
            return "[CIRCULAR DATA STRUCTURE]";
          }
          seen.push(obj2);
        }
        if (is("Object", obj2)) {
          newObj = {};
          for (k in obj2) {
            if (filterMatch(k, filters)) {
              newObj[k] = "[FILTERED]";
            } else {
              newObj[k] = filter2(obj2[k]);
            }
          }
          return newObj;
        }
        if (is("Array", obj2)) {
          return obj2.map(function(v) {
            return filter2(v);
          });
        }
        if (is("Function", obj2)) {
          return "[FUNC]";
        }
        return obj2;
      }
      return filter2(obj);
    }
    function filterMatch(key, filters) {
      for (var i = 0; i < filters.length; i++) {
        if (key.toLowerCase().indexOf(filters[i].toLowerCase()) !== -1) {
          return true;
        }
      }
      return false;
    }
    function is(type, obj) {
      var klass = Object.prototype.toString.call(obj).slice(8, -1);
      return obj !== void 0 && obj !== null && klass === type;
    }
    function filterUrl(url2, filters) {
      if (!filters) {
        return url2;
      }
      if (typeof url2 !== "string") {
        return url2;
      }
      var query = url2.split(/\?/, 2)[1];
      if (!query) {
        return url2;
      }
      var result = url2;
      query.split(/[&]\s?/).forEach(function(pair) {
        var _a = pair.split("=", 2), key = _a[0], value = _a[1];
        if (filterMatch(key, filters)) {
          result = result.replace(key + "=" + value, key + "=[FILTERED]");
        }
      });
      return result;
    }
    function formatCGIData(vars, prefix) {
      if (prefix === void 0) {
        prefix = "";
      }
      var formattedVars = {};
      Object.keys(vars).forEach(function(key) {
        var formattedKey = prefix + key.replace(/\W/g, "_").toUpperCase();
        formattedVars[formattedKey] = vars[key];
      });
      return formattedVars;
    }
    var notifier = {
      name: "honeybadger-js",
      url: "https://github.com/honeybadger-io/honeybadger-js",
      version: "3.2.7"
    };
    var TAG_SEPARATOR = /,/;
    var TAG_SANITIZER = /[^\w]/g;
    var STRING_EMPTY = "";
    var NOT_BLANK = /\S/;
    var Client = function() {
      function Client2(opts) {
        if (opts === void 0) {
          opts = {};
        }
        this.__pluginsExecuted = false;
        this.__context = {};
        this.__breadcrumbs = [];
        this.__beforeNotifyHandlers = [];
        this.__afterNotifyHandlers = [];
        this.config = __assign({ apiKey: null, endpoint: "https://api.honeybadger.io", environment: null, hostname: null, projectRoot: null, component: null, action: null, revision: null, reportData: null, breadcrumbsEnabled: true, maxBreadcrumbs: 40, maxObjectDepth: 8, logger: console, developmentEnvironments: ["dev", "development", "test"], disabled: false, debug: false, tags: null, enableUncaught: true, enableUnhandledRejection: true, afterUncaught: function() {
          return true;
        }, filters: ["creditcard", "password"], __plugins: [] }, opts);
        this.logger = logger(this);
      }
      Client2.prototype.factory = function(_opts) {
        throw new Error("Must implement __factory in subclass");
      };
      Client2.prototype.getVersion = function() {
        return notifier.version;
      };
      Client2.prototype.configure = function(opts) {
        var _this = this;
        if (opts === void 0) {
          opts = {};
        }
        for (var k in opts) {
          this.config[k] = opts[k];
        }
        if (!this.__pluginsExecuted) {
          this.__pluginsExecuted = true;
          this.config.__plugins.forEach(function(plugin) {
            return plugin.load(_this);
          });
        }
        return this;
      };
      Client2.prototype.beforeNotify = function(handler) {
        this.__beforeNotifyHandlers.push(handler);
        return this;
      };
      Client2.prototype.afterNotify = function(handler) {
        this.__afterNotifyHandlers.push(handler);
        return this;
      };
      Client2.prototype.setContext = function(context) {
        if (typeof context === "object") {
          this.__context = merge(this.__context, context);
        }
        return this;
      };
      Client2.prototype.resetContext = function(context) {
        this.logger.warn("Deprecation warning: `Honeybadger.resetContext()` has been deprecated; please use `Honeybadger.clear()` instead.");
        if (typeof context === "object" && context !== null) {
          this.__context = merge({}, context);
        } else {
          this.__context = {};
        }
        return this;
      };
      Client2.prototype.clear = function() {
        this.__context = {};
        this.__breadcrumbs = [];
        return this;
      };
      Client2.prototype.notify = function(notice, name, extra) {
        if (name === void 0) {
          name = void 0;
        }
        if (extra === void 0) {
          extra = void 0;
        }
        if (this.config.disabled) {
          this.logger.warn("Deprecation warning: instead of `disabled: true`, use `reportData: false` to explicitly disable Honeybadger reporting. (Dropping notice: honeybadger.js is disabled)");
          return false;
        }
        if (!this.__reportData()) {
          this.logger.debug("Dropping notice: honeybadger.js is in development mode");
          return false;
        }
        if (!this.config.apiKey) {
          this.logger.warn("Unable to send error report: no API key has been configured");
          return false;
        }
        notice = makeNotice(notice);
        if (name && !(typeof name === "object")) {
          var n = String(name);
          name = { name: n };
        }
        if (name) {
          notice = mergeNotice(notice, name);
        }
        if (typeof extra === "object" && extra !== null) {
          notice = mergeNotice(notice, extra);
        }
        if (objectIsEmpty(notice)) {
          return false;
        }
        var noticeTags = this.__constructTags(notice.tags);
        var contextTags = this.__constructTags(this.__context["tags"]);
        var configTags = this.__constructTags(this.config.tags);
        var tags = noticeTags.concat(contextTags).concat(configTags);
        var uniqueTags = tags.filter(function(item, index) {
          return tags.indexOf(item) === index;
        });
        notice = merge(notice, {
          name: notice.name || "Error",
          context: merge(this.__context, notice.context),
          projectRoot: notice.projectRoot || this.config.projectRoot,
          environment: notice.environment || this.config.environment,
          component: notice.component || this.config.component,
          action: notice.action || this.config.action,
          revision: notice.revision || this.config.revision,
          tags: uniqueTags
        });
        var backtraceShift = 0;
        if (typeof notice.stack !== "string" || !notice.stack.trim()) {
          notice.stack = generateStackTrace();
          backtraceShift = 2;
        }
        notice.backtrace = makeBacktrace(notice.stack, backtraceShift);
        if (!runBeforeNotifyHandlers(notice, this.__beforeNotifyHandlers)) {
          return false;
        }
        this.addBreadcrumb("Honeybadger Notice", {
          category: "notice",
          metadata: {
            message: notice.message,
            name: notice.name,
            stack: notice.stack
          }
        });
        notice.__breadcrumbs = this.config.breadcrumbsEnabled ? this.__breadcrumbs.slice() : [];
        return this.__send(notice);
      };
      Client2.prototype.addBreadcrumb = function(message, opts) {
        if (!this.config.breadcrumbsEnabled) {
          return;
        }
        opts = opts || {};
        var metadata = newObject(opts.metadata);
        var category = opts.category || "custom";
        var timestamp = new Date().toISOString();
        this.__breadcrumbs.push({
          category,
          message,
          metadata,
          timestamp
        });
        var limit = this.config.maxBreadcrumbs;
        if (this.__breadcrumbs.length > limit) {
          this.__breadcrumbs = this.__breadcrumbs.slice(this.__breadcrumbs.length - limit);
        }
        return this;
      };
      Client2.prototype.__reportData = function() {
        if (this.config.reportData !== null) {
          return this.config.reportData;
        }
        return !(this.config.environment && this.config.developmentEnvironments.includes(this.config.environment));
      };
      Client2.prototype.__send = function(_notice) {
        throw new Error("Must implement send in subclass");
      };
      Client2.prototype.__buildPayload = function(notice) {
        var headers = filter(notice.headers, this.config.filters) || {};
        var cgiData = filter(__assign(__assign({}, notice.cgiData), formatCGIData(headers, "HTTP_")), this.config.filters);
        return {
          notifier,
          breadcrumbs: {
            enabled: !!this.config.breadcrumbsEnabled,
            trail: notice.__breadcrumbs || []
          },
          error: {
            class: notice.name,
            message: notice.message,
            backtrace: notice.backtrace,
            fingerprint: notice.fingerprint,
            tags: notice.tags
          },
          request: {
            url: filterUrl(notice.url, this.config.filters),
            component: notice.component,
            action: notice.action,
            context: notice.context,
            cgi_data: cgiData,
            params: filter(notice.params, this.config.filters) || {},
            session: filter(notice.session, this.config.filters) || {}
          },
          server: {
            project_root: notice.projectRoot,
            environment_name: notice.environment,
            revision: notice.revision,
            hostname: this.config.hostname,
            time: new Date().toUTCString()
          },
          details: notice.details || {}
        };
      };
      Client2.prototype.__constructTags = function(tags) {
        if (!tags) {
          return [];
        }
        return tags.toString().split(TAG_SEPARATOR).map(function(tag) {
          return tag.replace(TAG_SANITIZER, STRING_EMPTY);
        }).filter(function(tag) {
          return NOT_BLANK.test(tag);
        });
      };
      return Client2;
    }();
    function fatallyLogAndExit(err) {
      console.error("[Honeybadger] Exiting process due to uncaught exception");
      console.error(err.stack || err);
      process.exit(1);
    }
    function getStats(cb) {
      var load = os__default["default"].loadavg(), stats = {
        load: {
          one: load[0],
          five: load[1],
          fifteen: load[2]
        },
        mem: {}
      };
      if (fs__default["default"].existsSync("/proc/meminfo")) {
        return fs__default["default"].readFile("/proc/meminfo", "utf8", parseStats);
      }
      fallback();
      function parseStats(err, memData) {
        if (err)
          return fallback();
        var data = memData.split("\n").slice(0, 4);
        var results = data.map(function(i) {
          return parseInt(/\s+(\d+)\skB/i.exec(i)[1], 10) / 1024;
        });
        stats.mem = {
          total: results[0],
          free: results[1],
          buffers: results[2],
          cached: results[3],
          free_total: results[1] + results[2] + results[3]
        };
        return cb(stats);
      }
      function fallback() {
        stats.mem = {
          free: os__default["default"].freemem(),
          total: os__default["default"].totalmem()
        };
        return cb(stats);
      }
    }
    var count = 0;
    function uncaughtException() {
      return {
        load: function(client) {
          if (!client.config.enableUncaught) {
            return;
          }
          process.on("uncaughtException", function(uncaughtError) {
            if (count > 1) {
              fatallyLogAndExit(uncaughtError);
            }
            if (client.config.enableUncaught) {
              client.notify(uncaughtError, {
                afterNotify: function(_err, _notice) {
                  count += 1;
                  client.config.afterUncaught(uncaughtError);
                }
              });
            } else {
              count += 1;
              client.config.afterUncaught(uncaughtError);
            }
          });
        }
      };
    }
    function unhandledRejection() {
      return {
        load: function(client) {
          if (!client.config.enableUnhandledRejection) {
            return;
          }
          process.on("unhandledRejection", function(reason, _promise) {
            if (!client.config.enableUnhandledRejection) {
              return;
            }
            client.notify(reason, { component: "unhandledRejection" });
          });
        }
      };
    }
    function fullUrl(req) {
      var connection = req.connection;
      var address = connection && connection.address();
      var port = address ? address.port : void 0;
      return url__default["default"].format({
        protocol: req.protocol,
        hostname: req.hostname,
        port,
        pathname: req.path,
        query: req.query
      });
    }
    function requestHandler(req, res, next) {
      this.clear();
      var dom = domain__default["default"].create();
      dom.on("error", next);
      dom.run(next);
    }
    function errorHandler(err, req, _res, next) {
      this.notify(err, {
        url: fullUrl(req),
        params: req.body,
        session: req.session,
        headers: req.headers,
        cgiData: {
          REQUEST_METHOD: req.method
        }
      });
      return next(err);
    }
    function lambdaHandler2(handler) {
      return function lambdaHandler3(event, context, callback) {
        var shouldInvokeCallbackExplicitly = handler.length < 3;
        var args = arguments;
        var dom = domain__default["default"].create();
        var hb = this;
        var hbHandler = function(err) {
          var willNotify = hb.notify(err, {
            afterNotify: function() {
              hb.clear();
              callback(err);
            }
          });
          if (!willNotify) {
            callback(err);
          }
        };
        dom.on("error", hbHandler);
        dom.run(function() {
          process.nextTick(function() {
            Promise.resolve(handler.apply(this, args)).then(function(res) {
              hb.clear();
              if (shouldInvokeCallbackExplicitly) {
                callback(null, res);
              }
            }).catch(hbHandler);
          });
        });
      }.bind(this);
    }
    var Honeybadger2 = function(_super) {
      __extends(Honeybadger3, _super);
      function Honeybadger3(opts) {
        if (opts === void 0) {
          opts = {};
        }
        var _this = _super.call(this, __assign({ afterUncaught: fatallyLogAndExit, projectRoot: process.cwd(), hostname: os__default["default"].hostname() }, opts)) || this;
        _this.__beforeNotifyHandlers = [
          function(notice) {
            notice.backtrace.forEach(function(line) {
              if (line.file) {
                line.file = line.file.replace(/.*\/node_modules\/(.+)/, "[NODE_MODULES]/$1");
                line.file = line.file.replace(notice.projectRoot, "[PROJECT_ROOT]");
              }
              return line;
            });
          }
        ];
        _this.errorHandler = errorHandler.bind(_this);
        _this.requestHandler = requestHandler.bind(_this);
        _this.lambdaHandler = lambdaHandler2.bind(_this);
        return _this;
      }
      Honeybadger3.prototype.factory = function(opts) {
        return new Honeybadger3(opts);
      };
      Honeybadger3.prototype.__send = function(notice) {
        var _this = this;
        var protocol = new url.URL(this.config.endpoint).protocol;
        var transport = protocol === "http:" ? http__default["default"] : https__default["default"];
        var payload = this.__buildPayload(notice);
        payload.server.pid = process.pid;
        var handlers = Array.prototype.slice.call(this.__afterNotifyHandlers);
        if (notice.afterNotify) {
          handlers.unshift(notice.afterNotify);
        }
        getStats(function(stats) {
          payload.server.stats = stats;
          var data = Buffer.from(JSON.stringify(sanitize(payload, _this.config.maxObjectDepth)), "utf8");
          var options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": data.length,
              "X-API-Key": _this.config.apiKey
            }
          };
          var req = transport.request(endpoint(_this.config, "/v1/notices/js"), options, function(res) {
            _this.logger.debug("statusCode: " + res.statusCode);
            var body = "";
            res.on("data", function(chunk) {
              body += chunk;
            });
            res.on("end", function() {
              if (res.statusCode !== 201) {
                runAfterNotifyHandlers(notice, handlers, new Error("Bad HTTP response: " + res.statusCode));
                _this.logger.warn("Error report failed: unknown response from server. code=" + res.statusCode);
                return;
              }
              var uuid = JSON.parse(body).id;
              runAfterNotifyHandlers(merge(notice, {
                id: uuid
              }), handlers);
              _this.logger.info("Error report sent.", "id=" + uuid);
            });
          });
          req.on("error", function(err) {
            _this.logger.error("Error report failed: an unknown error occurred.", "message=" + err.message);
            runAfterNotifyHandlers(notice, handlers, err);
          });
          req.write(data);
          req.end();
        });
        return true;
      };
      return Honeybadger3;
    }(Client);
    var server = new Honeybadger2({
      __plugins: [
        uncaughtException(),
        unhandledRejection()
      ]
    });
    module2.exports = server;
  }
});

// src/functions/fn/handler.ts
var handler_exports = {};
__export(handler_exports, {
  main: () => main
});

// src/libs/apiGateway.ts
var formatJSONResponse = (response) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};

// src/libs/lambda.ts
var import_core = __toESM(require_core());
var import_http_json_body_parser = __toESM(require_http_json_body_parser());
var middyfy = (handler) => {
  return (0, import_core.default)(handler).use((0, import_http_json_body_parser.default)());
};

// src/functions/fn/handler.ts
var Honeybadger = __toESM(require_honeybadger());
Honeybadger.configure({ apiKey: "test" });
var fn = async () => {
  Honeybadger.notify("message", {
    name: "name",
    component: "component",
    action: "action",
    params: {}
  });
  return formatJSONResponse({ success: true });
};
var main = Honeybadger.lambdaHandler(middyfy(fn));
module.exports = __toCommonJS(handler_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
//# sourceMappingURL=handler.js.map
