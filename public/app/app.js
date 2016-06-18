/**
 * Created by Summer on 6/17/16.
 */

var app = angular.module('app', ['ngRoute', 'ngResource']);
app.config(['$routeProvider', function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: '/app/index/index.html',
        controller: 'IndexController'
      })
      .when('/login', {
        templateUrl: '/app/login/login.html',
        controller: "LoginController"
      })
      .when('/register', {
        templateUrl: '/app/register/register.html',
        controller: "RegisterController"
      })
      .when('/search', {
        templateUrl: '/app/search/search.html',
        controller: "SearchController"
      })
      .when('/edit', {
        templateUrl: '/app/edit/edit.html',
        controller: "EditController"
      })
      .otherwise({
        redirctTo: '/'
      });
  }]
);

app.run([
  '$rootScope', 'Api', '$location',
  function($rootScope, Api, $location){
    $rootScope.USER = true;
    $rootScope.TYPES = {};

    $rootScope.$watch('USER', function() {
      $rootScope.$broadcast("USER.CHANGE");
      if(!$rootScope.USER) {
        $location.path('/login');
      }
    });

    Api.checkLogin(function(result){
      $rootScope.USER = result;
    },function(result){
      $rootScope.USER = null;
    });

    Api.getTypes(function(result){
      $rootScope.TYPES = result.data;
    })

  }]);