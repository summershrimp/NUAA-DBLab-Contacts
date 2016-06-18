/**
 * Created by Summer on 6/17/16.
 */

angular.module("app").controller("LoginController", [
  '$scope','$rootScope','Api','$location',
  function($scope, $rootScope, Api, $location){
    if($rootScope.USER) {
      $location.path('/');
    }
    $scope.username = "";
    $scope.password = "";
    $scope.msg = "";

    $scope.doLogin = function() {
      $scope.msg = "";
      Api.login({username: $scope.username, password: $scope.password},
        function(result){
          $rootScope.USER = result;
          $location.path("/");
        },
        function(result){
          if(result.status == 401) {
            $scope.msg = "用户名或密码错误";
            return ;
          }
          $scope.msg = result.data.message;
        }
      );
    };
}]);