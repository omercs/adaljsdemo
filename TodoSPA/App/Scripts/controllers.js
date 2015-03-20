var phonecatControllers = angular.module('phonecatControllers', ['phoneListSvc']);

phonecatControllers.controller('PhoneListCtrl', ['$scope', 'phoneListSvc', function($scope, phoneListSvc) {

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

