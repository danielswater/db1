(function() {
    'use strict';
    var app = angular.module('app');

    app.component('header', {
        templateUrl: '/pages/component/headerComponent.html',
        controller: 'headerController'
    });
})();