(function(lib){
   'use strict';
   
   lib.objectAnalyser = {
      getPropertiesStacks(obj){
         return buildPropertiesStacks(obj);
      }
   };
   
   //var types = ["number", "string", "boolean"]; //Fuck, typeof(new Date) returns "object"
   var constructorNames = ["Number", "String", "Date", "Boolean"];
   
   function canWatch(p){
      return p === undefined || constructorNames.indexOf(p.constructor.name) >= 0;
      //return types.indexOf(typeof(p)) >= 0;
   }
   
   function buildPropertiesStacks(obj, chain){
      var r = [];
      for(var p in obj){
         if (obj.hasOwnProperty(p)){
            var nextChain = PropChain.create(p, chain);
            if (canWatch(p)){
               r.push(nextChain);
            } else {
               //TODO: arrays...
               
               r = r.concat(buildPropertiesStacks(obj[p], nextChain));
            }
         }
      }
      
      return r;
   }
   
   function PropChain(name){
      this.name = name;
      this.next = undefined;
   }
   
   PropChain.prototype.append = function(name){
      this.next = new PropChain(name);
      //this.next.previous = this;
      this.next.top = this.top;
      return this.next;
   }
   PropChain.create = function(name, parent){
      if(!parent) {
         var c = new PropChain(name);
         c.top = c;
         return c;
      }
      return parent.append(name);
   }
   PropChain.prototype.getFrom = function(obj){
      var next = this;
      var o = obj
      while(next){
         o = o[next.name];
         next = next.next;
      };
      return o;
   }
   PropChain.prototype.toString = function(){
      var names = [];
      var next = this;
      while(next){
         names.push(next.name);
         next = next.next;
      }
      return names.join('.');
   }
      
})(window.pjs);