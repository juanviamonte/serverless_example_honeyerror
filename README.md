# Quick up & running

1. Use your fav node package manager
$ nvm use 14;    <- tested with node 14
$ `yarn` or `npm i`
$ `yarn start` 


2. Serverless can be installed globally
$ npm i -g serverless or yarn add serverless

3. After yarn start success:
```

   ┌──────────────────────────────────────────────────────────────────────┐
   │                                                                      │
   │   POST | http://localhost:3003/localhost/test                        │
   │   POST | http://localhost:3003/2015-03-31/functions/fn/invocations   │
   │                                                                      │
   └──────────────────────────────────────────────────────────────────────┘

Server ready: http://localhost:3003 🚀

```
4. Use postman or other HTTP Client to interact

(Set empty {}) body in JSON format for the request
Postman (body -> raw JSON) value -> {}

POST http://localhost:3003/localhost/test 

The response will return `502Bad Gateway`

The error logs in the terminal will display the following:

```
✖ Cannot set property __pluginsExecuted of #<Honeybadger3> which has only a getter
✖ TypeError: Cannot set property __pluginsExecuted of #<Honeybadger3> which has only a getter
      at Honeybadger3.Client2.configure (/Users/juanviamonte/Projects/serverless-honeybadger-example/.esbuild/.build/src/functions/fn/handler.js:955:34)
      at Object.<anonymous> (/Users/juanviamonte/Projects/serverless-honeybadger-example/.esbuild/.build/src/functions/fn/handler.js:1389:13)
      at Module._compile (internal/modules/cjs/loader.js:1072:14)
      at Object.Module._extensions..js (internal/modules/cjs/loader.js:1101:10)
      at Module.load (internal/modules/cjs/loader.js:937:32)
      at Function.Module._load (internal/modules/cjs/loader.js:778:12)
      at Module.require (internal/modules/cjs/loader.js:961:19)
      at require (internal/modules/cjs/helpers.js:92:18)
      at /Users/juanviamonte/Projects/serverless-honeybadger-example/node_modules/serverless-offline/dist/lambda/handler-runner/in-process-runner/InProcessRunner.js:157:133
      at processTicksAndRejections (internal/process/task_queues.js:95:5)
      at async InProcessRunner.run (/Users/juanviamonte/Projects/serverless-honeybadger-example/node_modules/serverless-offline/dist/lambda/handler-runner/in-process-runner/InProcessRunner.js:157:9)
```
