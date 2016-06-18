/**
 * Created by Summer on 6/17/16.
 */
angular.module("app").controller("RegisterController", [
  '$scope','$rootScope','Api','$location',
  function($scope, $rootScope, Api, $location){
    if($rootScope.USER) {
      $location.path('/');
    }

    $scope.username = "";
    $scope.password = "";
    $scope.password_again = "";
    $scope.msg = "";

    $scope.doRegister = function(){
      $scope.msg = "";
      if($scope.password !== $scope.password_again) {
        $scope.msg = "两次密码不一致";
        return;
      }

      Api.register({username: $scope.username, password:$scope.password},
        function(data){
          $scope.msg = "注册成功！";
          setTimeout(function(){
            $location.path('/login');
          }, 2000);
        },
        function(result){
          $scope.msg = result.data.message || "注册失败";
        }
      );
    }
  }]);