# Revolut Currency Exchange Form - Web Version

Basic requirements:

* Browsers: built do support IE9+, Chrome, Firefox
* Node: v0.12+
* npm 2.15+

## Technologies used

Tech                | Where in the app? | Desc
--------------------|-------------------|-------------------------
Twitter Bootstrap   | Client            | CSS grid system and UI controls - http://getbootstrap.com/
React.js            | Client            | For building reactive interfaces
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

1. `export NODE_ENV=production`
2. `npm start`
3. Point your browser to `http://localhost:80/` (or whichever port is configured for production)

## While developing

1. `npm run build` - to copy assets etc. from `/assets` to `/public`
2. `npm run debug` - and it will start the app and watch for file changes to reload the app.
3. Point your browser to `http://localhost:3002/` (or whichever port is configured for development)

## Notes

* No unit tests yet: would be good at least for some of the server-side methods

