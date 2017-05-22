(function(lib){
   'use strict';
   
   lib.replacement = {
      replace: replaceInTemplate
   };
   
   function replaceInTemplate(obj, templateString){
      var index = -1;
      var start = 0;
      var out = templateString;
      while((index = out.indexOf('{{', start)) > 0){
         var next = out.indexOf('}}', index)
         var tag = out.substring(index+2, next);
         var value = extractValue(obj, tag);
         
         var regExp = new RegExp('{{' + tag + '}}', 'g');
         out = out.replace(regExp, value);
         start = next;
      };
      
      return out;
   }
   
   function extractValue(obj, tag){
      var levels = tag;
      if (!Array.isArray(levels)){
         levels = tag.split('.');
      }
      if (levels.length === 0){
         return obj;
      } else {
         return extractValue(obj[levels[0]], levels.slice(1));
      }
   }
})(window.pjs);