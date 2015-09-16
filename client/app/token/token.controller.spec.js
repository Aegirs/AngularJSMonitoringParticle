'use strict';

describe('Controller: TokenCtrl', function () {

  // load the controller's module
  beforeEach(module('sparkFullStackApp'));

  var TokenCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TokenCtrl = $controller('TokenCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
