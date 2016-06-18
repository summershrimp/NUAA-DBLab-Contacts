/**
 * Created by Summer on 6/17/16.
 */
angular.module("app").controller("NavController", [
  '$rootScope','$scope', 'Api', '$location', 'EditorParams',
  function($rootScope, $scope, Api, $location, EditorParams){
    $scope.loggedIn = false;
    $scope.USER = null;
    $rootScope.$on("USER.CHANGE", function(){
      $scope.loggedIn = $rootScope.USER ? true : false;
      $scope.USER = $rootScope.USER
    });

    $scope.doLogout = function() {
      Api.logout(function(result){
        $rootScope.USER = null;
      })
    };
    $scope.jumpList = function() {
      $location.path('/');
    };

    $scope.jumpRegister = function() {
      $location.path('/register');
    };

    $scope.jumpLogin = function() {
      $location.path('/login');
    };

    $scope.jumpNew = function() {
      EditorParams.setContactId(null);
      $location.path('/edit');
    }

    $scope.jumpSearch = function() {
      $location.path('/search');
    }

  }]);