/*(function(lib, replacement, watchers){
   
   lib.components = lib.components || {};
   lib.components.instance = function(component, template, element, model){
      return new Instance(component, template, element, model);
   };
   
   function Instance(component, template, element, model){
      this.template = template;
      this.element = element;
      this.model = model;
      watchers.watch(model, drawFct(this));
   }
   
   Instance.prototype.draw = function(){
      var html = replacement.replace(this.model, this.template);
      this.element.innerHTML = html;
   }
   
   function drawFct(instance){
      return function(){
         instance.draw();
      };
   }
   
})(window.pjs, window.pjs.replacement, window.pjs.watchers);
*/
(function(lib, template, spy, tick){
   'use strict';
   
   lib.components = lib.components || {};
   lib.components.instance = function(component, template, element, model){
      return new Instance(component, template, element, model);
   };
   
   function Instance(component, templateString, element, model){
      var modelSpy = spy.objectSpy(model);
      this.template = template.analyse(templateString, modelSpy);
      this.element = element;
      tick.on(function(){
         modelSpy.trigger();
      });
   }
   
   Instance.prototype.draw = function(){
      console.log('draw');
      while(this.element.firstChild){
         this.element.removeChild(this.element.firstChild);
      }
      while(this.template.firstChild){
         var node = this.template.removeChild(this.template.firstChild);
         this.element.appendChild(node);
      }
   }
})(window.pjs, window.pjs.template, window.pjs.spy, window.pjs.tick);