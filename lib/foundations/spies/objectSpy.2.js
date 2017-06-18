(function(lib){
   'use strict';

   lib.observers = lib.observers || {};
   lib.observers.Spy = Spy;

   function Spy(obj){
      this.obj = obj;
      this.observed = {};
      this.spiesCache = {};
   }

   Spy.prototype.register = function(prop, handler){
      if(Array.isArray(prop)){
         var handler = oneTimeRunner(handler);
         prop.iterate(function(p){
            this.register(p, handler);
         }, this);
      } else {
         var spy = this.spiesCache[prop] || (this.spiesCache[prop] = getPropertySpy.call(this, prop));

         this.observed[prop] = this.observed[prop] || [];
         spy.on(handler);
         this.observed[prop].push(handler);
      }
   };

   Spy.prototype.getValue = function(prop){
      var o = getObservedObject(this.obj, prop);
      return o.obj[o.prop];
   };

   Spy.prototype.setValue = function(prop, value){
      var o = getObservedObject(this.obj, prop);
      o.obj[o.prop] = value;
   };

   //No need to trigger the spy. The tick will trigger it. The tick will trigger all and everything.
   //Spy.prototype.trigger = function(){
   //   for(var p in this.spiesCache){
   //      this.spiesCache[p].trigger();
   //   }
   //};

   Spy.prototype.release = function(){
      for(var p in this.observed){
         var spy = this.spiesCache[p];
         this.observed[p].iterate(function(hanlder){
            spy.off(hanlder);
         });
      }
   };


   //********************
   // Private stuff.
   //********************

   function getPropertySpy(prop){
      var observed = getObservedObject(this.obj, prop);

      var actualDescriptor = Object.getOwnPropertyDescriptor(observed.obj, observed.prop);
      if (actualDescriptor && actualDescriptor.set && actualDescriptor.set.$spy){
         return actualDescriptor.set.$spy;
      }

      var valueHolder = new ValueHolder(observed.obj[observed.prop]);
      var descriptor = createDescriptor(valueHolder);
      Object.defineProperty(observed.obj, observed.prop, descriptor);

      return descriptor.set.$spy;
   }

   function getObservedObject(obj, prop){
      var parts = prop.split('.');
      var i = 0;
      while (i < parts.length - 1){
         obj = obj[parts[i]];
         i++;
      }

      return {
         obj: obj,
         prop: parts[i]
      };
   }

   function oneTimeRunner(handler){
      var wrapper = function(e){
         if(!wrapper.ran){
            handler(e);
            wrapper.ran = true;
         }
      };
      return wrapper;
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

   function ValueHolder(actual){
      this.actual = actual;
      this.hub = lib.events.hub();
      this.changed = false;

      lib.tick.on({
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
         this.hub.trigger('change', { last: this.last, actual: this.actual });
         this.changed = false;
      }
   }

})(window.pjs);
