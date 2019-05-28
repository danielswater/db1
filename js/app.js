(function() {
    var app = angular.module('app', ['ui.router', 'ui.bootstrap']);

    app.config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'pages/home.html',
                controller: 'homeCtrl'
            })
            .state('game', {
                url: '/game',
                templateUrl: 'pages/game.html',
                controller: 'gameCtrl'
            })
    });

})();