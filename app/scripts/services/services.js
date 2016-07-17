'use strict';

var services = angular.module('uoa_eresearch.services', []);

services.factory('PersonListFactory', function ($resource, appConfig) {
    var url = appConfig.apiBaseUrl + '/person';
    return $resource(url, {}, {
        show: { method: 'GET', isArray: true }
    });
});

services.factory('ProjectListFactory', function ($resource, appConfig) {
    var url = appConfig.apiBaseUrl + '/project';
    return $resource(url, {}, {
        show: { method: 'GET', isArray: true }
    });
});

services.factory('PersonFactory', function ($resource, appConfig) {
    var url = appConfig.apiBaseUrl + '/person/:id';
    return $resource(url, {}, {
       show : { method: 'GET', params: {id: '@id'} }
    });
});

services.factory('ProjectWrapperFactory', function ($resource, appConfig) {
    var url = appConfig.apiBaseUrl + '/project/wrapper/:id';
    return $resource(url, {}, {
       show : { method: 'GET', params: {id: '@id'} }
    });
});

services.factory('PersonProjectFactory', function ($resource, appConfig) {
    var url = appConfig.apiBaseUrl + '/person/:id/projects';
    return $resource(url, {}, {
       getProjectsForPersonId: { method: 'GET', params: {id: '@id'}, isArray: true }
    });
});

services.factory('DivisionFactory', function ($resource, appConfig) {
    var url = appConfig.apiBaseUrl + '/util/division';
    return $resource(url, {}, {
        show: { method: 'GET', isArray: true, cache: false }
      });
});

services.factory('DivisionalRoleFactory', function ($resource, appConfig) {
    var url = appConfig.apiBaseUrl + '/util/divisionalRole';
    return $resource(url, {}, {
        show: { method: 'GET', isArray: true, cache: true }
      });
});

services.factory('ResearchOutputListFactory', function ($resource, appConfig) {
    var url = appConfig.apiBaseUrl + '/researchOutput';
    return $resource(url, {}, {
        show: { method: 'GET', isArray: true }
    });
});

services.factory('ProjectKpiListFactory', function ($resource, appConfig) {
    var url = appConfig.apiBaseUrl + '/projectKpi';
    return $resource(url, {}, {
        show: { method: 'GET', isArray: true }
    });
});
