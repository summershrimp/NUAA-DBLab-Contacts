/**
 * Created by Summer on 6/17/16.
 */
angular.module('app').directive('item', function() {
  var controller = ['$rootScope', '$scope', 'Api',
    function($rootScope, $scope){
      $scope.TYPES = $rootScope.TYPES;
      $scope.data.type_id && ($scope.data.type_id = $scope.data.type_id.toString());
    }];

  return {
    restrict : 'E',
    replace : true,
    scope : {
      data : '='
    },
    templateUrl : '/app/item/item.html',
    controller: controller
  }
});