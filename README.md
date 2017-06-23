# pjs
lightweight javascript librairy, just for fun and learning

goals :
- non restrictive : may cohabit well with other javascript framework and vanilla js code
- modularity. It must be possible to create components that lives alone. (1 component 1 file)

server.js file is a nodejs server that loads the librairy and the demo at localhost:8080
In order to run it, you must install npm modules 'connect' and 'serve-static'.

lib/build.pjs generate pjs-<version>.js and pjs-<version>.min.js in \_\_dist folder.
In order to run it, you must install npm modules 'bundle-js' and 'uglify-js'.

Nodejs should be at a reasonably recent version. To install last version via package manager on different linux distributions, see https://nodejs.org/en/download/package-manager/

Todos :
- Cross browser :
   - Edge : input number dont update the model when up/down arrows are used.
   - IE needs a promise polyfill
- Unit tests
- Uniform object creation (use of 'new' of creator function)
- linter ?
- ...
- DOC!
- custom tags to load components (like <pjs-my-component>) (almost done, see template.components.parser.js)
