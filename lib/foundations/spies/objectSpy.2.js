(function(lib){
   'use strict';

   window.Spy = Spy;

   function Spy(obj){
      this.obj = obj;
   }

   Spy.prototype.register = function(prop, handler){
      if(Array.isArray(prop)){
         registerMulti.call(this, prop, handler);
      } else {
         //TODO.
         overrideProperty.call(this, prop);
      }
   };

   Spy.prototype.getValue = function(prop){
      //TODO
   };

   Spy.prototype.setValue = function(prop, value){
      //TODO
   };

   Spy.prototype.trigger = function(){
      //TODO
   };


   //********************
   // Private stuff.
   //********************

   function overrideProperty(prop){
      var actualDescriptor = Object.getOwnPropertyDescriptor(this.obj, prop);
      if (actualDescriptor && actualDescriptor.get && actualDescriptor.get.$spy){
         return actualDescriptor.get.$spy;
      }

      var value = this.obj[prop];
      //var descriptor = new PropertyDescriptor(value);
      var descriptor = createDescriptor();
      Object.defineProperty(this.obj, prop, descriptor);
      this.obj[prop] = value;

      return descriptor.get.$spy;
   }

   function registerMulti(propsArray, handler){
      //TODO
   }

   function createDescriptor(){
      var descriptor = {
         get: function(){
            return this.value;
         },
         set: function(newValue){
            this.lastValue = this.value;
            this.value = newValue;
         }
      }

      descriptor.set.$spy = {
         hub: lib.events.hub()
      };

      return descriptor;
   }
})(window.pjs);
