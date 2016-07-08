'use strict';

/* Controllers */

var app = angular.module('uoa_eresearch.controllers', []);

// Clear browser cache (in development mode)
//
// http://stackoverflow.com/questions/14718826/angularjs-disable-partial-caching-on-dev-machine
//app.run(function ($rootScope, $templateCache) {
//  $rootScope.$on('$viewContentLoaded', function () {
//    $templateCache.removeAll();
//  });
//});

function createDivisionAffiliationString(rawDivisions) {
  // create hierarchical division strings for each division
  var divisions = {}
  rawDivisions.map(function(division) {
    var tmp = division['name']
    var id = division['id']
    //while('parent' in division) {
    while (division['parent'] != null) {
      tmp = division['parent']['name'] + ' - ' + tmp;
      division = division['parent'];
    }
    divisions[id] = tmp;
  });
  return divisions; 
}

function handleLoginStatus($rootScope, $location) {
  if (!$rootScope.isLoggedIn) {
    redirectPath = window.location.href.split('#')[0];
    var hash = window.location.hash.slice(1);
    if (hash != '/not_logged_in') {
      redirectHash = hash;
    }
    console.log(redirectPath);
    console.log(redirectHash);
    $location.path('/not_logged_in');
  }
}

app.controller('PersonListCtrl', ['$rootScope', '$scope', 'PersonListFactory', 'DivisionFactory', '$location', '$q',
  function ($rootScope, $scope, PersonListFactory, DivisionFactory, $location, $q) {

    /* callback for ng-click 'showPerson': */
    $scope.showPerson = function(personId) {
      $location.path('/person/' + personId);
    };

    // load divisions and persons
    var persons = PersonListFactory.show();
    var rawDivisions = DivisionFactory.show();

    // after divisions and persons have been loaded
    $q.all([rawDivisions.$promise, persons.$promise]).then(function(data) {
       // create hierarchical division strings for each division
       var divisions = createDivisionAffiliationString(data[0]);

       // augment person with hierarchical affiliation string
       data[1].map(function(person) {
         if ('affiliations' in person) {
           person['affiliationString'] = divisions[person['affiliations'][0]['division']['id']]; 
         } else {
           person['affiliationString'] = 'N/A';
         }
       });

       $scope.divisions = divisions;
       $scope.persons = persons;
    }).catch(function(data) {
       if (data.status === -1) { // -1 means no tuakiri session
         $rootScope.isLoggedIn = false;
         handleLoginStatus($rootScope, $location);
       }
    }); 
    $scope.sortType = 'fullName';
    $scope.sortReverse = false;
  }
]);

app.controller('ProjectListCtrl', ['$rootScope', '$scope', 'ProjectListFactory', 'DivisionFactory', '$location', '$q',
  function ($rootScope, $scope, ProjectListFactory, DivisionFactory, $location, $q) {

    /* callback for ng-click 'showPerson': */
    $scope.showProject = function(projectId) {
      $location.path('/project/' + projectId);
    };

    var projects = ProjectListFactory.show();
    var rawDivisions = DivisionFactory.show();

    // after divisions and persons have been loaded
    $q.all([rawDivisions.$promise, projects.$promise]).then(function(data) {
       // create hierarchical division strings for each division
       var divisions = createDivisionAffiliationString(data[0]);

       // augment project with hierarchical affiliation string
       data[1].map(function(project) {
         if ('divisions' in project) {
           project['affiliationString'] = divisions[project['divisions'][0]['division']['id']];       
         } else {
           project['affiliationString'] = 'N/A';
         }
       });

       $scope.divisions = divisions;
       $scope.projects = projects;
    }).catch(function(data) {
       console.warn(data);
       if (data.status === -1) {
         $rootScope.isLoggedIn = false;
         handleLoginStatus($rootScope, $location);
       }
    });
    $scope.sortType = 'code';
    $scope.sortReverse = true;
  }
]);

app.controller('PersonCtrl', ['$rootScope', '$scope', '$stateParams', 'PersonFactory', 'DivisionFactory', '$location', '$q',
  function ($rootScope, $scope, $stateParams, PersonFactory, DivisionFactory, $location, $q) {
 
    var person = PersonFactory.show({id: $stateParams.personId});
    $rootScope.breadcrumbPersonPromise = person.$promise;

    var rawDivisions = DivisionFactory.show();

    // after divisions and person have been loaded
    $q.all([rawDivisions.$promise, person.$promise]).then(function(data) {
       // create hierarchical division strings for each division
       var divisions = createDivisionAffiliationString(data[0]);

       // augment person with hierarchical affiliation string
       person['affiliations'].map(function(affil) {
         affil['divisionString'] = divisions[affil['division']['id']];
       });

       $scope.divisions = divisions;
       $scope.person = person;
    }).catch(function(data) {
       if (data.status === -1) {
         $rootScope.isLoggedIn = false;
         handleLoginStatus($rootScope, $location);
       }
    });
  }
]);

app.controller('ProjectWrapperCtrl', ['$rootScope', '$scope', '$stateParams', 'ProjectWrapperFactory', 'DivisionFactory', '$location', '$q',
  function ($rootScope, $scope, $stateParams, ProjectWrapperFactory, DivisionFactory, $location, $q) {

    /* callback for ng-click 'showPerson': */
    $scope.showPerson = function(personId) {
      $location.path('/person/' + personId);
    };

    // load divisions and project
    var projectWrapper = ProjectWrapperFactory.show({id: $stateParams.projectId});
    $rootScope.breadcrumbProjectWrapperPromise = projectWrapper.$promise;
    var rawDivisions = DivisionFactory.show();

    // after divisions and person have been loaded
    $q.all([rawDivisions.$promise, projectWrapper.$promise]).then(function(data) {
       // create hierarchical division strings for each division
       var divisions = createDivisionAffiliationString(data[0]);

       var divisionStrings = [];
       // augment projectWrapper['project'] with hierarchical affiliation string
       projectWrapper['project']['divisions'].map(function(projectDivision) {
         divisionStrings.push(divisions[projectDivision['division']['id']]);
       });
       projectWrapper['project']['divisionStrings'] = divisionStrings;

       // augment projectWrapper['personProjects'] with hierarchical affiliation string
       projectWrapper['members'].map(function(personProject) {
         personProject['person']['affiliations'].map(function(personAffiliation) {
           personAffiliation['divisionName'] = divisions[personAffiliation['division']['id']];
         });
       });


       $scope.projectWrapper = projectWrapper;
    }).catch(function(data) {
       if (data.status === -1) {
         $rootScope.isLoggedIn = false;
         handleLoginStatus($rootScope, $location);
       }
    });

    $scope.pSortType = 'person.fullName';
    $scope.pSortReverse = false;
    $scope.paSortType = 'date';
    $scope.paSortReverse = true;
    $scope.roSortType = 'date';
    $scope.roSortReverse = true;
    $scope.kpiSortReverse = true;
    $scope.kpiSortType = 'date';
    $scope.erSortReverse = true;
    $scope.erSortType = 'date';
  }

]);

app.controller('PersonProjectCtrl', ['$rootScope', '$scope', '$stateParams', 'PersonProjectFactory', 'DivisionFactory', '$location',
  function ($rootScope, $scope, $stateParams, PersonProjectFactory, DivisionFactory, $location) {

    $scope.personProjects = PersonProjectFactory.getProjectsForPersonId({id: $stateParams.personId});
    $scope.sortType = 'project.startDate';
    $scope.sortReverse = true;
  }
]);

app.controller('ResearchOutputListCtrl', ['$rootScope', '$scope', 'ResearchOutputListFactory', '$location', '$q',
  function ($rootScope, $scope, ResearchOutputListFactory, $location, $q) {

    /* callback for ng-click 'showPerson': */
    $scope.showPerson = function(personId) {
      $location.path('/person/' + personId);
    };

    /* callback for ng-click 'showProject': */
    $scope.showProject = function(projectId) {
      $location.path('/project/' + projectId);
    };

    // load research outputs
    var researchOutputs = ResearchOutputListFactory.show();

    // after research outputs have been loaded
    $q.all([researchOutputs.$promise]).then(function(data) {
       $scope.researchOutputs = researchOutputs;
    }).catch(function(data) {
       if (data.status === -1) {
         $rootScope.isLoggedIn = false;
         handleLoginStatus($rootScope, $location);
       }
    });
    $scope.sortType = 'date';
    $scope.sortReverse = true;
  }
]);

app.controller('ProjectKpiListCtrl', ['$rootScope', '$scope', 'ProjectKpiListFactory', '$location', '$q',
  function ($rootScope, $scope, ProjectKpiListFactory, $location, $q) {

    /* callback for ng-click 'showPerson': */
    $scope.showPerson = function(personId) {
      $location.path('/person/' + personId);
    };

    /* callback for ng-click 'showProject': */
    $scope.showProject = function(projectId) {
      $location.path('/project/' + projectId);
    };

    // load research outputs
    var projectKpis = ProjectKpiListFactory.show();

    // after research outputs have been loaded
    $q.all([projectKpis.$promise]).then(function(data) {
       $scope.projectKpis = projectKpis;
    }).catch(function(data) {
       if (data.status === -1) {
         $rootScope.isLoggedIn = false;
         handleLoginStatus($rootScope, $location);
       }
    });
    $scope.sortType = 'date';
    $scope.sortReverse = true;
  }
]);

app.controller('LoginCtrl', ['$rootScope', '$cookies',
  function ($rootScope, $cookies) {
    var c = $cookies.get('eresearch');
    if (c === undefined) {
      $rootScope.isLoggedIn = false;
    } else {
      $rootScope.isLoggedIn = true;
    }
  }
]);

app.controller('LoggedOutCtrl', ['$rootScope', '$cookies',
  function ($rootScope, $cookies) {
    var expires = 'Thu, 01 Jan 1970 00:00:00 UTC';
    $cookies.put("eresearch","", {'expires': expires, 'path': '/project_centre'});
    $rootScope.isLoggedIn = false;
    redirectPath = undefined;
  }
]);

