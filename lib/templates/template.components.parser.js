(function(lib){
   lib.template = lib.template || {};
   lib.template.parsers = lib.template.parsers || {};
   lib.template.parsers[Node.ELEMENT_NODE] = lib.template.parsers[Node.ELEMENT_NODE] || {};
   lib.template.parsers[Node.ELEMENT_NODE].parseCustomElement = parseCustomElement;

   function parseCustomElement(elementNode, modelSpy, definitionInstance){
      if (isCustomElement(elementNode)){
         var attrs = elementNode.attributes;
         var props = [];
         for(var i = 0 ; i < attrs.length ; i++){
            var current = attrs[i];
            var name = current.name;
            var val = current.value;

            props.push({ name: name, val: val });
         }

         var model = buildModel(props);
         props.iterate(function(p){
            modelSpy.register(p.name, function(name, newValue, oldValue){
               model[name] = newValue; //TODO multi-part.
            });
         });

         var component = definitionInstance.components[elementNode.tagName.toLowerCase()];
         component.load(elementNode, model);

         return true;
      }
      return false;
   }

   function buildModel(props){
      var model = {};
      props.iterate(function(p){
         var segments = p.name.split('.');
         var c = model;
         var i = 0;
         for(; i < segments.count - 1 ; i++){
            c = c[segments[i]];
         }

         c[segments[i]] = p.val;
      });

      return model;
   }

   function isCustomElement(elementNode){
      return elementNode.tagName.indexOf('-') >= 0;
   }

})(window.pjs);
