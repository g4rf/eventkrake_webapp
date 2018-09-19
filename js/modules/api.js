/* global Config, Locations, Events, EventsList */

var Api = {
    timer: null,
    
    /**
     * Gets the events from the api and saves them in the local database.
     * @param {Object} options The parameters for the call, see https://eventkrake.de/
     * @returns {jqXHR} The jQuery Ajax request object.
     */
    getEvents: function(options) {
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
            if(Object.keys(data.locations).length > 0) {
                // store locations
                Locations.clear(function() {
                    jQuery.each(data.locations, function(id, location) {
                        if(! id) return; // falsy entry
                        Locations.setItem(id, location);
                    });
                });
            }
            
            if(Object.keys(data.events).length > 0) {
                // store events
                Events.clear(function() {
                    jQuery.each(data.events, function(id, event) {
                        if(! id) return; // falsy entry
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