OpenWanderer example application 
================================

This is an example OpenWanderer web application, making use of the new Composer package for the server `openwanderer/openwanderer`

Licensing
---------

As of the first commit on October 10, 2020, the code is now licensed under the Lesser GNU General Public License, by agreement between both OpenWanderer repository owners (@mrAceT and @nickw). The exception is third-party code such as `geojson-path-finder` which is licensed separately, details in the relevant directories. This has been done to:

- ensure that any changes to OpenWanderer itself will remain Free and open source (if you change OpenWanderer, you must make the modified code available under a compatible free software license); 
- but also allow proprietary applications to *use* OpenWanderer code.

Any further changes to the current OpenTrailView - OTV360; repo [here](https://gitlab.com/nickw1/opentrailview) will remain under the GPL v3.

Building the application 
------------------------

You need [PHP](https://php,net) installed on your system, and a web server of some kind, such as [Apache](https://apache.org). If you have a Linux system you can easily install these using your package management system. If running Windows you might want to consider an all-in-one package such as [XAMPP](https://www.apachefriends.org/download.html) which provides both PHP and Apache. You also need to install [PostGIS](https://postgis.net) as well as PostgreSQL.

To setup the database please use `database.sql`.

Dependencies are managed by [Composer](https://getcomposer.org). Please use:

`composer install`

to install the dependencies.

There is a `.env-example` file containing settings. You need to copy this to `.env` and modify the settings for your system.

To build the app's front end you need to install the OpenWanderer `jsapi`, which is now available as a package on npm: `openwanderer-jsapi`. This is handled using npm: 

```
cd js
npm run build
```

It will be easier to test the application if the server is installed in the document root, otherwise you will have to set the base path in Slim/PHP. To help with this you might want to configure a site `openwanderer` and setup a virtual host. 
For example see these [Digital Ocean docs](https://www.digitalocean.com/community/tutorials/how-to-set-up-apache-virtual-hosts-on-ubuntu-18-04)

If you do this and setup a site with a name of e.g. `openwanderer` you should be able to view the application via:

`http://openwanderer/`

Alternatively, if you do not want to install openwanderer to the document root and do not want to use a virtual host, you need to tell Slim (the PHP framework used) the base path for your application. You can set the base path by editing the `.env` file, mentioned above. 

Application features
--------------------

The application now provides a wide range of functionality, almost equivalent
to OpenTrailView. You can: 

- view a given panorama;
- upload a set of panoramas and create a sequence from them;
- view and navigate a sequence, for those panoramas which belong to a sequence.
- view panorama locations on a map interface; 
- rotate panoramas, both via the map (pan only) and via an interface in panorama mode, if you are logged in (pan and tilt).

You now need to signup and login to upload and modify panoramas.
