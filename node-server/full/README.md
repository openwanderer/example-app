OpenWanderer example application 
================================

This is an example OpenWanderer web application, making use of the new npm package for the server `openwanderer-server` and the client side NPM package `openwanderer-app`, which provides a full OpenWanderer application widget.

Licensing
---------

As of the first commit on October 10, 2020, the code is now licensed under the Lesser GNU General Public License, by agreement between both OpenWanderer repository owners (@mrAceT and @nickw). The exception is third-party code such as `geojson-path-finder` which is licensed separately, details in the relevant directories. This has been done to:

- ensure that any changes to OpenWanderer itself will remain Free and open source (if you change OpenWanderer, you must make the modified code available under a compatible free software license); 
- but also allow proprietary applications to *use* OpenWanderer code.

Any further changes to the current OpenTrailView - OTV360; repo [here](https://gitlab.com/nickw1/opentrailview) will remain under the GPL v3.

Building the application - server side 
--------------------------------------

You need [Node.js](https://nodejs.org) and [NPM](https://npmjs.com) installed on your system. You also need to install [PostGIS](https://postgis.net) as well as PostgreSQL.

A good resource for instructions on installing PostGIS is [on the OpenStreetMap wiki](https://wiki.openstreetmap.org/wiki/PostGIS/Installation). Even though these instructions relate to setting up a Mapnik map tile server, they are equally applicable for setting up a database for OpenWanderer. 

To setup the database please import `database.sql` into your database.

There is a `.env-example` file containing settings. You need to copy this to `.env` and modify the settings so that they are appropriate for your system. Please see the [Node server](https://github.com/openwanderer/node-server) repository for details.

To build, use 
```
npm install
npm run build
```

and then run the server. The server will be available on port 3000.

Application features
--------------------

This example application shows the use of the `openwanderer-app` NPM package, which provides a complete OpenWanderer application widget with a wide range of functionality. You can:

- view a given panorama;
- upload a set of panoramas and create a sequence from them;
- view and navigate a sequence, for those panoramas which belong to a sequence.
- view panorama locations on a map interface; 
- rotate panoramas, both via the map (pan only) and via an interface in panorama mode, if you are logged in (pan, tilt and roll);

You should login with username and password `admin`. Signup does not do anything in the sample app. In a real app you would need to implement the login routes using a database and implement some middleware to prevent access to sensitive functionality unless you are logged in. 

Note that although the widget is customisable (in terms of icons used for certain operations, for example), it assumes certain defaults, particularly regarding the icons used and the page elements to place the various controls. The `index.html` provides the default controls. The needed default icons are provided in the `images` directory; see the README in there for author information for individual icons.

More documentation about `openwanderer-app`, its defaults, and how to customise it will appear in due course.
