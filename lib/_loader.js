(function(){
   'use strict';
   var eventLibLoaded = 'librairyLoaded';

   var scriptName = '_loader.js';
   var getThisScriptTag = (function(){
      if (document.currentScript){
         return function(){
            return document.currentScript;
         };
      } else {
         var tag = document.querySelector('script[src$="' + scriptName + '"]');
         return function(){
            return tag;
         }
      }
   })();


   var scripts = [
      'shims',
      'array.extension',
      'main',
      'tick',
      'requests',
      'spy',
      'template',
      'template.parser',
      'template.attributes.parser',
      'template.mustaches.parser',
      'component',
      'component.instance'
   ];

   var thisScriptTag = getThisScriptTag();
   var baseUrl = thisScriptTag.getAttribute('src').replace(scriptName, '');

   loadScripts(0);

   function loadScripts(nextIndex){
      if (nextIndex >= scripts.length){
         var event = new Event(eventLibLoaded);
         document.dispatchEvent(event);
      } else {
         var url = baseUrl + scripts[nextIndex] + '.js';
         var tag = document.createElement('script');
         tag.setAttribute('src', url);

         tag.onload = function(){
            loadScripts(nextIndex+1);
         };

         thisScriptTag = insertAfterNode(tag, thisScriptTag);
      }
   }

   function insertAfterNode(newNode, referenceNode){
      var parent = referenceNode.parentNode;
      var next = referenceNode.nextSibling;
      if (next){
         return parent.insertBefore(newNode, next);
      } else {
         return parent.appendChild(newNode);
      }
   }
})();
