/**
 * Created by Summer on 6/17/16.
 */

angular.module('app').factory("Api",[
  '$resource',
  function($resource){
    var actions = {
      checkLogin: {method: 'GET', url: '/api/login'},
      login: {method: 'POST', url: '/api/login'},
      logout: {method: 'DELETE', url: '/api/login'},
      getTypes: {method: 'GET', url: '/api/types'},
      register: {method: 'POST', url: '/api/register'},
      getAllContacts: {method: 'GET', url: '/api/contacts'},
      delContact: {method: 'DELETE', url: '/api/contact/:contact_id'},
      getContact: {method: 'GET', url: '/api/contact/:contact_id'},
      addContact: {method: 'POST', url: '/api/contact'},
      search: {method: 'POST', url: '/api/search'}
    };

    return $resource('', {}, actions);
}]);