(function(lib, factories, http){
   'use strict';
   
   /*
   var exemple = {
      url: "/toto/template.html",
      content: "<div><p>...</p></div>"
   };
   */
   
   var builders = {
      'remote': RemoteDefinition,
      'inline' : InlineDefinition
   };
   
   lib.template = {
      create: createTemplate
   };
   
   function createTemplate(def){
      return buildDefinition(def);
   };   
   
   function buildDefinition(def){
      var type = false;
      if(def.url){
         type = 'remote';
      } else if (def.content){
         type = 'inline';
      } else {
         throw 'template definition must have either url or content defined';
      }
      var builder = builders[type];
      return new builder(def);      
   }
   
   function Definition(type, def){
      this.def = def;
      this.type = type;
   }
   function RemoteDefinition(def){
      Definition.call(this, 'remote', def);
   }   
   RemoteDefinition.prototype = Object.create(Definition.prototype);
   RemoteDefinition.prototype.constructor = RemoteDefinition;
   RemoteDefinition.prototype.getTemplate = function(){
      return http.get(this.def.url).then(function(r){
         return r;
      });
   };

   function InlineDefinition(def){
      Definition.call(this, 'inline', def);
   }   
   InlineDefinition.prototype = Object.create(Definition.prototype);
   InlineDefinition.prototype.constructor = InlineDefinition;
   InlineDefinition.prototype.getTemplate = function(){
      var promise = lib.factories.promise();
      promise.resolve(this.def.content);
      return promise.$promise;
   };
   
})(window.pjs, window.pjs.factories, window.pjs.http);
