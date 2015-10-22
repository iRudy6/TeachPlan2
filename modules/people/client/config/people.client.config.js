'use strict';

// Configuring the groups module
angular.module('people').run(['Menus',
  function (Menus) {
    // Add the groups dropdown item
    Menus.addMenuItem('topbar', {
      title: 'People',
      state: 'people.list',
      roles: ['admin', 'editor', 'user']
    });

  }
]);



/*'use strict';

// Configuring the groups module
angular.module('people').run(['Menus',
  function (Menus) {
    // Add the groups dropdown item
    Menus.addMenuItem('topbar', {
      title: 'People',
      state: 'people',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'people', {
      title: 'List People',
      state: 'people.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'people', {
      title: 'Create People',
      state: 'people.create',
      roles: ['user']
    });
  }
]);
*/