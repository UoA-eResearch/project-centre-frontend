'use strict';

/* 
 * Check if user is logged in. If not, expire cookie,
 * set global variable isLoggedIn to false, and redirect
 * to other state
 */
function verifyUserLoggedIn($rootScope, $cookies, $state, $timeout) {
  var c = $cookies.get('eresearch');
  if (!$rootScope.isLoggedIn || c === undefined) {
    $rootScope.isLoggedIn = false;
    var expires = 'Thu, 01 Jan 1970 00:00:00 UTC';
    $cookies.put("eresearch","", {'expires': expires, 'path': '/project_centre'});
    redirectPath = window.location.href.split('#')[0];
    var hash = window.location.hash.slice(1);
    if (hash != '/not_logged_in') {
      redirectHash = hash;
    }
    // Use timeout because of https://github.com/angular-ui/ui-router/issues/1901
    $timeout(function(){
      $state.go('not-logged-in');
    });
  } 
}

angular
  .module('uoa_eresearch', [
    'ui.router',
    'ngResource',
    'ngSanitize',
    'ngCookies',
    'ui.breadcrumb',
    'uoa_eresearch.services',
    'uoa_eresearch.controllers' ])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $breadcrumbProvider)  {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
      .state('home', 
        { url: "/home", 
          views: { 'main@': { templateUrl: "views/home.html" } }, 
          breadcrumb: { label: 'Home' }
        }
      ).state('people',
        { url: "/people", 
          views: { 'main@': { templateUrl: "views/person-list.html" }}, 
          breadcrumb: { label: 'People' },
          onEnter: function($rootScope, $cookies, $state, $timeout) { verifyUserLoggedIn($rootScope, $cookies, $state, $timeout); }
        }
      ).state('projects', 
        { url: "/projects", 
          views: { 'main@': { templateUrl: "views/project-list.html" }},
          breadcrumb: { label: 'Projects' },
          onEnter: function($rootScope, $cookies, $state, $timeout) { verifyUserLoggedIn($rootScope, $cookies, $state, $timeout); }
        }
      ).state('researchoutputs', 
        { url: "/researchoutputs", 
          views: { 'main@': { templateUrl: "views/research-output-list.html" }}, 
          breadcrumb: { label: 'Research Output' },
          onEnter: function($rootScope, $cookies, $state, $timeout) { verifyUserLoggedIn($rootScope, $cookies, $state, $timeout); }
        }
      ).state('kpis', 
        { url: "/kpis", 
          views: { 'main@': { templateUrl: "views/project-kpi-list.html" }},
          breadcrumb: { label: 'KPIs'},
          onEnter: function($rootScope, $cookies, $state, $timeout) { verifyUserLoggedIn($rootScope, $cookies, $state, $timeout); }
        }
      ).state('not-logged-in', 
        { url: "/not_logged_in", 
          views: { 'main@': { templateUrl: "views/not_logged_in.html" }},
          breadcrumb: { skip: true }
        }
      ).state('logged-out', 
        { url: "/logged_out", 
          views: { 'main@': { templateUrl: "views/logged_out.html" }}, 
          breadcrumb: { skip: true}
        }
      ).state('people.person', 
        { url: "/:personId", 
          views: { 'main@': { templateUrl: 'views/person.html' }}, 
          breadcrumb: { 
              label: function($rootScope) { 
                       return new Promise(
                            function(resolve, reject) { 
                               resolve($rootScope.breadcrumbPersonPromise.then(
                                 function(person) { 
                                    return person['fullName']; 
                                 }
                               ))
                            }
                       );
                     },
              stateOptions: { reload: true }
           },
           onEnter: function($rootScope, $cookies, $state, $timeout) { verifyUserLoggedIn($rootScope, $cookies, $state, $timeout); }
        }
      ).state('projects.project', 
        { url: "/:projectId", 
          views: { 'main@': { templateUrl: 'views/project.html' }}, 
          breadcrumb: { 
              label: function($rootScope) { 
                       return new Promise(
                            function(resolve, reject) { 
                               resolve($rootScope.breadcrumbProjectWrapperPromise.then(
                                 function(projectWrapper) { 
                                    return projectWrapper['project']['title']; 
                                 }
                               ))
                            }
                       );
                     },
              stateOptions: { reload: true }
           },
           onEnter: function($rootScope, $cookies, $state, $timeout) { verifyUserLoggedIn($rootScope, $cookies, $state, $timeout); }
        });

      /* CORS... */
      /* http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api */
      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];})
   .directive('vmServiceInstance', function() {
       return {
           templateUrl : 'views/vm-instance.html'
       }
   })
  .constant(
      'appConfig', {
         'apiBaseUrl': '__REST_API_BASE_URL__'
      });
