/**
 * Created by Summer on 6/17/16.
 */
angular.module('app').factory('EditorParams', function () {

  var data = {
    contactId: null
  };

  return {
    getContactId: function () {
      return data.contactId;
    },
    setContactId: function (id) {
      data.contactId = id;
    }
  };
});