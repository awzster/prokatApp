angular.module('toolRentalApp', [ 'ngRoute', 'ui.bootstrap' ])
  .config([ '$routeProvider', '$sceDelegateProvider', function($routeProvider, $sceDelegateProvider) {

    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://api-maps.yandex.ru/**',
      'https://yandex.ru/**'
    ]);

    $routeProvider
      .when('/', {
        templateUrl: '/prokatApp/views/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .when('/contacts', {
        templateUrl: '/prokatApp/views/contacts.html',
        controller: 'ContactsController',
        controllerAs: 'contacts'
      })
      .when('/category/:categoryId', {
        templateUrl: '/prokatApp/views/category.html',
        controller: 'CategoryController',
        controllerAs: 'category'
      })
      .when('/product/:productId', {
        templateUrl: '/prokatApp/views/product.html',
        controller: 'ProductController',
        controllerAs: 'product'
      })
    .otherwise({ redirectTo: '/' });

    // ... остальная конфигурация роутов ...
  } ])

