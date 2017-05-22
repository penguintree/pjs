(function(lib, template, replacement){
   'use strict';
   
   /*
   var def = {
     template: {
     },
     methods: {
        doSomething: function(){
      }
     },
     model: {
        potato: 1,
        chips: 'yes',
        cola: {
           maybe : 'I prefer beer'
        }
     },
     events: {
        '?': 'sais pas'
     }        
   }
   */
   
   lib.createComponent = function(def){
      return new Component(def);
   };
   
   function Component(definition){
      this.def = definition;
   }
   Component.prototype.getTemplate = function(){
      var that = this;
      if (!that._getTemplatePromise || that.loadingTemplate){
         that.loadingTemplate = true;
         var t = template.create(that.def.template);
         that._getTemplatePromise = t.getTemplate();
      }
      
      return that._getTemplatePromise;
   };
   
   Component.prototype.load = function(parent, model){
      var that = this;
      return that.getTemplate().then(function(template){
         var instance = lib.components.instance(this, template, parent, model);
         instance.draw();
         return instance;
      });
   };
   
})(window.pjs, window.pjs.template, window.pjs.replacement);