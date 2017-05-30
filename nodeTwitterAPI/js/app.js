angular.module('HelloWorldApp', [])
    .controller('HelloWorldController', function ($scope, $http) {

        $scope.search = {
            allwords: "",
            exactphrase: "",
            anyword: "",
            noneofthese: "",
            hashtags: "",
            lang: "",
            toaccounts: "",
            fromaccounts: ""
        };

        $scope.onClick = function () {
            console.log($scope.search);

            $http({
                url: '/search',
                method: "POST",
                data: { 'data': $scope.search }
            }).then(function (data) {
                $scope.response = data;
            }, function (error) {

            });
        };
    });