var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('PhoneListCtrl', function ($scope) {

    $scope.phones = [
     {
         'id': 1,
         'name': 'Nexus 5',
         'snippet': 'Fast just got faster with Nexus 5',
         'age': 1
     },
     {
         'id': 2,
         'name': 'Motorola A',
         'snippet': 'The Next, Next Generation tablet.',
         'age': 2
     },
     {
         'id': 3,
         'name': 'MOTOROLA B™',
         'snippet': 'The Next, Next Generation tablet.',
         'age': 3
     }
    ];

    $scope.orderProp = 'age';
});

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
      $scope.phoneId = $routeParams.phoneId;
  }]);

phonecatApp.controller('HomeCtrl', function ($scope) {

    $scope.message = "hello world";
});

