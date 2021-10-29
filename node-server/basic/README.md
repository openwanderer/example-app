OpenWanderer basic example application 
======================================

This is a basic example OpenWanderer web application, making use of the new NPM package for the server `openwanderer-server`. 

This basic application allows you to upload panorama sequences and navigate along existing sequences. You can also jump to a given panorama (by ID or nearest to a given latitude and longitude).

How the application works
-------------------------

This basic example is the next natural step after the [Hello World](https://github.com/openwanderer/example-app/tree/master/node-server/hello-world) example. The Node.js code is exactly the same as that example; however the client-side JavaScript is more complex to allow for uploading a new pano sequence.

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

`panorama/sequence/create` (method `POST`) - reads a JSON array of panorama IDs in the request body, and creates a sequence from them. The sequence ID is returned in plain text. 



Building the application 
------------------------

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
