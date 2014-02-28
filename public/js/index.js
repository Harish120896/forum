app.controller("createColumnCtrl",function($scope,$http){
	
  $scope.createColumn = function(){
	  
  	  $http.post("/column/create",{name:$scope.name,des:$scope.des})
	  .success(function(data){
		  setTimeout(function(){
			  window.location.href= window.location.href;
		  },1000)
	  })
  }
  
});

app.controller("columnCtrl",function($scope,$http){
	
	
	$scope.updateColumn = function(id){
   	   $http.get("/column/"+id+"/get")
  	  .success(function(data){
		  $scope.ucolumn = data;
  	  })
	}
	
	$scope.update = function(){
    	  $http.post("/column/"+$scope.ucolumn.id+"/update",$scope.ucolumn)
  	  .success(function(data){
		  $("#updateColumnDialog").modal("hide");
  		  setTimeout(function(){
			  	window.location.reload();
  		  },1000)
  	  })
	}
	
})


