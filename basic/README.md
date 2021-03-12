OpenWanderer basic example application 
======================================

This is a basic example OpenWanderer web application, making use of the new Composer package for the server `openwanderer/openwanderer`. For a fuller application with more functionality, please see the `full` directory.

This basic application allows you to upload panorama sequences and navigate along existing sequences. You can also jump to a given panorama (by ID or nearest to a given latitude and longitude).

How the application works
-------------------------

This basic example is the next natural step after the [Hello World](https://github.com/openwanderer/example-app/tree/master/hello-world) example. The PHP code is exactly the same as that example (it sets up a server with authentication disabled); however the JavaScript is more complex to allow for uploading a new pano sequence.

To look at some key code: 

```javascript
const navigator = new OpenWanderer.Navigator({
    api: { 
        byId: 'panorama/{id}', 
        panoImg: 'panorama/{id}.jpg',
        nearest: 'nearest/{lon}/{lat}'
    }
});

if(get.lat && get.lon) {
    navigator.findPanoramaByLonLat(get.lon, get.lat);
} else {
    navigator.loadPanorama(get.id || 1);
}
```

The key new feature is the `nearest` API endpoint, this was not needed for the `hello-world` example. This returns JSON describing the panorama nearest to the given longitude and latitude. This is needed if the user supplies the latitude and longitude as `GET` data; the `findPanoramaByLonLat()` method of `OpenWanderer.Navigator` uses this API endpoint to find the nearest panorama to the given location.

The rest of [the example](https://github.com/openwanderer/example-app/blob/master/basic/js/index.js) largely uses inbuilt file and AJAX APIs to upload panorama files to the server, and will not be explained in depth here as it's quite easy, hopefully, to follow if you are familiar with these APIs. Note how it uses two API endpoints supplied automatically by the OpenWanderer server:

`panorama/upload` (method `POST`) - uploads a given panorama. Takes the panorama file as a `file` type with a name of `file`, and returns a JSON object containing the ID of the given panorama within the `id` field. It is also possible for the JSON object to contain a `warning` field which you should check; if there is an `error` field in the JSON it means that the file was not uploaded successfully.

`sequence/create` (method `POST`) - reads a JSON array of panorama IDs in the request body, and creates a sequence from them. The sequence ID is returned in plain text. 



Building the application 
------------------------

You need [PHP](https://php.net) installed on your system, and a web server of some kind, such as [Apache](https://apache.org). If you have a Linux system you can easily install these using your package management system. If running Windows you might want to consider an all-in-one package such as [XAMPP](https://www.apachefriends.org/download.html) which provides both PHP and Apache. You also need to install [PostGIS](https://postgis.net) as well as PostgreSQL.

A good resource for instructions on installing PostGIS is [on the OpenStreetMap wiki](https://wiki.openstreetmap.org/wiki/PostGIS/Installation). Even though these instructions relate to setting up a Mapnik map tile server, they are equally applicable for setting up a database for OpenWanderer. 

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

If you do this and setup a site with a name of e.g. `openwanderer` you should be able to view the application via:

`http://openwanderer/`

Alternatively, if you do not want to install openwanderer to the document root and do not want to use a virtual host, you need to tell Slim (the PHP framework used) the base path for your application. You can set the base path by editing the `.env` file, as mentioned above. 


