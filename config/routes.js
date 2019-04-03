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

  '/': {view: 'pages/home'},
  '/homepage': {view: 'pages/homepage'},
  '/dc/show': {view: 'dc/show'},

  '/image/get': {action: 'image/get'},

  '/cloud/create': {action: 'cloud/create'},
  '/cloud/get': {action: 'cloud/get'},
  '/cloud/update': {action: 'cloud/update'},
  '/cloud/destroy': {action: 'cloud/destroy'},
  '/cloud/list': {action: 'cloud/list'},

  '/hardware/metrics': {action: 'hardware/metrics'},
  '/hardware/create': {action: 'hardware/create'},
  '/hardware/update': {action: 'hardware/update'},
  '/hardware/destroy': {action: 'hardware/destroy'},
  '/hardware/list': {action: 'hardware/list'},
  '/hardware/populate': {action: 'hardware/populate'},

  '/env/show': {action: 'env/show'},
  '/env/create': {action: 'env/create'},
  '/env/update': {action: 'env/update'},
  '/env/destroy': {action: 'env/destroy'},
  '/env/list': {action: 'env/list'},
  '/env/get': {action: 'env/get'},
  '/env/metrics': {action: 'env/metrics'},
  '/env/select': {action: 'env/select'},
  '/env/addHardware': {action: 'env/addHardware'},

  '/stack/create': {action: 'stack/create'},
  '/stack/update': {action: 'stack/update'},
  '/stack/publish': {action: 'stack/publish'},
  '/stack/destroy': {action: 'stack/destroy'},
  '/stack/list': {action: 'stack/list'},
  '/stack/get': {action: 'stack/get'},

  '/service/list': {action: 'service/list'},

  '/stacklet/list': {action: 'stacklet/list'},
  '/stacklet/get': {action: 'stacklet/get'},

  '/events/create': {action: 'events/create'},
  '/events/set': {action: 'events/set'},
  '/events/destroy': {action: 'events/destroy'},
  '/events/list': {action: 'events/list'},
  '/events/inc': {action: 'events/inc'},
  '/events/dec': {action: 'events/dec'},

  '/repo/show': {action: 'repo/show'},

  '/app/launch': {action: 'app/launch'},
  '/app/list': {action: 'app/list'},
  '/app/show': {action: 'app/show'},
  '/app/create': {action: 'app/create'},
  '/app/get': {action: 'app/get'},
  '/app/kill': {action: 'app/kill'},

  '/reservation/list': {action: 'reservation/list'},

  '/resource/list': {action: 'resource/list'},
  '/request/list': {action: 'request/list'},
  '/request/show': {action: 'request/show'},
  '/policy/create': {action: 'policy/create'},
  '/policy/show': {action: 'policy/show'},
  '/policy/list': {action: 'policy/list'},
  '/policy/get': {action: 'policy/get'},
  '/dc/metrics': {action: 'dc/metrics'},

  '/instance/update': {action: 'instance/update'},
  '/instance/list': {action: 'instance/list'},
  '/instance/get': {action: 'instance/get'},
  '/instance/kill': {action: 'instance/kill'},
  '/instance/destroy': {action: 'instance/destroy'},

  '/bouquet/register': {action: 'bouquet/register'},

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
