<script>

  var app = angular.module("forumapp",[]);
  
  app.directive("coledit",function($http){
	  return {
		  scope:{},
		  link:function(scope,elem,attrs){
			 
			  var columnId = attrs.columnid;
			  var content = "";
			  var t;
			  
			  elem.bind("click",function(){
				  elem.attr("contentEditable","true");
				  
			  })
			  
			  elem.bind("keyup",function(){
				  content = elem.text();
				  clearTimeout(t);
				  t = setTimeout(function(){
					  if(attrs.coledit === "name"){
						  $http.post("/column/"+columnId+"/updateName",{name:content});
					  }else{
						  $http.post("/column/"+columnId+"/updateDes",{des:content});
					  }
				  },2000)
			  })
			  
		  }
	  }
  })
  
  
  app.controller("ctrl",function($scope,$http){
	  $scope.createColumn = function(){
	  	  $http.post("/column/create",{name:$scope.name,des:$scope.des})
		  .success(function(data){
			  setTimeout(function(){
				  window.location.href= window.location.href;
			  },1000)
		  })
	  }
  });
</script>