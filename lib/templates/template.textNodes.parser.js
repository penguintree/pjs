(function(lib){
   'use strict';

   lib.template = lib.template || {};
   lib.template.parsers = lib.template.parsers || {};
   lib.template.parsers[Node.TEXT_NODE] = {
      parse: parseMustaches
   };

   var mustacheRegexp = /{{[^{}]+}}/g; //warning: can't catch new object like : "{{ { a: 1 } }}"
   var contentRegexp = /[^{}]+/;

   function parseMustaches(textNode, modelSpy){
      var mustaches = textNode.nodeValue.match(mustacheRegexp);
      if(mustaches){
         //Define a parameter-free function to replace mustaches in a text node.
         var fctReplacement = textReplacementFunction(textNode, mustaches, modelSpy);

         //Register this function over the modelSpy for the properties touched.
         var props = mustaches.map(function(m){ return m.match(contentRegexp)[0];});
         modelSpy.register(props, fctReplacement);

         //Execute the initial replacement.
         fctReplacement();
      }
   }

   function textReplacementFunction(textNode, mustaches, modelSpy){
      var initialText = textNode.nodeValue;
      return function(){
         var text = initialText;
         mustaches.iterate(function(tag){
            var content = tag.match(contentRegexp)[0];
            var value = modelSpy.getValue(content);
            text = text.replace(new RegExp(tag, 'g'), value);
         });
         textNode.nodeValue = text;
      };
   }
})(window.pjs);
