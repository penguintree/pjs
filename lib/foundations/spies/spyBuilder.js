(function(lib){
   'use strict';

   lib.spy = lib.spy || {};
   lib.spy.build = buildSpy;
   //lib.spy.getObservedObject = getObservedObject;

   var builders = {
      array: arraySpy,
      default: getPropertySpy
   };


   function buildSpy(obj, prop, tick){
      var observed = {
         obj: obj,
         prop: prop
      }; //TODO;

      var b = Array.isArray(observed.obj[observed.prop]) ? 'array' : 'default';

      return builders[b](observed, tick);
   }

   function arraySpy(observed, tick){
      var propSpy = getPropertySpy(observed, tick);
      var arraySpy = lib.spy.arraySpyBuilder(observed, tick);

      return {
         on: function(handler) { propSpy.on(handler); arraySpy.on(handler); },
         off: function(handler) { propSpy.off(handler); arraySpy.off(handler); }
      }
   }

   function getPropertySpy(observed, tick){

      var actualDescriptor = Object.getOwnPropertyDescriptor(observed.obj, observed.prop);
      if (actualDescriptor && actualDescriptor.set && actualDescriptor.set.$spy){
         return actualDescriptor.set.$spy;
      }

      if (actualDescriptor && !actualDescriptor.configurable){
         throw  "property not configurable";
      }

      var valueHolder = new ValueHolder(observed.obj[observed.prop], tick);
      var descriptor = createDescriptor(valueHolder);
      Object.defineProperty(observed.obj, observed.prop, descriptor);

      return descriptor.set.$spy;
   }

   function createDescriptor(valueHolder){
      var descriptor = {
         get: function(){
            return valueHolder.get();
         },
         set: function(newValue){
            //this.lastValue = this.value;
            valueHolder.change(newValue);
         }
      }

      descriptor.set.$spy = {
         on: function(handler){valueHolder.on(handler)},
         off: function(handler){valueHolder.off(handler)},
      };

      return descriptor;
   }

   function ValueHolder(actual, tick){
      this.actual = actual;
      this.hub = lib.events.hub();
      this.changed = false;

      tick.on({
         handler: this.trigger,
         caller: this
      });
   }
   ValueHolder.prototype.get = function(){
      return this.actual;
   };
   ValueHolder.prototype.change = function(newValue){
      if(this.actual === newValue) return;

      if (!this.changed){
         this.last = this.actual;
         this.changed = true;
      }
      this.actual = newValue;
   };
   ValueHolder.prototype.on = function(handler){
      this.hub.on('change', handler);
   };
   ValueHolder.prototype.off = function(handler){
      this.hub.off('change', handler);
   };
   ValueHolder.prototype.trigger = function(){
      if(this.changed){
         this.hub.triggerWithArgs('change', [this.last, this.actual]);
         this.changed = false;
      }
   }
})(window.pjs);
