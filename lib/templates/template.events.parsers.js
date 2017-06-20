(function(lib){

   lib.template = lib.template || {};
   lib.template.parsers = lib.template.parsers || {};
   lib.template.parsers[Node.ELEMENT_NODE] = lib.template.parsers[Node.ELEMENT_NODE] || {};
   lib.template.parsers[Node.ELEMENT_NODE].parseEvents = parseEvents;

   var EVENT_PREFIX = '@';

   function parseEvents(elementNode, definitionInstance){
      var attrs = elementNode.attributes;
      for(var i = 0 ; i < attrs.length ; i++){
         var currentAttr = attrs[i];
         if (isEvent(currentAttr)){
            var e = eventName(currentAttr);
            var fct = currentAttr.value;
            elementNode.addEventListener(e, function(e){
               definitionInstance[fct].call(definitionInstance, e);
            });
            elementNode.removeAttribute(currentAttr.name);
         }
      }
   }

   function isEvent(attribute){
      return attribute.name.indexOf(EVENT_PREFIX) === 0;
   }

   function eventName(attribute){
      return attribute.name.substring(1);
   }

})(window.pjs);
