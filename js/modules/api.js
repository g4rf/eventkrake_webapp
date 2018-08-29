/* global Config, Locations, Events */

var Api = {
    timer: null,
    
    /**
     * Gets the events from the api and saves them in the local database.
     * @param {Object} options The parameters for the call, see https://eventkrake.de/
     * @param {Function} callback A callback to call after all is saved.
     * @returns {jqXHR} The jQuery Ajax request object.
     */
    getEvents: function(options, callback) {
        if(typeof options == "undefined") options = {};
        
        options.event_datestart = options.event_datestart ||
                Config.eventkrakeDateStart;
        options.event_dateend = options.event_dateend ||
                Config.eventkrakeDateEnd;
        options.event_festivals = options.event_festivals ||
                Config.eventkrakeFestival;
        
        return jQuery.ajax("https://api.eventkrake.de/getevents/", {
            cache: false,
            crossDomain: true,
            data: options,
            method: "POST"
        }).done(function(data) {
            if(data.locations.length > 0) {
                // store locations
                Locations.clear(function() {
                    jQuery.each(data.locations, function(id, location) {
                        Locations.setItem(id, location);
                    });
                });
            }
            
            if(data.events.length > 0) {
                // store events
                Events.clear(function() {
                    jQuery.each(data.events, function(id, event) {
                        Events.setItem(id, event);
                    });
                });
            }
            
        }).always(function() {
            // start the timer (again), set to 5 minutes
            Api.timer = window.setTimeout(Api.getEvents, 5 * 60 * 1000);
        });
    }
};