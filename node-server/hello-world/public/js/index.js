import * as OpenWanderer from 'openwanderer-jsapi';

const navigator = new OpenWanderer.Navigator({
    api: { 
        byId: 'panorama/{id}', 
        panoImg: 'panorama/{id}.jpg',
        sequenceUrl: 'panorama/sequence/{id}'
    },
});

navigator.loadPanorama(1);
