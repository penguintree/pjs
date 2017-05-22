(function(lib){
   'use strict';

   //TODO
   //Ne pas créer de spy en double (identifier l'objet, la propriété...
   //Récupérer un spy existant.
   //Spy factory   

   //lib.PropertySpy = PropertySpy;
   
   lib.spy = {
      objectSpy: function(obj) { return new ObjectSpy(obj); }
   };
   
   function ObjectSpy(obj){
      this.obj = obj;
      this.spies = {};
      this.multiListeners = [];
   }
   ObjectSpy.prototype.register = function(prop, listener){
      var spy = this.spies[prop] || (this.spies[prop] = new PropertySpy(this.obj, prop));
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
   ObjectSpy.prototype.trigger = function(){
      for(var spy in this.spies){
         this.spies[spy].trigger();
      }
      this.multiListeners.iterate(function(m){
         m.ran = false;
      });
   };
   
   function PropertySpy(obj, prop){
      this.value = obj[prop];
      this.oldValue = obj[prop];
      this.name = prop;
      this._lock = 0;
      
      this.listeners = [];
      
      var spy = this;
      var propDef = {
         get:function(){
            return spy.get();
         },
         set:function(n){
            return spy.set(n);
         }
      };
      Object.defineProperty(obj, prop, propDef);
   }
   
   PropertySpy.prototype.register = function(handler){
      this.listeners.push(handler);
   };
   
   PropertySpy.prototype.trigger = function(){
      this.lock();;
      if(this.isDirty()){
         this.listeners.iterate(function(handler){
            handler(this.name, this.value, this.oldValue);
         }, this);
         this.oldValue = this.value;
      }
      this.unlock()
   };
   
   PropertySpy.prototype.lock = function(){
      this._lock++;
   };
   PropertySpy.prototype.unlock = function(){
      this._lock = Math.max(this._lock - 1, 0);
   };
   PropertySpy.prototype.isLocked = function(){
      return this._lock > 0;
   }
   
   PropertySpy.prototype.isDirty = function(){
      return this.oldValue !== this.value;
   };
   
   PropertySpy.prototype.get = function(){
      return this.value;
   };
   PropertySpy.prototype.set = function(newValue){
      if(this.isLocked()){
         var spy = this;
         setTimeout(function(){
            spy.setValue(newValue);
         }, 5);
      }
      this.value = newValue;
      return this.value;
   }
   
})(window.pjs);