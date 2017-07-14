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
         var subTemplates = [];
         var array = modelSpy.getValue(expression.target);
         if (array === undefined) { array = []; }
         if (!Array.isArray(array)){
            throw "iterators (~for) only act on arrays";
         }
         //Removes the ~for attribute before cloning the element.
         elementNode.removeAttribute(forAttribute.name);
         array.iterate(function(element, index){
            var spy = modelSpy.createChild();
            spy.defineArrayShortcut(expression.target, index, expression.var);

            subTemplates.push({
               template: elementNode.cloneNode(true),
               modelSpy: spy
            });
         });
         adjustDOM(elementNode, subTemplates);

         return true;
      }

      return false;
   }

   function adjustDOM(elementNode, iterable){
      //Empty current node and replace it so the walkChild loop catch all of the newly generated elements.
      elementNode.removeChildren();
      var commentStart = document.createComment('iterator starts');
      var commentEnd = document.createComment('iterator ends');
      var parent = elementNode.parentElement;
      parent.replaceChild(commentStart, elementNode); //May be elementNode.replaceWith(comment) when supported (make a shim).
      parent.insertAfter(commentEnd, commentStart);

      iterable.iterate(function(e){
         e.template.$$modelSpy = e.modelSpy;
         parent.insertBefore(e.template, commentEnd);
      });
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
