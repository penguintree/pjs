describe('objectSpy.js', function(){
   var objectSpy = window.pjs.spy.objectSpy
   var tick = new window.mocks.Tick();

   // ------------------------
   // ------- setValue -------
   // ------------------------
   describe('setValue', function(){
      it('simple prop - model value change', function(){
         var model = { prop: 'potato' };
         var spy = objectSpy(model, tick);

         spy.setValue('prop', 'soup');

         expect(model.prop).toBe('soup');
      });

      it('deep property - model value change', function(){
         var model = { deep: { prop : 'potato' } };
         var spy = objectSpy(model, tick);

         spy.setValue('deep.prop', 'soup');

         expect(model.deep.prop).toBe('soup');
      });

      it('simple prop - unexisting - throws', function(){
         var model = { prop : 'potato' };
         var spy = objectSpy(model, tick);

         expect(function() {
            spy.setValue('other', 'soup');
         }).toThrow('property "other" does not exists');
      });

      it('deep prop - unexisting - throws', function(){
         var model = { prop : 'potato' };
         var spy = objectSpy(model, tick);

         expect(function() {
            spy.setValue('deep.prop', 'soup');
         }).toThrow('property "deep" does not exists');
      });
   });

   // ------------------------
   // ------- getValue -------
   // ------------------------
   describe('getValue', function(){
      it('simple prop - get model value', function(){
         var model = { prop: 'potato' };
         var spy = objectSpy(model, tick);

         var value = spy.getValue('prop');

         expect(value).toBe('potato');
      });

      it('deep prop - get model value', function(){
         var model = { deep: { prop : 'potato' } };
         var spy = objectSpy(model, tick);

         var value = spy.getValue('deep.prop');

         expect(value).toBe('potato');
      });

      it('unexisting prop - undefined', function(){
         var model = { prop: 'potato' };
         var spy = objectSpy(model, tick);

         var value = spy.getValue('chewingGum');

         expect(value).toBeUndefined();
      });

      it('unexisting deep prop - undefined', function(){
         var model = { prop: 'potato' };
         var spy = objectSpy(model, tick);

         var value = spy.getValue('chewing.Gum');

         expect(value).toBeUndefined();
      });
   });

   // ------------------------
   // ------- register -------
   // ------------------------
   describe('register', function(){
      it('simple prop - handler run on change', function(){
         var model = { prop: 'potato' };

         var spy = objectSpy(model, tick);

         var handler = jasmine.createSpy('spyHandler');

         spy.register('prop', handler);

         model.prop = 'soup';
         tick.$trigger();

         expect(handler).toHaveBeenCalledWith('potato', 'soup');
         expect(handler.calls.count()).toBe(1);
      });

      it('deep prop -handler run on change', function(){
         var model = { deep: { prop: 'potato' } };

         var spy = objectSpy(model, tick);

         var handler = jasmine.createSpy('spyHandler');

         spy.register('deep.prop', handler);

         model.deep.prop = 'soup';
         tick.$trigger();

         expect(handler).toHaveBeenCalledWith('potato', 'soup');
         expect(handler.calls.count()).toBe(1);
      });

      it('multiple handler - only good handler called', function(){
         var model = { prop: 'potato', deep: { prop: 'soup' } };

         var spy = objectSpy(model, tick);

         var handlerProp = jasmine.createSpy('spyHandlerA');
         var handlerDeep = jasmine.createSpy('spyHandlerB');

         spy.register('prop', handlerProp);
         spy.register('deep.prop', handlerDeep);

         model.prop = 'tacos';
         tick.$trigger();

         expect(handlerProp).toHaveBeenCalledWith('potato', 'tacos');
         expect(handlerProp.calls.count()).toBe(1);
         expect(handlerDeep.calls.count()).toBe(0);

         handlerProp.calls.reset();
         handlerDeep.calls.reset();

         model.deep.prop = 'margarita';
         tick.$trigger();

         expect(handlerDeep).toHaveBeenCalledWith('soup', 'margarita');
         expect(handlerDeep.calls.count()).toBe(1);
         expect(handlerProp.calls.count()).toBe(0);
      });

      xit('unexisting prop - throws', function(){
      });

      xit('unexisting deep prop - throws', function(){
      });

      it('successive tick trigger - handler run once', function(){
         var model = { prop: 'potato' };

         var spy = objectSpy(model, tick);

         var handler = jasmine.createSpy('spyHandler');

         spy.register('prop', handler);

         model.prop = 'soup';
         tick.$trigger();

         expect(handler).toHaveBeenCalledWith('potato', 'soup');
         expect(handler.calls.count()).toBe(1);

         tick.$trigger();

         expect(handler).toHaveBeenCalledWith('potato', 'soup');
         expect(handler.calls.count()).toBe(1);
      });

      it('multiple handlers on same prop - every handlers triggered', function(){
         var model = { prop: 'potato' };

         var spy = objectSpy(model, tick);

         var handlerA = jasmine.createSpy('spyHandlerA');
         var handlerB = jasmine.createSpy('spyHandlerB');

         spy.register('prop', handlerA);
         spy.register('prop', handlerB);

         model.prop = 'soup';

         tick.$trigger();

         expect(handlerA).toHaveBeenCalledWith('potato', 'soup');
         expect(handlerA.calls.count()).toBe(1);
         expect(handlerB).toHaveBeenCalledWith('potato', 'soup');
         expect(handlerB.calls.count()).toBe(1);
      });

      xit('mutliple handlers on different props - every handlers triggered', function(){
      });

      it('successive affectation between triggers - handler called once', function(){
         var model = { prop: 'potato' };

         var spy = objectSpy(model, tick);

         var handler = jasmine.createSpy('spyHandler');

         spy.register('prop', handler);

         model.prop = 'soup';
         model.prop = 'macaroni';
         model.prop = 'enchilada';

         tick.$trigger();

         expect(handler).toHaveBeenCalledWith('potato', 'enchilada');
         expect(handler.calls.count()).toBe(1);
      });

      xit('multiple spies on same object - every handlers triggers', function(){
      });

      it('simple prop - setValue trigger event', function(){
         var model = { prop: 'potato' };

         var spy = objectSpy(model, tick);

         var handler = jasmine.createSpy('spyHandler');

         spy.register('prop', handler);

         spy.setValue('prop', 'soup');

         tick.$trigger();

         expect(handler).toHaveBeenCalledWith('potato', 'soup');
         expect(handler.calls.count()).toBe(1);
      });

      it('deep prop - setValue trigger event', function(){
         var model = { deep: { prop: 'potato' } };

         var spy = objectSpy(model, tick);

         var handler = jasmine.createSpy('spyHandler');

         spy.register('deep.prop', handler);

         spy.setValue('deep.prop', 'soup');

         tick.$trigger();

         expect(handler).toHaveBeenCalledWith('potato', 'soup');
         expect(handler.calls.count()).toBe(1);
      });

      xit('array prop - add item - event triggered', function(){
      });

      xit('array prop - remove item - event triggered', function(){
      });

      xit('array prop - set item - event triggered', function(){
      });

      xit('array prop - replace array - event triggered', function(){
      });

      xit('array model - add item - event triggered', function(){
      });

      xit('array model - remove item - event triggered', function(){
      });

      xit('array model - set item - event triggered', function(){
      });

      xit('array model - replace array - event triggered', function(){
      });
   });

   // ------------------------
   // ------- release --------
   // ------------------------
   describe('release', function(){
      xit('release handler - all handler removed', function(){
      });
   });
});
