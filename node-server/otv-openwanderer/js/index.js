import qs from 'querystring';
import OsmLoader from './osmloader.js';
import PanoNetworkMgr from './routing/PanoNetworkMgr.js';
import * as OpenWanderer from 'openwanderer-jsapi';
import * as OWApp from 'openwanderer-app';
import launchUploadDialog from './uploadlaunch.js';
import PhotoManager from './photomgr.js';

import { GoogleProjection, Dialog } from 'jsfreemaplib';

const nav = new OpenWanderer.Navigator({
    api: {
        byId: 'panorama/{id}',
        panoImg: 'panorama/{id}.jpg',
        nearest: 'panorama/nearest/{lon}/{lat}'
    },
    sequence: false,
    pathClickHandler: path => parseInt(path.id.split('-')[2]),
    markerClickHandler: marker => parseInt(marker.id.split('-')[1]),
    svgOver: { red: 255, green: 255, blue: 192 }

});
const app = new OWApp.App({
    controlIcons: {
        'select': 'images/cursor-default-click.png',
        'rotate': 'images/outline_refresh_black_24dp.png',    
        'drag'  : 'images/drag-variant.png',
        'delete': 'images/outline_delete_black_24dp.png',
        'search': 'images/outline_search_black_24dp.png',
        'switchMode' : [
            'images/outline_panorama_photosphere_black_24dp.png',
            'images/outline_map_black_24dp.png',
        ]
    },
    api: {
        panos: 'panorama/all',
        sequence: 'panorama/sequence/{id}',
        sequenceCreate: 'panorama/sequence/create',
        nearest: 'panorama/nearest/{lon}/{lat}',
    },
    cameraIcon: 'images/camera.png',
    loginContainer: 'loginContainer',
    controlContainer: 'controlsContainer',
    searchContainer: 'searchContainer',
    rotateControlsContainer: 'rotationControlsContainer',
    dialogParent: 'main', 
     navigator: nav,
    setupUpload: false,
//    uploadContainer: 'uploadContainer',
    dialogStyle: {
        backgroundColor: '#90c590',
        color: 'black',
        border: '1px solid black'
    },
    createSequence: false,
    mapUrl: 'https://www.opentrailview.org/geoapify/{z}/{x}/{y}.png',
    mapAttribution: 'Map data copyright OpenStreetMap contributors, ODBL; map tiles provided by Geoapify (geoapify.com)'
});


const parts = window.location.href.split('?');
let get = { };
if(parts.length == 2) {
    get = qs.parse(parts[1]);
}
if(get.lat && get.lon) {
    app.navigator.findPanoramaByLonLat(get.lon, get.lat);
} else {
    app.navigator.loadPanorama(get.id || 1);
}

const osmLoader = new OsmLoader(nav.viewer, "map/{z}/{x}/{y}.json", "terrarium/{z}/{x}/{y}.png"); 

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('svcw.js')
        .then(registration => {
            console.log('Service worker registered successfully');
        })
        .catch(e => {
            console.error(`Service worker registration error: ${e}`);
        });
} else {
    alert('Offline functionality will not be available, due to no service worker API');
}
const nMgr = new PanoNetworkMgr();

// nasty hack - really navigator should allow multiple handlers for one event
nav.origOnLocationChanged = nav.eventHandlers.locationChanged;

nav.on("locationChanged", async (lon, lat) => {
    nav.origOnLocationChanged(lon, lat);
    const osmData = await osmLoader.update([parseFloat(lon), parseFloat(lat)]);
    const routeData = await nMgr.doLoadNearbys(nav.panoMetadata[nav.curPanoId], Object.assign({}, osmData));
    let panoRoutes;
    // new code
    for(let bearing in routeData) {
        console.log(`BEARING: ${bearing}`);
        panoRoutes = routeData[bearing];    
//        drawPanoRoute(panoRoutes[panoRoutes.length-1], 0);
        drawArrow(lon, lat, bearing, 2, 3, panoRoutes[0].id);

        if(get.markers) {
            panoRoutes.forEach( pano => {
                nav.viewer.addMarker([pano.lon, pano.lat, pano.ele - 1.6], {
                    id: `pano-${pano.id}`,
                    tooltip: `Pano ${pano.id}`,
                    fill: 'rgba(255, 255, 0, 0.2)',
                    stroke: 'rgba(255, 255, 0, 0.4)'
                });
            });
        }
    }
     /* old code    
     for(let bearing in routeData) {
        panoRoutes = routeData[bearing];    
        console.log(`For ${bearing}, nearest pano is ${panoRoutes[0].id}, furthest pano is ${panoRoutes[panoRoutes.length-1].id}`);
        const includedPoints = [];
        panoRoutes[panoRoutes.length-1].route.path.forEach( point => {
            if(point[2] === undefined) {
                point[2] = osmLoader.getElevation(point[0], point[1]);
            }
            if(point[2] > Number.NEGATIVE_INFINITY) {
               includedPoints.push(point);
            }
        });
        try {
           nav.viewer.addPath(includedPoints, {
                id: `path-${nav.curPanoId}-${panoRoutes[0].id}`,
                tooltip: `Path from #${nav.curPanoId} to #${panoRoutes[0].id}`
           });
        } catch(e) {
            console.warn(e);
        }
        panoRoutes.forEach( pano => {
            nav.viewer.addMarker([pano.lon, pano.lat, pano.ele], {
                id: `pano-${pano.id}`,
                tooltip: `Pano ${pano.id}`
            });
        });
    }
      */
});

app.on('login', () => {
    if(!document.getElementById('uploadControl')) {
        const img = document.createElement('img');
        img.id = 'uploadControl';
        img.src = 'images/outline_cloud_upload_black_24dp.png';
        img.addEventListener('click', () => {
            launchUploadDialog(); 
        });
        const controlsContainer = document.getElementById('controlsContainer');
        controlsContainer.insertBefore(img, controlsContainer.firstChild);
        const a = document.createElement("a");

        a.id="setupPhotoMgr";
        a.addEventListener("click", setupPhotoMgr);
        a.appendChild(document.createTextNode(" "));
        a.appendChild(document.createTextNode("Manage photos"));
        document.getElementById('loginContainer').appendChild(a);
    } else {
        document.getElementById('uploadControl').style.display = 'inline';
    }
});

app.on('logout', () => {
    if(document.getElementById('uploadControl')) {
        document.getElementById('uploadControl').style.display = 'none';
    }
    const bar = document.createElement("span");
    bar.innerHTML = ' | ';
    document.getElementById('loginContainer').appendChild(bar);
    const osmLogin = document.createElement('span');
    osmLogin.innerHTML = 'OSM Login';
    osmLogin.addEventListener('click', async(e) => {
        window.location = '/osm/login';
    });
    document.getElementById('loginContainer').appendChild(osmLogin);
});


function drawPanoRoute(panoRoute, divergence) {
    console.log(`drawPanoRoute(): divergence index=${divergence}`);
    const includedPoints = [];
    for(let i=divergence; i<panoRoute.route.path.length; i++) {
        /* remove elevation
        if(panoRoute.route.path[i][2] === undefined) {
            panoRoute.route.path[i][2] = osmLoader.getElevation(panoRoute.route.path[i][0], panoRoute.route.path[i][1]) - 1.6;
        } else {
            panoRoute.route.path[i][2] -= 1.6;
        }
        */
        panoRoute.route.path[i][2] -= 1.6;
        if(panoRoute.route.path[i][2] > Number.NEGATIVE_INFINITY) {
           includedPoints.push(panoRoute.route.path[i]);
        }
    }
    try {
       const nextPano = panoRoute.route.panoIds.split(",")[1];
       nav.viewer.addPath(includedPoints, {
            id: `path-${nav.curPanoId}-${nextPano}-${panoRoute.id}`,
            tooltip: `Path from #${nav.curPanoId} to #${nextPano}`,
                fill: 'rgba(255, 255, 0, 0.1)',
                stroke: 'rgba(255, 255, 0, 0.2)'
       });
    } catch(e) {
        console.warn(e);
    }
}

function setupPhotoMgr() {
    if(!app.photoMgrDlg) {
        app.photoMgrDlg = new Dialog('panoContainer',
            {
                'Close': ()=> { 
                app.photoMgrDlg.hide();
            }},
            { backgroundColor: "rgba(128,192,128,0.9)",
                color: "black",
                top: '10px',
                left: '10px',
                width:'calc(100% - 210px)',
                height: 'calc(100% - 100px)',
                textAlign: "center" 
            });
        app.photoMgrDlg.div.id = '_dlgPhotoMgr';
        const content = document.createElement("div");
        const h2 = document.createElement("h2");
        h2.appendChild(document.createTextNode("Manage your panoramas"));
        content.appendChild(h2);
        const p = document.createElement("p");
        p.appendChild(document.createTextNode("Select a panorama and then position it by clicking on the map. When you are finished, click 'Upload positioned panos' to upload them."));
        content.appendChild(p);
        const photoMgr = document.createElement("div");
        photoMgr.id="_photoMgr";
        content.appendChild(photoMgr);

        app.photoMgrDlg.setDOMContent(content);
        app.photoMgrDlg.show();

        app.photoMgr = new PhotoManager(2,4,'_photoMgr', { 
            actionsContainer: app.photoMgrDlg.actionsContainer, 
            onPositioned: (id,lat,lon)=> { 
                app.mapMgr.addNewPano(id, lat, lon) 
            }, 
            onPositionUploaded: app.mapMgr.removeNewPanos.bind(this.mapMgr), 
            adminProvider: app,
            onSelected: id=>{
                app.mapMgr.selectNewPano(id) 
        }});
    } else {
        app.photoMgrDlg.show();
    }
        
    app.mapMgr.map.on("click", e=> {
        app.photoMgr.setCoords(e.latlng);
    });
}

function drawArrow(lon, lat, bearing, origin, lengthMetres, targetPanoId) {
    const bearingRadians = bearing * (Math.PI / 180.0);
    const s = Math.sin(bearingRadians), c = Math.cos(bearingRadians);
    const e = 0, n = origin*c, n1 = n+lengthMetres*c, e1 = e+lengthMetres*s;
    const p = [
        [ e-lengthMetres*0.1*c,  n+lengthMetres*0.1*s, -1.6 ],
        [ e+lengthMetres*0.1*c,   n-lengthMetres*0.1*s, -1.6 ],
        [ e1+lengthMetres*0.1*c,  n1-lengthMetres*0.1*s, -1.6 ],
        [ e1+lengthMetres*0.2*c,  n1-lengthMetres*0.2*s, -1.6 ],
        [ e+lengthMetres*1.1*s,   n+lengthMetres*1.1*c, -1.6 ],
        [ e1-lengthMetres*0.2*c,  n1+lengthMetres*0.2*s, -1.6 ],
        [ e1-lengthMetres*0.1*c,  n1+lengthMetres*0.1*s, -1.6 ]
    ];
    nav.viewer.addShape(p,  {
            id: `path-${nav.curPanoId}-${targetPanoId}-${targetPanoId}-arrow`,
            //tooltip: `Route from #${nav.curPanoId} to #${targetPanoId}`,
            tooltip: `Bearing ${bearing}`,
            fill: 'rgba(255, 255, 0, 0.6)',
            stroke: 'rgba(255, 255, 0, 0.9)',
            type: 'path'
    });
}

/*
function connectPano(lon1, lat1, lon2, lat2) {
    if(app.map.connectLine) {
        app.map.removeLayer(app.map.connectLine);
    }
    const pos = [lat1, lon1];
    app.map.connectLine = L.polyline([pos, [lat2,lon2]]).addTo(map); 
    app.map.setCenter(pos);
}
*/
