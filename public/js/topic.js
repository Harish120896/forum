app.directive("reply",function($rootScope,$sce){
  
  return {
    scope:{
      parent:"@parent"
    },
    templateUrl:"/template/reply.html",
    link:function(scope,elem,attrs){
      
      scope.refreshNum = function(){
        $rootScope.refreshNum();
      }
      
      $rootScope.$watch("time",function(v){
        scope.time = v;
      })
      
      scope.$watch("parent",function(){
        if(scope.parent){
          var parent = document.querySelector("#"+scope.parent);
          parent.appendChild(elem[0]);
          console.log(222)
          scope.startedit = 'ui-epic-editor'+Date.now();
        }
      })
    }
  }
  
})

.directive('uiEpicEditor', function() {
    return {
        scope:{content:"=",startedit:"@startedit"},
        replace:true,
        template:'<div class="epic-editor"></div>',
        link: function(scope, element, attrs,ctrl) {
            
          scope.$watch("startedit",function(v){
            console.log(v)
            if(v){
              var opts = {
                  container: element[0],
                  basePath: ''
              }
                        
              var editor = new EpicEditor(opts);
            
              editor.load(function () {
                  var iFrameEditor = editor.getElement('editor');
                  editor.on("update",function(){
                    scope.$parent.txt = iFrameEditor.body.innerText;
                    scope.$apply()
                  })
         
              });
            }
          })
            
      
        }
    }
})
.controller("replyCtrl",function($scope,$http,$rootScope){
	
	$scope.$watch("topicId",function(){
		$http.get("/replyTree/"+$scope.topicId).success(function(data){
			$scope.replyTree = data;
			$scope.render();
		})
	})
	
  $scope.toreply = function(id){
    $scope.parent = id;
  }
  
	$scope.render = function(){
		var rs = $scope.replyTree.slice(0,$scope.shownum);
		
		for(var i=0,len=rs.length;i<len;i++){
			(function(id){
				$http.get("/reply/"+id).success(function(data){
					$scope.replys[id] = data;
				});
			})(rs[i].id);
		}
	}
	
	$scope.subReply = function(rid){
		var rs = $scope.replyTree;
		for(var i=0,len=rs.length;i<len;i++){
			if(rs[i].id === rid){
				return rs[i].childIds;
			}
		}
	}

	$scope.shownum = 3;
	$scope.replys = {}
	
	$scope.more= function(){
		
		this.shownum += 3;
		this.render();
	}
	
	var showReplyId = null;
	
	
	$scope.openReplyTextarea = function(id){
		showReplyId = id;
		this.content = "";
	}
	
	$scope.showTextarea = function(id){
		if(showReplyId === id){
			return true;
		}
	}
	
	$scope.reply = function(){
		
		var option = {
					title:"回帖",
					body:$scope.body,
					validat_num:$scope.validat_num,
					topicId:$scope.topicId,
					parentId:showReplyId
		}
				
		$http.post("/reply/create",option).success(function(data){
            if (data.result === "success") {
				setTimeout(function(){
					window.location.reload();
				},1000)
			} else {
                var keys = Object.keys(data.result);
                keys.forEach(function(key) {
                    $scope[key + "Message"] = data.result[key][0];
                })
                $rootScope.refreshNum();
            }
		})		
	}
	
	$scope.createReply = function(){
		var option = {
					title:$scope.title,
					body:$scope.body,
					validat_num:$scope.validat_num,
					topicId:$scope.topicId
				}
		$http.post("/reply/create",option).success(function(data){
            if (data.result === "success") {
				setTimeout(function(){
					window.location.reload();
				},1000)
			} else {
                var keys = Object.keys(data.result);
                keys.forEach(function(key) {
                    $scope[key + "Message"] = data.result[key][0];
                })
                $rootScope.refreshNum();
            }
		})
	}
})
