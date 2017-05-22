(function(lib){
   'use strict';
   
   lib.http = {
      get: function(url){
         return send('GET', url);
      },
      getJSON: function(url){
         return send('GET', url, 'application/json');
      }
   };
   
   var parsers = {
      'application/json': parseResponseJSON,
      'default': parseResponseDefault
   };
   
   function send(verb, url, accept, body, contentType){
      var promise = lib.factories.promise();
      var request = new XMLHttpRequest();
      request.onreadystatechange = onReadyStateChange(promise, request, accept);
      
      if (contentType){
         request.setRequestHeader('Content-Type', contentType);
      }
      if (accept){
         request.setRequestHeader('Accept', accept);
      }
      
      request.open(verb, url);
      request.send();
      
      return promise.$promise;
   }
   
   function onReadyStateChange(promise, request, accept){
      return function(){
         if (request.readyState === XMLHttpRequest.DONE){
            if (isSuccess(request.status)){
               var parser = getParser(accept);
               var response = parser(request.responseText);
               promise.resolve(response, request.status);
            } else {
               promise.reject(response.status, response.responseText);
            }
         }
      };
   }
   
   function isSuccess(status){
      var s = parseInt(status/100);
      return s === 2;
   }
   
   function getParser(accept){
      var parser = parsers[accept];
      if (!parser) parser = getDefaultParser();
      
      return parser;
   };
   function getDefaultParser(){
      return parsers['default'];
   };
   
   function parseResponseJSON(responseText){
      return JSON.parse(responseText);
   }
   
   function parseResponseDefault(responseText){
      return responseText;
   }
   
})(window.pjs);
