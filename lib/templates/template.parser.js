(function(lib){
   'use strict';

   lib.template = lib.template || {};
   lib.template.analyse = analyse;

   var parser = new DOMParser();
   var wrap = '<!DOCTYPE html><html><head></head><body>{{TEMPLATE}}</body></html>';
   var mustacheRegexp = /{{[^{}]+}}/g; //warning: can't catch new object like : "{{ { a: 1 } }}"
   var contentRegexp = /[^{}]+/;

   function analyse(template, modelSpy, definitionInstance){
      var fragment;
      if (typeof(template) === 'string'){
         fragment = parseTemplate(template);
      } else {
         fragment = template;
      }
      walkChilds(fragment, function(element){
         analyseElement(element, modelSpy, definitionInstance);
      });

      return fragment;
   }

   function analyseElement(element, modelSpy, definitionInstance){
      if (!lib.template.parsers){
         throw "parsers scripts not loaded";
      }

      //https://developer.mozilla.org/fr/docs/Web/API/Node/nodeType
      /*
      Node.ELEMENT_NODE == 1 ( element node )
      Node.ATTRIBUTE_NODE == 2 ( node attribute )
      Node.TEXT_NODE == 3 ( text node )
      Node.CDATA_SECTION_NODE == 4 ( CDATA section node )
      Node.ENTITY_REFERENCE_NODE == 5 ( node reference to an entity )
      Node.ENTITY_NODE == 6 ( Feature node )
      Node.PROCESSING_INSTRUCTION_NODE == 7 ( processing instruction node )
      Node.COMMENT_NODE == 8 ( comment node )
      Node.DOCUMENT_NODE == 9 ( document node )
      Node.DOCUMENT_TYPE_NODE == 10 ( Document Type node )
      Node.DOCUMENT_FRAGMENT_NODE == 11 ( node document fragment )
      Node.NOTATION_NODE == 12 ( node notation )
      */

      var parser = lib.template.parsers[element.nodeType];
      if(!parser){
         //console.log("WARNING : No parser for node type : " + element.nodeType);
         return;
      }

      parser.parse(element, modelSpy, definitionInstance);
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

      var contentNodes = filterNonEmptyTextNodes(templateElement[0].content);

      if(contentNodes.length !== 1){
         throw 'Template must contain one and only one root element';
      }
      return contentNodes[0];
   }

   function filterNonEmptyTextNodes(element){
      return Array.prototype.filter.call(element.childNodes, function(child){
      //return element.childNodes.filter(function(child){
         return child.nodeType !== Node.TEXT_NODE || child.nodeValue.trim() !== '';
      });
   }

   function walkChilds(element, callback){
      callback(element);
      for (var i = 0 ; i < element.childNodes.length ; i++){
         walkChilds(element.childNodes[i], callback);
      }
   }

})(window.pjs);
