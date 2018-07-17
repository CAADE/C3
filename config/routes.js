/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/': {view: 'pages/homepage'},
  '/dc/show': {view: 'dc/show'},
  '/cloud/create': {action: 'cloud/create'},
  '/cloud/update': {action: 'cloud/update'},
  '/cloud/destroy': {action: 'cloud/destroy'},
  '/cloud/list': {action: 'cloud/list'},

  '/hardware/create': {action: 'hardware/create'},
  '/hardware/update': {action: 'hardware/update'},
  '/hardware/destroy': {action: 'hardware/destroy'},
  '/hardware/list': {action: 'hardware/list'},
  '/hardware/populate': {action: 'hardware/populate'},

  '/env/create': {action: 'env/create'},
  '/env/update': {action: 'env/update'},
  '/env/destroy': {action: 'env/destroy'},
  '/env/list': {action: 'env/list'},
  '/env/get': {action: 'env/get'},
  '/env/select': {action: 'env/select'},

  '/stack/create': {action: 'stack/create'},
  '/stack/update': {action: 'stack/update'},
  '/stack/publish': {action: 'stack/publish'},
  '/stack/destroy': {action: 'stack/destroy'},
  '/stack/list': {action: 'stack/list'},

  '/service/list': {action: 'service/list'},

  '/stacklet/list': {action: 'stacklet/list'},

  '/events/create': {action: 'events/create'},
  '/events/set': {action: 'events/set'},
  '/events/destroy': {action: 'events/destroy'},
  '/events/list': {action: 'events/list'},
  '/events/inc': {action: 'events/inc'},
  '/events/dec': {action: 'events/dec'},

  '/repo/show': {action: 'repo/show'},

  '/app/launch': {action: 'app/launch'},
  '/app/list': {action: 'app/list'},
  '/app/create': {action: 'app/create'},

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝


  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
