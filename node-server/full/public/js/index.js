import * as OWApp from 'openwanderer-app';

const parts = window.location.href.split('?');     
const get = { };

if(parts.length==2) {         
    if(parts[1].endsWith('#')) {             
        parts[1] = parts[1].slice(0, -1);         
    }         
    const params = parts[1].split('&');         
    for(let i=0; i<params.length; i++) {   
        const param = params[i].split('=');             
        get[param[0]] = param[1];         
    }     
}    

const app = new OWApp.App({
    controlIcons: {
        'select': 'images/cursor-default-click.png',
        'rotate': 'images/baseline_rotate_right_white_18dp.png',    
        'drag'  : 'images/drag-variant.png',
        'delete': 'images/baseline_delete_white_18dp.png',
        'search': 'images/search.png',
        'switchMode' : [
            'images/baseline_panorama_white_18dp.png',
            'images/baseline_map_white_18dp.png',
        ]
    },
    cameraIcon: 'images/camera.png',
    loginContainer: 'loginContainer',
    controlContainer: 'controlContainer',
    searchContainer: 'searchContainer',
    rotateControlsContainer: 'rotateControlsContainer',
    uploadContainer: 'uploadContainer',
    dialogParent: 'main',
    api: {
        panos: 'panorama/all',
        sequence: 'panorama/sequence/{id}',
        sequenceCreate: 'panorama/sequence/create',
        nearest: 'panorama/nearest/{lon}/{lat}'
    }
});

// Illustrating login event handling
app.on("login", user => {
    alert(`Logged in with ID ${user.userid}, name ${user.username}, admin status ${user.isadmin}!`);
});

app.on('logout', () => {
    alert('Logged out!');
});


if(get.lat && get.lon) {
    app.navigator.findPanoramaByLonLat(get.lon, get.lat);
} else {
    app.navigator.loadPanorama(get.id || 8);
}
