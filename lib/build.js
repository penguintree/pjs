'use strict';

const version = '0.0.1';

const scripts = [
   'utilities/shims',
   'utilities/array.extension',
   'utilities/array.observable',
   'utilities/node.extension',
   'main',
   'utilities/helpers',
   'foundations/events/hub',
   'foundations/tick',
   'foundations/requests',
   'foundations/spies/arraySpyBuilder',
   'foundations/spies/spyBuilder',
   'foundations/spies/objectSpy',
   'templates/template',
   'templates/template.components.parser',
   'templates/template.parser',
   'templates/template.attributes.parser',
   'templates/template.events.parsers',
   'templates/template.conditionals.parser',
   'templates/template.iterators.parser',
   'templates/template.elementNodes.parser',
   'templates/template.textNodes.parser',
   'components/component',
   'components/component.instance'
];
const folder = `${__dirname}/__dist`;
const scriptName = `pjs-${version}`;

const bundle = require('bundle-js')

let files = scripts.map(s => `${__dirname}/${s}.js`).reverse(); //?!? bundle-js bundle files in the wrong order ?!?

var code = bundle({
    //dest : output,
    files : files,
    target : 'browser',
    iife : false
});

const uglify = require("uglify-js");
var options = { warnings: true };
var uglified = uglify.minify(code, options);

var outputs = [{
   fileName: `${folder}/${scriptName}.js`,
   content: code
},{
   fileName: `${folder}/${scriptName}-min.js`,
   content: uglified.code
},{
   fileName: `${folder}/warnings`,
   content: (uglified.warnings || []).join('\r\n')
},{
   fileName: `${folder}/errors`,
   content: (uglified.errors || []).join('\r\n')
}];

console.log('-----');
console.log('writing output');

var fs = require('fs');

if(!fs.existsSync(folder)){
   fs.mkdirSync(folder);
}
for(let f of outputs){
   fs.writeFile(f.fileName, f.content || '', function(err) {
       if(err) {
           return console.log(`error writing file ${f.fileName}`, err);
       }

       console.log(`${f.fileName} saved`);
   });
}
