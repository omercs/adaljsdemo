var phonecatServices = angular.module('phonecatControllers', []);

phonecatServices.factory('phoneListSvc', ['$http', function ($http) {
    return {
        getItems : function(){
            return $http.get('/api/PhoneList');
        },
        getItem : function(id){
            return $http.get('/api/PhoneList/' + id);
        },
        postItem : function(item){
            return $http.post('/api/PhoneList/', item);
        },
        putItem : function(item){
            return $http.put('/api/PhoneList/', item);
        },
        deleteItem : function(id){
            return $http({
                method: 'DELETE',
                url: '/api/PhoneList/' + id
            });
        }
    };
}]);