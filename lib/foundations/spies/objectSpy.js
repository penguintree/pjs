(function(lib){

   lib.spy = lib.spy || {};
   lib.spy.objectSpy = function(obj) {
      return new ObjectSpy(obj);
   };

   function ObjectSpy(obj){
      this.obj = obj;
      this.spies = {};
      this.multiListeners = [];
   }
   ObjectSpy.prototype.register = function(prop, listener){
      var spy = this.spies[prop] || (this.spies[prop] = lib.spy.propertySpy(this.obj, prop));
      spy.register(listener);
   };
   ObjectSpy.prototype.registerMulti = function(props, listener){
      var wrapper = function(){
         if (!wrapper.ran){
            listener();
            wrapper.ran = true;
         }
      };
      this.multiListeners.push(wrapper);
      props.iterate(function(p){
         this.register(p, wrapper);
      }, this);
   }
   ObjectSpy.prototype.getValue = function(prop){
      return this.obj[prop];
   };
   ObjectSpy.prototype.setValue = function(prop, value){
      this.obj[prop] = value;
   }
   ObjectSpy.prototype.trigger = function(){
      for(var spy in this.spies){
         this.spies[spy].trigger();
      }
      this.multiListeners.iterate(function(m){
         m.ran = false;
      });
   };

})(window.pjs);
