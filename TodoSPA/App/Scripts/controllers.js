var phonecatControllers = angular.module('phonecatControllers', ['phoneListSvc', 'jwtHelperSvc']);

phonecatControllers.controller('PhoneListCtrl', ['$scope', 'phoneListSvc', 'adalAuthenticationService', 'jwtHelperSvc', function ($scope, phoneListSvc, adalAuthenticationService, jwtHelperSvc) {
    $scope.test = function () {
        
        var token = adalAuthenticationService.getCachedToken(adalAuthenticationService.config.clientId);
        var jwtHelper = new jwtHelperSvc('', adalAuthenticationService.config.tenant, token, adalAuthenticationService.config.clientId);
        var result = jwtHelper.verifyAADToken();
        console.log("Result:" + result);

    };
    $scope.phones = phoneListSvc.getItems();
    $scope.orderProp = 'age';
}]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
      $scope.phoneId = $routeParams.phoneId;
  }]);

phonecatApp.controller('HomeCtrl', function ($scope) {

    $scope.message = "hello world";
});

