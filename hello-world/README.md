OpenWanderer Hello World application 
====================================

This is a 'hello world' example OpenWanderer web application, making use of the new Composer package for the server `openwanderer/openwanderer`. 

This basic application illustrates how you can load a panorama with a given ID. It *assumes that you have a server setup already with panoramas and panorama sequences*, and that you have a pano with an ID of 1 belonging to a sequence. If you do, it will load the pano with the ID of 1 and show you the sequence that it belongs to, and allows you to navigate along the sequence. 

It is more intended as example code rather than a working and useful application. Please see the `basic` or `full` examples for working and usable applications.

Licensing
---------

As of the first commit on October 10, 2020, the code is now licensed under the Lesser GNU General Public License, by agreement between both OpenWanderer repository owners (@mrAceT and @nickw). The exception is third-party code such as `geojson-path-finder` which is licensed separately, details in the relevant directories. This has been done to:

- ensure that any changes to OpenWanderer itself will remain Free and open source (if you change OpenWanderer, you must make the modified code available under a compatible free software license); 
- but also allow proprietary applications to *use* OpenWanderer code.

Any further changes to the current OpenTrailView - OTV360; repo [here](https://gitlab.com/nickw1/opentrailview) will remain under the GPL v3.

Building the application 
------------------------

You need [PHP](https://php,net) installed on your system, and a web server of some kind, such as [Apache](https://apache.org). If you have a Linux system you can easily install these using your package management system. If running Windows you might want to consider an all-in-one package such as [XAMPP](https://www.apachefriends.org/download.html) which provides both PHP and Apache. You also need to install [PostGIS](https://postgis.net) as well as PostgreSQL.

To setup the database please import `database.sql` into your database.

Dependencies are managed by [Composer](https://getcomposer.org). Please use:

`composer install`

to install the dependencies.

There is a `.env-example` file containing settings. You need to copy this to `.env` and modify the settings so that they are appropriate for your system.
The settings in the `.env` file are:

- `OTV_UPLOADS` - the directory where panorama files will be uploaded to.
- `MAX_FILE_SIZE` - the maximum file size to accept for panoramas, in MB. Should match the `php.ini` setting.
- `DB_USER` - your database user.
- `DB_DBASE` - the database holding the panoramas.
- `BASE_PATH` (optional) - set to the path (relative to your server root) holding your OpenWanderer app. If omitted, it is assumed the app is in your server root.

To build the app's front end you need to install the OpenWanderer `jsapi`, including the transitions plugin. These are now available as a package on npm: `openwanderer-jsapi` and `openwanderer-jsapi-transitions`, respectively. You can install both using npm: 

```
cd js
npm run build
```

By default it is assumed that the server is installed in the document root, otherwise you will have to set the base path in your `.env` file. To help with testing, you might want to configure a site `openwanderer` and setup a virtual host. 
For example see these [Digital Ocean docs](https://www.digitalocean.com/community/tutorials/how-to-set-up-apache-virtual-hosts-on-ubuntu-18-04)

If you do this and setup a site with a name of e.g. `openwanderer` you should be able to view the application via:

`http://openwanderer/`

Alternatively, if you do not want to install openwanderer to the document root and do not want to use a virtual host, you need to tell Slim (the PHP framework used) the base path for your application. You can set the base path by editing the `.env` file, as mentioned above. 


