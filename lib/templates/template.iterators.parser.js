(function(lib){
   'use strict';

   lib.template = lib.template || {};
   lib.template.parsers = lib.template.parsers || {};
   lib.template.parsers[Node.ELEMENT_NODE] = lib.template.parsers[Node.ELEMENT_NODE] || {};
   lib.template.parsers[Node.ELEMENT_NODE].parseIterator = parseIterator;

   var forAttribute = /~for/i;
   var forExpressionAnalyser = /[^ \t\r\n+]+/g;

   function parseIterator(elementNode, modelSpy){
      var forAttribute = searchFor(elementNode);
      if(forAttribute){
         var expression = analyseExpression(forAttribute.value);
         var e = elementNode.cloneNode();
         e.removeAttribute(forAttribute.name);
         var parent = elementNode.parentNode;
         elementNode.remove();
         var array = modelSpy.getValue(expression.target);
         for(var i = 0 ; i < array.length ; i++){
            //TODO : the element must have a context for the current element.
            parent.append(e);
            e = e.cloneNode();
         }
      }
   }

   function searchFor(elementNode){
      //Search a ~for.
      for(var iAttr = 0 ; iAttr < elementNode.attributes.length ; iAttr++){
         var currentAttribute = elementNode.attributes[iAttr];
         if(forAttribute.test(currentAttribute.name)){
            return currentAttribute;
         }
      }

      return false;
   }

   function analyseExpression(exp){
      var matches = exp.match(forExpressionAnalyser);
      if(matches.length !== 3 || matches[1] !== 'of'){
         throw "for expression must be `var of array`. actual: `" + exp + "`";
      }

      return {
         var: matches[0],
         target: matches[2]
      };
   }
})(window.pjs);
