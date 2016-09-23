# Revolut Currency Exchange Form - Web Version

This is a demo currency exchange form similar in the look to what can be found in the mobile Revolut app. It is  based on `Node.js`+`Express` server-side and `React.js` + `Reflux` on the front-end. `webpack` with `babel` is used to transpile (ES6/7 -> ES5) and compress code before delivery to the client (browser). 

The whole idea was to set up project in a way that would be suitable for single-page app (SPA) development. It would probably be an overkill if we needed just a single fx form on a more traditional website with multiple separate pages. But even then - the use of React.js and Reflux would not be totally out of question, but the lib and page weight whould be taken into consideration. Please note that JS file size does reduce dramatically when compressed (`npm build` for production delivery) and is returned gzipped by the supported browsers (all modern ones at this point) and servers, which this implementation of server-side has enabled too.
 
 * Basic configuration settings are managed via `/config/config.js`.
 * Server-side API is set up on `/api/fx/<endpoint>`, i.e. `/api/fx/rates`, `/api/fx/exchange`
 * Given it is a demo, some things were left out such as user balance updates after conversion etc. and many things could be polished further to perfection.

Technology requirements:

* Browsers: built to support IE9+, Chrome, Firefox
* Node: v0.12+
* npm 2.15+

## Technologies used

Tech                | Where in the app? | Desc
--------------------|-------------------|-------------------------
Twitter Bootstrap   | Client            | CSS grid system and UI controls - http://getbootstrap.com/
React.js            | Client            | For building reactive interfaces - https://facebook.github.io/react/
Reflux              | Client            | Data flow between components - https://github.com/reflux/refluxjs
jQuery              | Client            | For lazy-man's AJAX in this app
Node.js             | Server            | Just because it is good ol' Javascript on server-side
Express             | Server            | API and serving static assets (https://expressjs.com/)
Webpack             | Build system      | Compresses all the client-side JS into single file, runs Babel for transpiling ES6 & ES7 to ES5 JS before compression
Babel               | Build system      | Transpiles the ECMAScript 6/7 syntax into ES5 compatible code

## Project directory structure
```
assets/             --> front-end (client) required files
    images/         -->
    stylesheets/    --> SASS source files (*.scss)
        ext/        --> 3rd party stylesheets 
config/             --> app config and settings
public/             --> front-end (client) output dir - this is where web app and deps will be loaded from
    assets/
        images/
        js/
server/             --> server app (back-end) providing APIs and serving static assets
src                 --> front-end (client) source files
work_files          --> everything else not required to run the app
---
.babel.rc           --> Babel configuration
package.json        --> npm config
readme.md           --> This very same readme file
webpack.config.js   --> Webpack configuration (main, prod)
webpack.config.dev.js   --> Webpack configuration (for development)
```

## Build steps - production

1. `npm install`
2. `export NODE_ENV=production`
3. `npm start`
4. Point your browser to `http://localhost:80/` (or whichever port is configured for production)

## While developing

1. `npm install`
2. `npm run build` - to copy assets etc. from `/assets` to `/public`
3. `npm run debug` - and it will start the app and watch for file changes to reload the app.
4. Point your browser to `http://localhost:3002/` (or whichever port is configured for development)

## Notes

* No unit tests yet: would be good at least for some of the server-side methods

