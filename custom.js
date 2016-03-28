// This very primitive Geo Mashup customization allows users to activate
// extra map layers stored as image overlays, geoJSON, and KML, using
// new switches to the geo_mashup_map shortcode.

// The new switches are documented in the README

// global variables that store invormation we'll need later on

// placeholder to be used in the lampda function below
var historicalOverlay;
// list of all the image overlays. The unique name of each overlay is an attribute of the main variable, and has as a value
// with two parts, "url" and "imageBounds". Add your image overlays here. It is probably a good idea to use relative URL's
// in case your site name changes.  
var allImageOverlays = {
    newtonbrook: {
        url: 'http://flynnhouse.hackinghistory.ca/wp-content/uploads/2016/03/Newtonbrook-Tremaine-Map-r-neg21.png',
        imageBounds: {
            north : 43.8073086158169,
            south : 43.76891864109982,
            west : -79.45731331229433,
            east : -79.38658034742863
        }
    }
}

// similar to the above, but stores sets of geoJSON data, if you have any.
var geoJsonFiles = {
    newtonbrook: ''
}

// console.log(allImageOverlays);


// this lambda function is loaded by the main geomashup plugin.  It has access to the
// mapstraction map object ("map"), and to a properties object which stores all of the shortcode
// attributes along with a bunch of other data. But we're only interested in the new attrributes we've added:
// imageoverlay, imageopacity, geojson, and kml.  
GeoMashup.addAction( 'loadedMap', function ( properties, map ) {
    // console.log(properties.imageoverlay);
    // get direct access to the google map object. Should do a check to ensure that we're actually
    // using google map.  A proper implementation will likely rewrite some of this code to be more
    // portable
    var google_map = map.getMap();
    // we'll use these later
    var thisOverlay, thisOpacity;

    // prepare to insert image; set thisOpacity to 0.7 by default
    if (properties.imageopacity || properties.imageopacity <= 1|| properties.imageopacity >= 0 ) {
        thisOpacity = properties.imageopacity;
    } else {
        thisOpacity = 0.7;
    }

    // if shortcode specifies an image overlay, retrieve its information from the 
    // variable 'imageOverlays' and add it to the map.
    if (properties.imageoverlay) {
        // just make it easier to reference the overlay object
        var o = allImageOverlays[properties.imageoverlay];
        // this line defines the overlay
        thisOverlay = new google.maps.GroundOverlay(o.url, o.imageBounds, {opacity:thisOpacity});
        // now make it appear on the map
        thisOverlay.setMap(google_map);
    }

    // if shortcode specifies a kml, retrieve it and add to map.
    if (properties.kml) {
        var kml = new google.maps.KmlLayer(properties.kml, {
            map:google_map});
    }

    // goeJSON hasn't been implemented yet!! Ooops
    

} );

