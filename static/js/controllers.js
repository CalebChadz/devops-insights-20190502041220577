
var ConsoleModule = angular.module('ConsoleModule', ['ngRoute']);

ConsoleModule.config(['$routeProvider', '$locationProvider','$sceDelegateProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $sceDelegateProvider, $httpProvider) {
    $routeProvider.when('/', {
        templateUrl: '/partials/Byzip.html',
        controller: 'wcontroller',
        controllerAs: 'wcontroller'
    });
}]);

ConsoleModule.controller('wcontroller', ['$scope', '$http', '$routeParams', '$timeout', '$sce',
    function($scope, $http, $routeParams, $timeout, $sce) {

    $scope.somemessage = "Some weather";
    $scope.zip1Weather = "";

    $scope.zip = function(which) {

        var data = "";
        if(which === 1) {
            data = $scope.zip1m;
        } else if(which === 2) {
            data = $scope.zip2m;
        } else if(which === 3) {
            data = $scope.zip3m;
        } else if(which === 4) {
            data = $scope.zip4m;
        } 

        if(data.length > 4) {
            $http({
                method: "GET",
                url: '/api/v1/getWeather?city=' + data
            }).then( function(response) {
                if(which === 1) {
                    $scope.zip1Weather = response.data.weather;
                } else if(which === 2) {
                    $scope.zip2Weather = response.data.weather;
                } else if(which === 3) {
                    $scope.zip3Weather = response.data.weather;
                } else if(which === 4) {
                    $scope.zip4Weather = response.data.weather;
                } 
            });
        } else {
            if(which === 1) {
                    $scope.zip1Weather = "";
                } else if(which === 2) {
                    $scope.zip2Weather = "";
                } else if(which === 3) {
                    $scope.zip3Weather = "";
                } else if(which === 4) {
                    $scope.zip4Weather = "";
                } 
        }
    };
    
    }]);

function initMap1() {
    // The location of Uluru
    var uluru = { lat: -25.344, lng: 131.036 };
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 4, center: uluru });
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({ position: uluru, map: map });
}