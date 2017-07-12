(function(lib){
   'use strict';

   //lib.observers = lib.observers || {};
   //lib.observers.Spy = Spy;

   lib.spy = lib.spy || {};
   lib.spy.objectSpy = function(obj, tick) {
      return new Spy(obj, tick);
   };

   function Spy(obj, tick){
      this.obj = obj;
      this.observed = {};
      this.spiesCache = {};
      this.oneTimeRunners = [];

      this.childs = [];

      this.tick = tick;

      this.tick.onAfter({
         handler: resetOneTimeRunners,
         caller: this
      });
   }

   Spy.prototype.createChild = function(obj){
     var child = new Spy(obj, this.tick);
     this.childs.push(child);
     return child;
   };

   Spy.prototype.register = function(prop, handler){
      if(Array.isArray(prop)){
         var handler = oneTimeRunner(handler);
         prop.iterate(function(p){
            this.register(p, handler);
         }, this);
         this.oneTimeRunners.push(handler);
      } else {
         var spy = this.spiesCache[prop] || (this.spiesCache[prop] = lib.spy.build(this.obj, prop, this.tick));

         this.observed[prop] = this.observed[prop] || [];
         spy.on(handler);
         this.observed[prop].push(handler);
      }
   };

   Spy.prototype.getValue = function(prop){
      var o = lib.spy.getObservedObject(this.obj, prop);
      //if(o.obj === undefined) return //undefined;

      if(o.obj === undefined) return undefined

      return o.obj[o.prop];
   };

   Spy.prototype.setValue = function(prop, value){
      var o = lib.spy.getObservedObject(this.obj, prop);

      if(o.obj === undefined) throw 'property "' + o.actualProp + '" does not exists';

      if(!o.obj.hasOwnProperty(o.prop)) throw 'property "' + o.prop + '" does not exists';

      o.obj[o.prop] = value;
   };

   Spy.prototype.release = function(){
      for(var p in this.observed){
         var spy = this.spiesCache[p];
         this.observed[p].iterate(function(hanlder){
            spy.off(hanlder);
         });
      }
      this.observed = {};
      this.oneTimeRunners = [];
      this.childs.iterate(function(c){
        c.release();
      });
   };


   //********************
   // Private stuff.
   //********************

   function oneTimeRunner(handler){
      var wrapper = function(e){
         if(!wrapper.ran){
            handler(e);
            wrapper.ran = true;
         }
      };
      return wrapper;
   }

   function resetOneTimeRunners(){
      this.oneTimeRunners.iterate(function(runner){
         runner.ran = false;
      });
   }

})(window.pjs);
