var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatControllers',
  'phoneListSvc',
  'AdalAngular',
  'jwtHelperSvc'
]);

phonecatApp.config(['$routeProvider', '$httpProvider', 'adalAuthenticationServiceProvider', function ($routeProvider, $httpProvider, adalProvider) {
      $routeProvider.
        when('/home', {
            templateUrl: 'App/Views/home.html',
            controller: 'HomeCtrl'
        }).
        when('/phones', {
            templateUrl: 'App/Views/phoneList.html',
            controller: 'PhoneListCtrl',
            requireADLogin: true
        }).
        when('/phones/:phoneId', {
            templateUrl: 'App/Views/phoneDetail.html',
            controller: 'PhoneDetailCtrl'
        }).
        otherwise({
            redirectTo: '/home'
        });


      adalProvider.init(
        {
            tenant: '0fd157fc-29ea-4fb5-bdbc-a195bd16ff80',
            clientId: 'cb68f72f-2b04-42e1-bcf6-db25ddd48a5c',
            extraQueryParameter: 'nux=1',
            cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
        },
        $httpProvider
        );
  }]);