OpenWanderer example application 
================================

This is an example OpenWanderer web application, making use of the new Composer package for the server `openwanderer/openwanderer` and the NPM package `openwanderer-app`, which provides a full OpenWanderer application widget.

Licensing
---------

As of the first commit on October 10, 2020, the code is now licensed under the Lesser GNU General Public License, by agreement between both OpenWanderer repository owners (@mrAceT and @nickw). The exception is third-party code such as `geojson-path-finder` which is licensed separately, details in the relevant directories. This has been done to:

- ensure that any changes to OpenWanderer itself will remain Free and open source (if you change OpenWanderer, you must make the modified code available under a compatible free software license); 
- but also allow proprietary applications to *use* OpenWanderer code.

Any further changes to the current OpenTrailView - OTV360; repo [here](https://gitlab.com/nickw1/opentrailview) will remain under the GPL v3.

Building the application - server side 
--------------------------------------

You need [PHP](https://php.net) installed on your system, and a web server of some kind, such as [Apache](https://apache.org). If you have a Linux system you can easily install these using your package management system. If running Windows you might want to consider an all-in-one package such as [XAMPP](https://www.apachefriends.org/download.html) which provides both PHP and Apache. You also need to install [PostGIS](https://postgis.net) as well as PostgreSQL.

A good resource for instructions on installing PostGIS is [on the OpenStreetMap wiki](https://wiki.openstreetmap.org/wiki/PostGIS/Installation). Even though these instructions relate to setting up a Mapnik map tile server, they are equally applicable for setting up a database for OpenWanderer. 

You also need to ensure that the PHP PostgreSQL module is installed, e.g. on Ubuntu 18.04:
```
sudo apt-get update
sudo apt-get install php7.2-pgsql
```

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

By default it is assumed that the server is installed in the document root, otherwise you will have to set the base path in your `.env` file. To help with testing, you might want to configure a site `openwanderer` and setup a virtual host. 
For example see these [Digital Ocean docs](https://www.digitalocean.com/community/tutorials/how-to-set-up-apache-virtual-hosts-on-ubuntu-18-04)

If you do this and setup a site with a name of e.g. `openwanderer` you should be able to view the application (once the client-side has been built, see below) via:

`http://openwanderer/`

Alternatively, if you do not want to install openwanderer to the document root and do not want to use a virtual host, you need to tell Slim (the PHP framework used) the base path for your application. You can set the base path by editing the `.env` file, as mentioned above. 

Instructing Apache to read the .htaccess file
---------------------------------------------

By default, Apache may not read the `.htaccess` file, which redirects all
requests to `index.php`; the result of this is you will get 404 Not Found errors with the server endpoints. You need to perform two steps for this:

- firstly, enable `mod_rewrite`, the URL-rewriting module, e.g:

```
sudo a2enmod rewrite
```

- secondly, change the main Apache configuration file (e.g. `/etc/apache/apache2.conf`) to allow settings to be overridden with `.htaccess`. Open the file and find the section which looks like this:
```
<Directory /var/www/>
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>
```
Change the `AllowOverride None` to `AllowOverride All` and then restart Apache, e.g:
```
sudo service apache2 restart
```

Building the app (client-side)
------------------------------

As well as building the server, you need to build the client-side code, though this is quick and straightforward. A `package.json` is supplied. You need [node.js](https://nodejs.org) and specifically `npm` installed on your system. Change directory to `js` and then install the dependencies with:
```
npm install
```
and build the client-side with Webpack:
```
npx webpack
```

Running in Docker
-----------------

Requires [Docker](https://docs.docker.com/get-docker/) as well as [Docker Compose](https://docs.docker.com/compose/install/).

The `server.Dockerfile` contains the necessary build-configuration to build a Docker image containing the full OpenWanderer server. For the postgres/postgis-setup an existing docker-image is used.  

Start up the stack by running 
```
docker-compose up
```

The panorama-images as well the database-files automatically get mounted to your local filesystem under the `./data`-folder. Also note the `.entry_point.lock`-file that gets created once the database has been initialized. In case you'd like to clear the `./data`-folder to start from a fresh setup, don't forget to remove `.entry_point.lock` too.

Application features
--------------------

This example application shows the use of the `openwanderer-app` NPM package, which provides a complete OpenWanderer application widget with a wide range of functionality. You can:

- view a given panorama;
- upload a set of panoramas and create a sequence from them;
- view and navigate a sequence, for those panoramas which belong to a sequence.
- view panorama locations on a map interface; 
- rotate panoramas, both via the map (pan only) and via an interface in panorama mode, if you are logged in (pan, tilt and roll);
- signup, login and logout (login functionality is needed to upload and modify panoramas).

Note that although the widget is customisable (in terms of icons used for certain operations, for example), it assumes certain defaults, particularly regarding the icons used and the page elements to place the various controls. The `index.html` provides the default controls. The needed default icons are provided in the `images` directory; see the README in there for author information for individual icons.

More documentation about `openwanderer-app`, its defaults, and how to customise it will appear in due course.
