describe('objectSpy.js', function(){
   var objectSpy = window.pjs.spy.objectSpy

   describe('setValue', function(){
      it('simple prop - model value change', function(){
         var model = { prop: 'potato' };
         var spy = objectSpy(model);

         spy.setValue('prop', 'soup');

         expect(model.prop).toBe('soup');
      });

      it('deep property - model value change', function(){
         var model = { deep: { prop : 'potato' } };
         var spy = objectSpy(model);

         spy.setValue('deep.prop', 'soup');

         expect(model.deep.prop).toBe('soup');
      });

      it('simple prop - unexisting - throws', function(){
         var model = { prop : 'potato' };
         var spy = objectSpy(model);

         expect(function() {
            spy.setValue('other', 'soup');
         }).toThrow('property "other" does not exists');
      });

      it('deep prop - unexisting - throws', function(){
         var model = { prop : 'potato' };
         var spy = objectSpy(model);

         expect(function() {
            spy.setValue('deep.prop', 'soup');
         }).toThrow('property "deep" does not exists');
      });
   });

   describe('getValue', function(){
      it('simple prop - get model value', function(){
         var model = { prop: 'potato' };
         var spy = objectSpy(model);

         var value = spy.getValue('prop');

         expect(value).toBe('potato');
      });

      it('deep prop - get model value', function(){
         var model = { deep: { prop : 'potato' } };
         var spy = objectSpy(model);

         var value = spy.getValue('deep.prop');

         expect(value).toBe('potato');
      });

      it('unexisting prop - undefined', function(){
         var model = { prop: 'potato' };
         var spy = objectSpy(model);

         var value = spy.getValue('chewingGum');

         expect(value).toBeUndefined();
      });

      it('unexisting deep prop - undefined', function(){
         var model = { prop: 'potato' };
         var spy = objectSpy(model);

         var value = spy.getValue('chewing.Gum');

         expect(value).toBeUndefined();
      });
   });
});
