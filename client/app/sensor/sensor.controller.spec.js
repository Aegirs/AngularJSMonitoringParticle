'use strict';

describe('Controller: SensorCtrl', function () {

  // load the controller's module
  beforeEach(module('sparkFullStackApp'));

  var SensorCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SensorCtrl = $controller('SensorCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
