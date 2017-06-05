/*
   An instance of a component.
*/

//TODO: compoment should "off" the tick once it is destroyed.
/*
   destroyed: function(){
      off everithing in modelSpy
      off from the tick
      destroy elements.
   }

   How to know I have been destroyed ?
   Objects must be garbage collected.
*/

(function(lib, template, spy, tick){
   'use strict';

   lib.components = lib.components || {};
   lib.components.instance = function(component, template, element, model){
      return new Instance(component, template, element, model);
   };

   function Instance(component, templateString, element, defInstance){
      var modelSpy = spy.objectSpy(defInstance.model);
      this.template = template.analyse(templateString, modelSpy, defInstance);
      this.element = element;

      tick.on(function(){
         modelSpy.trigger();
      });
   }

   /*
      Injects the component in his element.
   */
   Instance.prototype.draw = function(){
      //Empty the container's element.
      while(this.element.firstChild){
         this.element.removeChild(this.element.firstChild);
      }

      //Transfert the template in the container.
      while(this.template.firstChild){
         var node = this.template.removeChild(this.template.firstChild);
         this.element.appendChild(node);
      }
   }
})(window.pjs, window.pjs.template, window.pjs.spy, window.pjs.tick);
