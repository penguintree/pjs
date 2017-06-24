(function(lib){
   'use strict';

   lib.template = lib.template || {};
   lib.template.parsers = lib.template.parsers || {};
   lib.template.parsers[Node.ELEMENT_NODE] = lib.template.parsers[Node.ELEMENT_NODE] || {};
   lib.template.parsers[Node.ELEMENT_NODE].parseIf = parseIf;

   var ifAttribute = /~if/i;

   function parseIf(elementNode, modelSpy){
      //Search a ~if.
      for(var iAttr = 0 ; iAttr < elementNode.attributes.length ; iAttr++){
         var currentAttribute = elementNode.attributes[iAttr];
         if(ifAttribute.test(currentAttribute.name)){

            var prop = currentAttribute.value;
            var toggle = createToggle(elementNode);

            var handler = valueChangeHandler(toggle);
            modelSpy.register(prop, handler);

            var actualValue = modelSpy.getValue(prop);
            switchElement(toggle, actualValue);

            elementNode.removeAttribute(currentAttribute.name);

            break; //there can be just on ~if on an element.
         }
      }
   }

   function valueChangeHandler(toggle){
      return function(oldValue, newValue){
         var was = !!oldValue;
         var is = !!newValue;
         if (was !== is){
            switchElement(toggle, is);
         }
      }
   }

   function createToggle(elementNode){
      var e = {};
      e[true] = elementNode;
      e[false] = document.createComment('');

      return e;
   }

   function switchElement(toggle, show){
      //ensure to have a boolean.
      show = !!show;

      var actual = toggle[!show];
      var next = toggle[show];

      if(!next.parentNode){
         actual.parentNode.insertBefore(next, actual);

         actual.remove();
      }
   }


})(window.pjs);
