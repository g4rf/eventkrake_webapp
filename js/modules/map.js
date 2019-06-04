/* global Leaflet, Config, Locations, LocationList, Events, Helper */

/* no conflict */
var Leaflet = L.noConflict();

var Map = {
    map: null,
    tileLayer: null,
    locationsLayer: null,
    eventsLayer: null,
    highlightLayer: null,
    
    locateMarker: null,
    locateCircle: null,
    
    initialize: function() {
        // initialize map if not done yet
        if(jQuery("#map:empty").length > 0) {
            // show container, otherwise the map won't load
            $(".section").addClass("hidden");
            $("#map-section").removeClass("hidden");
            
            // initialize map
            Map.map = Leaflet.map('map');
            
            // add additional controls
            var controlShowEvents = Leaflet.Control.extend({
                options: {
                    position: 'topright'                 
                },
                onAdd: function (map) {
                    var container = Leaflet.DomUtil.create('div', 
                        'leaflet-bar leaflet-control switch-layer show-events');
                    jQuery(container).append("Was läuft gerade?").click(function() {
                        Map.showEventsLayer();
                    });
                    return container;
                }
            });
            Map.map.addControl(new controlShowEvents());
            
            var controlShowLocations = Leaflet.Control.extend({
                options: {
                    position: 'topright'                 
                },
                onAdd: function (map) {
                    var container = Leaflet.DomUtil.create('div', 
                        'leaflet-bar leaflet-control switch-layer show-locations selected');
                    jQuery(container).append("Orte").click(function() {
                        Map.showLocationsLayer();
                    });
                    return container;
                }
            });
            Map.map.addControl(new controlShowLocations());
            
            var controlLocate = Leaflet.Control.extend({
                options: {
                    position: 'topleft'
                },
                onAdd: function (map) {
                    var container = Leaflet.DomUtil.create('div', 
                        'leaflet-bar leaflet-control locate');
                    jQuery(container).append("⌖").click(function() {
                        if(jQuery(this).hasClass("on")) {
                            // disable locating
                            jQuery(this).removeClass("on");
                            Map.map.stopLocate();
                            //Map.locateMarker.remove();
                            Map.locateCircle.remove();
                        } else { // enable locating
                            jQuery(this).addClass("on");
                            Map.map.locate({
                                watch: true,
                                setView: false,
                                enableHighAccuracy: true
                            });
                        }
                    });
                    return container;
                }
            });
            Map.map.addControl(new controlLocate());
            Map.map.on('locationfound', function(l) {
                var radius = l.accuracy / 2;
                
                if(Map.locateMarker) Map.locateMarker.remove();
                if(Map.locateCircle) Map.locateCircle.remove();
                
                Map.locateMarker = Leaflet.marker(l.latlng, {
                    pane: "overlayPane",
                    icon: Leaflet.divIcon({className: "location-point"})
                }).addTo(Map.map);
                
                Map.locateCircle = Leaflet.circle(l.latlng, {
                    radius: radius,
                    pane: "overlayPane"
                }).addTo(Map.map);
                
                Map.map.panTo(l.latlng);
            });
            Map.map.on('locationerror', function(err) {
                console.log(err);
            });
            
            // add tile layer
            Map.tileLayer = new Leaflet.tileLayer(Config.mapTileUrl, {
                attribution: Config.mapAttribution,
                maxZoom: Config.mapMaxZoom,
                minZoom: Config.mapMinZoom,
                useCache: true,
                crossOrigin: true,
                cacheMaxAge: 7 * 24 * 60 * 60 * 1000
            });
            Map.map.addLayer(Map.tileLayer);
            Map.map.setView(Config.mapCenter, Config.mapZoom);
            
            // highlight layer
            Map.highlightLayer = Leaflet.layerGroup().addTo(Map.map);
            
            // add locations
            Map.locationsLayer = Leaflet.featureGroup();
            var icon = Leaflet.divIcon({className: "marker location"});
            Locations.iterate(function(location, key, i) {
                Leaflet.marker([location.lat, location.lng], {
                    title: location.name,
                    riseOnHover: true,
                    icon: icon,
                    eventkrakeLocation: location
                }).on('click', function() {
                    Map.highlightMarker(this.getLatLng());
                    
                    jQuery("#location-list .locations").val(location.id);
                    jQuery("#menu-bar .button[data-section='location-list'").click();
                }).addTo(Map.locationsLayer);
            });
                        
            // add events
            Map.eventsLayer = Leaflet.featureGroup();
            Map.updateEvents();
            
            // show location or events?
            var now = new Date();
            if(now < new Date(Config.eventkrakeDateStart) || 
                    now > new Date(Config.eventkrakeDateEnd)) {
                // when outside of festival time show locations
                Map.map.addLayer(Map.locationsLayer);
            } else {
                // during festival show events
                Map.map.addLayer(Map.eventsLayer);
            }
            
            // update event markers on map change
            Map.map.on("resize zoomend moveend", function() {
                Map.updateEvents();
            });
            
            // seeding (filling) cache with needed tiles
            Map.tileLayer.seed(Leaflet.latLngBounds(Config.mapCacheBounds),
                Config.mapCacheMinZoom, Config.mapCacheMaxZoom);
        }
    },
        
    highlightMarker: function(latlng) {
        Map.highlightLayer.clearLayers();
        Leaflet.marker(latlng, {
            icon: Leaflet.divIcon({className: "marker highlight"}),
            pane: "shadowPane"
        }).addTo(Map.highlightLayer);
    },
    
    updateEvents: function() {
        var now = new Date(); //*/new Date("2019-06-16T19:05:00");
        var icon = Leaflet.divIcon({className: "marker event"});
        
        Events.iterate(function(event, key, i) {
            var start = new Date(event.datetime);
            var end = new Date(event.datetime_end);
            
            if(now < start || now > end) return;
            
            Locations.getItem(event.locationid, function(err, location) {
                if(err || location == null) return;
                Leaflet.marker([location.lat, location.lng], {
                    title: event.title,
                    riseOnHover: true,
                    icon: icon,
                    eventkrakeLocation: location,
                    eventkrakeEvent: event
                }).on('click', function() {
                    Map.highlightMarker(this.getLatLng());
                    Helper.showEvent(this.options.eventkrakeEvent);
                }).addTo(Map.eventsLayer);
            });
        });
    },
    
    showEventsLayer: function() {
        Map.highlightLayer.clearLayers();
        Map.locationsLayer.remove();
        Map.map.addLayer(Map.eventsLayer);
        jQuery("#map .switch-layer").removeClass("selected");
        jQuery("#map .switch-layer.show-events").addClass("selected");
    },
    
    showLocationsLayer: function() {
        Map.highlightLayer.clearLayers();
        Map.eventsLayer.remove();
        Map.map.addLayer(Map.locationsLayer);
        jQuery("#map .switch-layer").removeClass("selected");
        jQuery("#map .switch-layer.show-locations").addClass("selected");
    },
    
    openLocationOnMap: function(location) {
        Map.initialize(); // !!! don't do this with the menu click, coz asynchronously
        
        // select marker        
        var latlng = [location.lat, location.lng];
        Map.map.setView(latlng, Config.mapMaxZoom);
        Map.highlightMarker(latlng);
        Map.showLocationsLayer();
        
        // menu gui things
        jQuery("#menu-bar .button[data-section='map-section'").click();
    }
};