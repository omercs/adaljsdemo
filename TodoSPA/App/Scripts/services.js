var phonecatServices = angular.module('phoneListSvc', []);

phonecatServices.factory('phoneListSvc', ['$http', function ($http) {
    return {
        getItems: function () {
            dataResults = [];

            // do some processing on json response 
            $http.get('/api/phoneList').success(function (data) {

                for (var i = 0; i < data.length; i++) {
                    dataResults.push(data[i]);
                }
                
            });
            return dataResults;

     //       return [
     //{
     //    'id': 1,
     //    'name': 'Nexus 5',
     //    'snippet': 'Updated Fast just got faster with Nexus 5',
     //    'age': 1
     //},
     //{
     //    'id': 2,
     //    'name': 'Motorola A',
     //    'snippet': 'The Next, Next Generation tablet.',
     //    'age': 2
     //},
     //{
     //    'id': 3,
     //    'name': 'MOTOROLA B™',
     //    'snippet': 'The Next, Next Generation tablet.',
     //    'age': 3
     //}
     //       ];
        },
        getItem: function (id) {
            return $http.get('/api/PhoneList/' + id);
        },
        postItem: function (item) {
            return $http.post('/api/PhoneList/', item);
        },
        putItem: function (item) {
            return $http.put('/api/PhoneList/', item);
        },
        deleteItem: function (id) {
            return $http({
                method: 'DELETE',
                url: '/api/PhoneList/' + id
            });
        }
    };
}]);