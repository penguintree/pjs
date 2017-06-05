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
      var spy = this.getSpy(prop);
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
      var segments = prop.split('.');
      var o = this.obj;
      var i = 0;
      while (i < segments.length - 1){
         o = o[segments[i]];
         i++;
      }
      return o[segments[i]];
   };
   ObjectSpy.prototype.setValue = function(prop, value){
      var segments = prop.split('.');
      var o = this.obj;
      var i = 0;
      while (i < segments.length - 1){
         o = o[segments[i]];
         i++;
      }

      //TODO: Type can chage (e.g. from number to string).
      o[segments[i]] = value;
   }
   ObjectSpy.prototype.trigger = function(){
      for(var spy in this.spies){
         this.spies[spy].trigger();
      }
      this.multiListeners.iterate(function(m){
         m.ran = false;
      });
   };
   ObjectSpy.prototype.getSpy = function(prop){
      if(this.spies[prop]){
         return this.spies[prop];
      }

      var split = prop.split('.');

      var actual = this.obj;
      var spy = undefined;
      for(var i = 0 ; i < split.length ; i++){
         var segment = split[i];
         spy = lib.spy.propertySpy(actual, segment)
         actual = actual[segment];
      }

      this.spies[prop] = spy;
      return spy;
   };

})(window.pjs);
