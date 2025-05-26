angular.module('toolRentalApp')
    .factory('ToolService', function($http) {
        return {
            getTools: function() {
                return $http.get('data/tools.json').then(function(response) {
                    return response.data.tools;
                });
            },
            getCategories: function() {
                return $http.get('data/tools.json').then(function(response) {
                    return response.data.categories;
                });
            }
        };
    });