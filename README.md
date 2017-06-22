# pjs
lightweight javascript librairy, just for fun and learning

goals :
- non restrictive : may cohabit well with other javascript framework and vanilla js code
- modularity. It must be possible to create components that lives alone. (1 component 1 file)

server.js file is a nodejs server that loads the librairy and the demo at localhost:8080
in order to run it, you must install npm modules 'connect' and 'serve-static'.

Todos :
- Ensure 'use strict' is in every file
- Cross browser :
   - Edge : input number dont update the model when up/down arrows are used.
   - IE needs a promise polyfill
   - Test page does not works on iPad (problem with loader script)
- Unit tests
- Uniform object creation (use of 'new' of creator function)
- linter ?
- ...
- DOC!
- custom tags to load components (like <pjs-my-component>) (almost done, see template.components.parser.js)
