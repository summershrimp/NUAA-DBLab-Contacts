/**
 * Created by Summer on 6/17/16.
 */
angular.module("app").controller("EditController", [
  '$scope', 'Api', 'EditorParams','$location',
  function($scope, Api, EditorParams, $location){
    $scope.contact = {
      items:[]
    };
    $scope.contact_id = EditorParams.getContactId();
    $scope.editing = $scope.contact_id == null ? true : false;

    if($scope.contact_id != null) {
      Api.getContact({contact_id: $scope.contact_id},
        function (result) {
          $scope.contact = result.data;
        },
        function (result) {
          alert(result.data.message || "请求失败");
        }
      );
    }
    $scope.addItem = function(){
      $scope.contact.items.push({id:null, type_id: "1", value:""});
    };

    $scope.save = function(){
      Api.addContact($scope.contact, function(result){
        $location.path('/');
      }, function(result){
        alert(result.data.message || "插入失败");
      })
    };
    $scope.cancel = function(){
      if(confirm("确认放弃？")){
        $location.path('/');
      }
    }
  }]);