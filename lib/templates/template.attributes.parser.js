(function(lib){
   'use strict';

   var DYNAMIC_ATTRIBUTE_PREFIX = ':'; //ex. :class="modelVariable"
   var ELEMENT_CONTROLE_PREFIX = '~'; //ex. ~if="modelVariable", ~else, ~for="a in b"

   var INPUT_TAG_NAME = /input/i;
   var TWO_WAYS_ATTRIBUTES = [/value/i]; //Those attributes must modify the model.

   lib.template = lib.template || {};
   lib.template.parsers = lib.template.parsers || {};
   lib.template.parsers[Node.ELEMENT_NODE] = lib.template.parsers[Node.ELEMENT_NODE] || {};
   lib.template.parsers[Node.ELEMENT_NODE].parseStandardAttributes = parseAttributes;

   function parseAttributes(elementNode, modelSpy){
      var dynamicAttributes = [];

      //Find all dynamic attributes, those whose value must react to the model.
      for(var iAttr = 0 ; iAttr < elementNode.attributes.length ; iAttr++){
         var currentAttribute = elementNode.attributes[iAttr];
         if (isDynamicAttribute(currentAttribute)){
            dynamicAttributes.push({
               name: currentAttribute.name,
               value: currentAttribute.value
            });
         }
      }

      dynamicAttributes.iterate(function(attr){
         handleDynamicAttribute(elementNode, attr, modelSpy);
      });
   }

   /*
      Set the value for a dynamic attribute, and register to
      the modelSpy.
   */
   function handleDynamicAttribute(elementNode, attribute, modelSpy){

      //Replace attribute's value with model value.
      var dynamicName = attribute.name;
      var actualName = dynamicAttributeName(attribute);
      var modelProperty = attribute.value;
      var actualValue = modelSpy.getValue(modelProperty);

      elementNode.removeAttribute(dynamicName);
      elementNode.setAttribute(actualName, actualValue);

      //Register to react to model changes.
      modelSpy.register(modelProperty, function(oldValue, newValue){
         elementNode.setAttribute(actualName, newValue);
      });
   }

   function isDynamicAttribute(attribute){
      return attribute.name.indexOf(DYNAMIC_ATTRIBUTE_PREFIX) === 0;
   }

   function dynamicAttributeName(attribute){
      return attribute.name.substring(1); //Removes the ':'
   }
})(window.pjs);
