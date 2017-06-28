(function(lib){
   lib.spy = lib.spy || {};
   lib.spy.arraySpyBuilder = arrayBuild;

   function arrayBuild(observed, tick){
      var array = observed.obj[observed.prop];
      return array.$spy || (array.$spy = createSpy(array, tick));
   }

   function createSpy(array, tick){
      var spy = new ArraySpy(array, tick);
      array.observe(spy);
      return {
         on: function(handler) { spy.on(handler); },
         off: function(handler) { spy.off(handler); }
      };
   }

   function ArraySpy(actual, tick){
      this.actual = actual.slice();
      this.hub = lib.events.hub();
      tick.on({
         handler: this.onTick,
         caller: this
      });
   }

   ArraySpy.prototype.on = function(handler){
      this.hub.on('change', handler);
   };
   ArraySpy.prototype.off = function(handler){
      this.hub.off('change', handler);
   };

   ArraySpy.prototype.trigger = function(old, actual) {
      this.changed = true;
      this.last = old;
      this.actual = actual;
   };

   ArraySpy.prototype.onTick = function(){
      if(this.changed){
         this.hub.triggerWithArgs('change', [this.last, this.actual]);
         this.changed = false;
      }
   };

})(window.pjs);
