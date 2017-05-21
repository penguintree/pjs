(function(lib){
   'use strict';
   
   lib.template = lib.template || {};
   lib.template.analyse = analyse;
   
   var parser = new DOMParser();
   var wrap = '<!DOCTYPE html><html><head></head><body>{{TEMPLATE}}</body></html>';
   var mustacheRegexp = /{{[^{}]+}}/g; //warning: can't catch new object like : "{{ { a: 1 } }}"
   var contentRegexp = /[^{}]+/;
   
   function analyse(template, modelSpy){
      var domElement = parseTemplate(template);
      
      var fragment = domElement.content;
      walkChilds(fragment, function(element){
         analyseElement(element, modelSpy);
      });
      
      return fragment;
   }
   
   function analyseElement(element, modelSpy){
      //https://developer.mozilla.org/fr/docs/Web/API/Node/nodeType
      switch(element.nodeType){
         case Node.ELEMENT_NODE:
            analyseHTMLElement(element, modelSpy);
            break;
         case Node.TEXT_NODE:
            analyseTextElement(element, modelSpy);
            break;
      }
      //if(element.constructor.name === 'Text'){
      //   analyseTextElement(element, modelSpy);
      //} else {
      //   analyseHTMLElement(element, modelSpy);
      //}
   }
   
   function analyseHTMLElement(element, modelSpy){
      var dynAttrs = [];
      for(var iAttr = 0 ; iAttr < element.attributes.length ; iAttr++){
         var attr = element.attributes[iAttr];
         if (attr.name.indexOf(':') === 0){
            dynAttrs.push({ name: attr.name, value: attr.value });
         }
      }
      
      dynAttrs.iterate(function(attr){
         var attrName = attr.name.substring(1);
         var attrValue = modelSpy.getValue(attr.value);
         
         element.removeAttribute(attr.name);
         element.setAttribute(attrName, attrValue);
         
         modelSpy.register(attr.value, function(name, value){
            element.setAttribute(attrName, value);
         });
      });
   }
   
   function analyseTextElement(element, modelSpy){
      var mustaches = element.nodeValue.match(mustacheRegexp);
      if (mustaches){
         var fct = replaceTextFunction(element, mustaches, modelSpy);
         
         var props = mustaches.map(function(m){ return m.match(contentRegexp)[0];});
         modelSpy.registerMulti(props, fct);
         
         fct();
      }
   }
   
   function replaceTextFunction(element, mustaches, modelSpy){
      var initialText = element.nodeValue;
      return function(){
         var text = initialText;
         mustaches.iterate(function(tag){
            var content = tag.match(contentRegexp)[0];
            var value = modelSpy.getValue(content);
            text = text.replace(new RegExp(tag, 'g'), value);
         });
         console.log('replacing text', element.nodeValue);
         element.nodeValue = text;
      };
   }
   
   function parseTemplate(template){
      var document = wrap.replace('{{TEMPLATE}}', template);
      var dom = parser.parseFromString(document, 'text/html');
      var templateElement = dom.querySelectorAll('body > template');
      if (templateElement.length === 0){
         throw 'Template must be wrap in <template> element';
      } else if (templateElement.length > 1){
         throw 'Template must contain only one <template> element';
      }
      
      return templateElement[0];
   }
   
   function walkChilds(element, callback){
      callback(element);
      for (var i = 0 ; i < element.childNodes.length ; i++){
         walkChilds(element.childNodes[i], callback);
      }
   }
   
})(window.pjs);