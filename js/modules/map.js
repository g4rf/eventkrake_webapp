/* global Leaflet, Config, Locations */

var Map = {
    map: null,
    
    initialize: function() {
        // initialize map if not done yet
        if(jQuery("#map:empty").length > 0) {
            Map.map = Leaflet.map('map');
            Map.map.addLayer(new Leaflet.tileLayer(Config.mapTileUrl, {
                attribution: Config.mapAttribution,
                maxZoom: Config.mapMaxZoom,
                minZoom: Config.mapMinZoom,
                useCache: true,
                crossOrigin: true,
                cacheMaxAge: 7 * 24 * 60 * 60 * 1000
            }));
            Map.map.setView(Config.mapCenter, Config.mapZoom);
            Map.updateMarkers();
            
            Map.map.on("resize zoomend moveend", function() {
                console.log(Map.map.getBounds());
                Map.updateMarkers();
            });
        }
        
        // seed
        // event cache-error
        // bounds herausfinden
    },
    
    updateMarkers: function() {
        // icon
        var icon = new L.Icon.Default();
        icon.options.shadowSize = [0, 0];
        
        // if the festival is running show events
        
        // otherwise locations
        Locations.iterate(function(location, key, i) {
            Leaflet.marker([location.lat, location.lng], {
                title: location.name,
                alt: location.name + "\n" + location.address,
                riseOnHover: true,
                icon: icon
            }).on('click', function() {
                jQuery("#location-list .locations").val(location.id);
                jQuery("#menu-bar .button[data-section='location-list'").click();
            }).addTo(Map.map);
        });
    }
};

/* no conflict */
var Leaflet = L.noConflict();
