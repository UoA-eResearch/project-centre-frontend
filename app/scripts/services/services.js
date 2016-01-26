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
    var url = appConfig.apiBaseUrl + '/projectWrapper/:id';
    return $resource(url, {}, {
       show : { method: 'GET', params: {id: '@id'} }
    });
});

services.factory('PersonProjectFactory', function ($resource, appConfig) {
    var url = appConfig.apiBaseUrl + '/personProject';
    return $resource(url, {}, {
       getProjectsForPersonId: { method: 'GET', url: url + '/findByPersonId/:id', params: {id: '@id'}, isArray: true }
    });
});

services.factory('DivisionFactory', function ($resource, appConfig) {
    var url = appConfig.apiBaseUrl + '/division';
    return $resource(url, {}, {
        show: { method: 'GET', isArray: true }
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
