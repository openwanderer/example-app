OpenWanderer Hello World application 
====================================

This is a 'hello world' example OpenWanderer web application, making use of the new Composer package for the server `openwanderer/openwanderer`. 

This basic application illustrates how you can load a panorama with a given ID and navigate along a sequence.

How it works
------------

As a "Hello World" application, it is quite simple. There is a server-side component, using the OpenWanderer [server API](https://github.com/openwanderer/server) and a client-side component, using the OpenWanderer [jsapi](https://github.com/openwanderer/jsapi).

Looking at the server side component, `index.php`, this is extremely simple:
```php
<?php
require 'vendor/autoload.php';

use \OpenWanderer\OpenWanderer;

$app = OpenWanderer::createApp([
	"auth" => false
]);

$app->run();
?>
```

We simply create an OpenWanderer app and set the `auth` property to false, to indicate that we don't need authentication. See the [server API](https://github.com/openwanderer/server) for more details. This returns a [Slim](https://slimframework.com) application object which is then run.

Moving onto the client-side component, `index.js` within the [js](js/) directory:
```javascript

const navigator = new OpenWanderer.Navigator({
    api: { 
        byId: 'panorama/{id}', 
        panoImg: 'panorama/{id}.jpg',
        sequenceUrl: 'sequence/{id}'
    },
});

navigator.loadPanorama(1);
```
If you have not done so already, you may wish to look at the [examples in the jsapi repository](https://github.com/openwanderer/jsapi/tree/master/core/examples) which give more information on the basic `jsapi` classes.

We first create an `OpenWanderer.Navigator` object. Note how, unlike the basic `jsapi` examples, we need to specify an `api` option when creating it. This specifies the server-side API endpoints that the client communicates with. These server-side API endpoints are automatically provided by the OpenWanderer server application, so you will not need to change these (however, if you want the `jsapi` to talk to some other back-end besides the OpenWanderer server, you can do). Considering these one-by-one:

- `byId`: this API endpoint supplies information about a panorama with a given ID as a JSON object, containing `lat`, `lon`, `ele` (elevation), `pan` (heading angle or yaw), `tilt` (pitch) and `roll`. 
- `panoImg`: this API endpoint supplies a panorama image with a given ID.
- `sequenceUrl`: this API endpoint retrieves a pano sequence with a given ID.

There are other endpoints you can supply, such as `nearest/{lon}/{lat}` which will find the nearest panorama to a given longitude and latitude, but this is not needed for this particular application.

Finally, we load the panorama with the ID of 1. This will load the first panorama and automatically show the sequence allowing you to navigate to the others.

Building the application 
------------------------

You need [PHP](https://php.net) installed on your system, and a web server of some kind, such as [Apache](https://apache.org). If you have a Linux system you can easily install these using your package management system. If running Windows you might want to consider an all-in-one package such as [XAMPP](https://www.apachefriends.org/download.html) which provides both PHP and Apache. You also need to install [PostGIS](https://postgis.net) as well as PostgreSQL.

A good resource for instructions on installing PostGIS is [on the OpenStreetMap wiki](https://wiki.openstreetmap.org/wiki/PostGIS/Installation). Even though these instructions relate to setting up a Mapnik map tile server, they are equally applicable for setting up a database for OpenWanderer. 

To setup the database please import `setup-db.sql` into your database. This will setup the `panoramas` table with data describing the three panoramas included in the `panos` directory and setup the `sequence_panos` table with a sequence linking these three panoramas.

You then need to install the PHP dependencies. Dependencies are managed by [Composer](https://getcomposer.org). Please ensure you have Composer installed and then run: 

`composer install`

to install the dependencies, where `composer` is the Composer executable. (You may need to run `php composer.phar` instead, depending on how you downloaded Composer.

There is a `.env-example` file containing settings. You need to copy this to `.env` and modify the settings so that they are appropriate for your system.
The settings in the `.env` file are:

- `OTV_UPLOADS` - the directory where panorama files are stored. Leave this as `panos` as the panoramas are included with the example.
- `MAX_FILE_SIZE` - the maximum file size to accept for panoramas, in MB. Should match the `php.ini` setting.
- `DB_USER` - your database user.
- `DB_DBASE` - the database holding the panoramas.
- `BASE_PATH` (optional) - set to the path (relative to your server root) holding your OpenWanderer app. If omitted, it is assumed the app is in your server root.

By default it is assumed that the server is installed in the document root, otherwise you will have to set the base path in your `.env` file. To help with testing, you might want to configure a site `openwanderer` and setup a virtual host. 
For example see these [Digital Ocean docs](https://www.digitalocean.com/community/tutorials/how-to-set-up-apache-virtual-hosts-on-ubuntu-18-04)

If you do this and setup a site with a name of e.g. `openwanderer` you should be able to view the application via:

`http://openwanderer/`

Alternatively, if you do not want to install openwanderer to the document root and do not want to use a virtual host, you need to tell Slim (the PHP framework used) the base path for your application. You can set the base path by editing the `.env` file, as mentioned above. 


