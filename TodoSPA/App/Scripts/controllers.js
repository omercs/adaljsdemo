var phonecatApp = angular.module('phonecatApp', []);

phonecatApp.controller('PhoneListCtrl', function ($scope) {

    $scope.phones = [
     {
         'name': 'Nexus 5',
         'snippet': 'Fast just got faster with Nexus 5',
         'age': 1
     },
     {
         'name': 'Motorola A',
         'snippet': 'The Next, Next Generation tablet.',
         'age': 2
     },
     {
         'name': 'MOTOROLA B™',
         'snippet': 'The Next, Next Generation tablet.',
         'age': 3
     }
    ];

    $scope.orderProp = 'age';
});