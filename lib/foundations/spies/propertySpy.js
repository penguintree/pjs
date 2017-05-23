(function(lib){

   lib.spy = lib.spy || {};
   lib.spy.propertySpy = function(obj, prop){
      return new PropertySpy(obj, prop);
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
            spy.set(newValue);
         }, 5);
      }
      this.value = newValue;
      return this.value;
   }

})(window.pjs);
