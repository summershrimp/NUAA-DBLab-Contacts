/**
 * Created by Summer on 6/17/16.
 */

angular.module("app").controller("SearchController", [
  '$scope', 'Api', 'EditorParams','$location',
  function($scope, Api, EditorParams, $location){
    $scope.contacts = [];
    $scope.keyword = "";

    $scope.doSearch = function() {
      Api.search({keyword: $scope.keyword},
        function(result){
          $scope.contacts = result.data;
        },
        function(result){

        })
    };
    $scope.edit = function(id){
      EditorParams.setContactId(id);
      $location.path('/edit');
    };

    $scope.del = function(id){
      Api.delContact({contact_id: id},
        function(result){
          for (var i in $scope.contacts){
            if ($scope.contacts[i].id == id) {
              $scope.contacts.splice(i, 1);
            }
          }
        },
        function(result){
          alert(result.data.message || "删除失败");
        }
      );
    };

  }]);