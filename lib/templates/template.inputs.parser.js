(function(lib){

   //TODO: <select> : initially selected value.
   //TODO: Test 'input' event on multiple browser.

   lib.template = lib.template || {};
   lib.template.parsers = lib.template.parsers || {};
   lib.template.parsers[Node.ELEMENT_NODE] = lib.template.parsers[Node.ELEMENT_NODE] || {};
   lib.template.parsers[Node.ELEMENT_NODE].parse = parse;

   var parseStandardAttributes = lib.template.parsers[Node.ELEMENT_NODE].parseStandardAttributes;

   function parse(elementNode, modelSpy){
      var conf = testElement(elementNode);
      if(conf){
         var reactiveAttribute = conf.reactiveAttribute;
         var binding = conf.binding;
         var attrName = reactiveAttribute.name.substring(1)
         var modelName = reactiveAttribute.value;
         var modelValue = modelSpy.getValue(modelName);

         elementNode.removeAttribute(reactiveAttribute.name)
         conf.valueSetter(elementNode, attrName, modelValue);

         binding(elementNode, modelSpy, attrName, modelName);
      }

      parseStandardAttributes(elementNode, modelSpy);
   }

   function standardEventBinding(elementNode, modelSpy, attrName, modelName){
      var eventName = changeEventName(elementNode);
      elementNode.addEventListener(eventName, function(){
         var newValue = elementNode[attrName];
         modelSpy.setValue(modelName, newValue);
      });
   }

   function radioButtonBinding(elementNode, modelSpy, attrName, modelName){
      var group = elementNode.name;
      elementNode.addEventListener('change', function(){
         var newValue = true;
         modelSpy.setValue(modelName, newValue);

         if(group){
            var radioGroup = document.querySelectorAll('input[type=radio][name='+group+']');
            for(var i = 0 ; i < radioGroup.length ; i++){
               var other = radioGroup[i];
               if(other !== this){
                  other.dispatchEvent(new Event('unchecked'));
               }
            }
         }
      });

      elementNode.addEventListener('unchecked', function(){
         var newValue = false;
         modelSpy.setValue(modelName, newValue);
      });
   }

   function standardValueSetter(elementNode, attrName, modelValue){
      elementNode.setAttribute(attrName, modelValue);
   }

   function flagValueSetter(elementNode, attrName, modelValue){
      if(modelValue){
         elementNode.setAttribute(attrName, '');
      }
   }

   function selectValueSetter(elementNode, attrName, modelValue){
      if(modelValue === undefined || modelValue === null){
         return;
      }
      modelValue = modelValue.toString();
      var options = elementNode.getElementsByTagName('option');
      for(var i = 0 ; i < options.length ; i++){
         var opt = options[i];
         if(opt.value === modelValue){
            opt.setAttribute('selected', '');
         } else {
            opt.removeAttribute('selected');
         }
      }
   }

   function contentValueSetter(elementNode, attrName, modelValue){
      if(modelValue !== undefined && modelValue !== null){
         elementNode.innerText = modelValue.toString();
      }
   }

   function changeEventName(elementNode){
      if('oninput' in elementNode && !/radio/i.test(elementNode.type) && !/checkbox/i.test(elementNode.type)){
         return 'input';
      }
      return 'change';
   }

   //https://developer.mozilla.org/fr/docs/Web/HTML/Element'nput
   //file / hidden not supported (should it be ?)
   var inputDefinitions = [
      {
         condition: {
            tagName: /input/i,
            attribute: {
               name: 'type',
               allowedValues: [
                  /text/i,
                  /color/i,
                  /email/i,
                  /date/i,
                  /datetime/i,
                  /datetime-local/i,
                  /month/i,
                  /number/i,
                  /password/i,
                  /range/i,
                  /search/i,
                  /tel/i,
                  /time/i,
                  /url/i,
                  /weel/i
               ]
            }
         },
         conf:{
            reactiveAttribute: ':value',
            binding: standardEventBinding,
            valueSetter: standardValueSetter
         }
      },{
         condition: {
            tagName: /select/i,
         },
         conf: {
            reactiveAttribute: ':value',
            binding: standardEventBinding,
            valueSetter: selectValueSetter
         }
      },{
         condition:{
            tagName: /input/i,
            attribute: {
               name: 'type',
               allowedValues: [
                  /checkbox/i
               ]
            }
         },
         conf:{
            reactiveAttribute: ':checked',
            binding: standardEventBinding,
            valueSetter: flagValueSetter
         }
      },{
         condition:{
            tagName: /input/i,
            attribute: {
               name: 'type',
               allowedValues: [
                  /radio/i
               ]
            }
         },
         conf:{
            reactiveAttribute: ':checked',
            binding: radioButtonBinding,
            valueSetter: flagValueSetter
         }
      },{
         condition:{
            tagName: /textarea/i
         },
         conf:{
            reactiveAttribute: ':value',
            binding: standardEventBinding,
            valueSetter: contentValueSetter
         }
      }
   ]

   /*
      Test if an element node must update the model.
      If true, returns the reactive attribute.
   */
   function testElement(elementNode){
      var reactiveAttr = false;
      inputDefinitions.iterate(function(definition){
         reactiveAttr = testDefinition(definition, elementNode);
         return !reactiveAttr; //Stop if found.
      });

      return reactiveAttr || undefined;
   }

   /*
      Test a condition over an element node.
   */
   function testDefinition(definition, elementNode){

      //Does the tag name fits ?
      if(!definition.condition.tagName.test(elementNode.tagName)) return false;

      //Is there an attribute condition ?
      if (definition.condition.attribute){

         var attr = elementNode.attributes[definition.condition.attribute.name];
         if(!attr) return false;

         var match = false;
         definition.condition.attribute.allowedValues.iterate(function(v){
            match = v.test(attr.value);
            return !match; //Stop if match found
         });

         if(!match) return false;
      }

      //Returns the reactive attribute if present.
      var reactiveAttr = elementNode.attributes[definition.conf.reactiveAttribute];
      if(!reactiveAttr) return false;

      return {
         reactiveAttribute: reactiveAttr,
         binding: definition.conf.binding,
         valueSetter: definition.conf.valueSetter
      }
   }

})(window.pjs);
