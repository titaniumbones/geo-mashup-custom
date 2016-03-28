# Geo Mashup Custom Plugin for Hacking History

This plugin adds a small amount of functionality to the powerful but sometimes confusing [Geo Mashup](https://github.com/cyberhobo/wordpress-geo-mashup/wiki/Javascript-API) mapping plugin. It has been designed for use in the [Hacking History](http://www.hackinghistory.ca) class at the University of Toronto, but could be useful in other contexts.

Geo Mashup is great for adding location data to Wordpress posts, but some advanced features of Google Maps and Leaflet are hard to make use of. This plugin is intended to allow developers and moderately skilled site admins to make use of those featues, especially: image overlays (known as ImageOverlays in Leaflet, or GroundOverlays in Google Maps), GeoJSON data (such as lines and shapes, as might be created in [GeoJSON.io](http://geojson.io)), and KML data (as might be exported from Google My Maps -- not all Google Earth features are supported in Google Maps, so be aware that KML files created in Google Earth may not be displayed perfectly in Wordpress).

## Installation
Download the zipfile and unzip in your `wp-content/plugins/` directory, or, alternatively, clone the git repository there.

## Usage
The plugin just adds a few new options to the `[geo_mashup_map]` shortcode. They are:

  * `[geo_mashup_map imageoverlay=NAME]` Add a named image overlay (see below!) to the map.
  * `[geo_mashup_map imageoverlay=NAME imageopacity=0.6]` Set the opacity of the image overlay to a value between 0 and 1. 
  * `[geo_mashup_map geojson=NAME]` Add a named set of geoJSON data (see below!) to the map
  * `[geo_mashup_map kml=FILEURL]` Add geographical data from a KML file that you have uploaded to the web (probably using the "media Upload" interface in the site's admin interface)

### Image Overlays
This is the most important feature of the plugin. "Geo Mashup" does not provide an interface for adding image overlays, and we use them extensively to show the relationship between historical and comtemporary geography.  Ideally one would provide an interface within Wordpress for managing such overlays, but the code for such a feature would be somewhat time-consuming to write and is not all that likely to be used much by end-users (at least, not in the way we have set things up). This is because georeferencing historical maps and images is already a fairly technical process, unlikely to be undertaken by people with no technical training.

An image overlay, or geotagged image, consists of two parts: an image in TIFF, PNG, or JPEG format, and a set of co-ordinates that define the geographical co-ordinates of the image corners. Generating this image will require the use of GIS software such as QGIS or ArcGIS. Please refer to any of the numerous [web-based](http://www.qgistutorials.com/en/docs/georeferencing_basics.html) [tutorials](http://docs.qgis.org/1.8/en/docs/user_manual/plugins/plugins_georeferencer.html) on how to use this software. Though most tutorials suggest using [WGS 84 Web Mercator](http://gis.stackexchange.com/questions/52209/coordinate-system-and-projection-for-georeferencing-google-maps-image-in-arcgis) format, my own experience in QGIS has been that I need to change the projection ("CRS" to "EPSG:4326 - WGS 84") in order to get the decimal co-ordinates that Google and other online maps actually use when deciding where to place the image on the map.  The co-ordinates (north,south,east and west values) can be found in the "Save as" menu that you get to by right-clicking on the appropriate layer in QGIS.

We are using a somewhat dirty hack to store this information. 
  * First you will need to create a gerefernced PNG (or similar) file in QGIs using the Georeferencer plugin. Figure out where the image has been saved and confirm that it has a transparent background (rather than a white or black one, which will obscure parts of the underlying map on which it will be displayed). 
  * Next, determine and record the co-ordinate values via that "save-as" dialog box. 
  * Then, upload the PNG file to the site using the media upload box. Note the URL of the PNG for use in the next step.
  * Finally, modify the array variable `allImageOverlays` in the file `custom.js` to include a new object with the following structure:
  ```javascript
  uniquename : {
        url: '/actual/relative/or/absolute/URL/of/image',
        imageBounds: {
            north : 43.8073086158169, //obviously replace tese with the actual recorded values!
            south : 43.76891864109982,
            west : -79.45731331229433,
            east : -79.38658034742863
        }
  }
  ```

This method is somewhat awkward, and has a number of steps; but it is unlikely to be repeated many times over the course of the website's lifetime, so it's a compromise.

When a website author creates a map with the `imageoverlay` switch, as in `[geo_mashup_map imageoverlay=uniquename]`, the image will appear on the map in the appropriate place.

### Image Opacity
You may want to let the underlying map show through a bit; in this case, adjust the image opacity to your desired value. at some future date we hope to be able to implement a slider that will allow users to change the opacity themselves. This is accomplished with the `imageopacity` switch, which should be a value between 0 and 1. 

### GeoJSON Data
GeoJSON is a relatively easy and technology-neutral way to store geographical highlighting layers such as markers, lines, and shapes. As with image overlays, we store geoJSON datasets in a javascript object that can be retrieved by the map at runtime.  Each dataset has a name, and calling the shortcode with the `geojson` switch, e.g., `[geo_mashup_map geojson=anotheruniquename]` will cause the appropriate geojson to be loaded.

### KML Data
KML data is treated in a slightly different way. Because many end-users are capable of creating KML data, e.g. in Google My Maps or Google Earth, it seemed important to allow them to add KML without editing any code. Simply upload a KML file fia the Media Upload dialog within Wordpress, and use the resultant new URL as the value of the `kml` switch in the shortcode.

Please note that there is also another way to add KML data to a map, by attaching a KML file to the page or post that contains the map you want that data to display on.  This is a built-in capacity of the Geo Mashup plugin, and should probably be used by preference _except_ when you want to use the data on more than one map. I t can also be a little frustrating to use the built-in technique because deleting attachments from Wordpress posts and pages is a very convoluted process. We try to simplify it a __little bit__ in the "Hacking History" plugin, distributed seperately.

This is a pretty simple plugin. It would be great to use it to add more elaborate functionality; please feel free to submit bug reports and pull requrests to the Github repository.


