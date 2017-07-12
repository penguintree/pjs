/*
   An instance of a component.
*/

(function(lib, template, spy, tick){
   'use strict';

   lib.components = lib.components || {};
   lib.components.instance = function(component, template, element, model){
      return new Instance(component, template, element, model);
   };

   function Instance(component, templateString, element, defInstance){
      this.modelSpy = spy.objectSpy(defInstance.model, lib.tick);
      this.template = template.analyse(templateString, this.modelSpy, defInstance);
      this.element = element;
   }

   /*
      Injects the component in his element.
   */
   Instance.prototype.draw = function(){
      //Empty the container's element.
      this.element.removeChildren();

      //Transfert the template in the container.
      this.element.appendChild(this.template);

      //Release the spy when the component is unloaded to avoid memory leaks.
      var modelSpy = this.modelSpy;
      this.element.firstChild.addEventListener('removed', function(){
         modelSpy.release();
      });
   }

})(window.pjs, window.pjs.template, window.pjs.spy, window.pjs.tick);
