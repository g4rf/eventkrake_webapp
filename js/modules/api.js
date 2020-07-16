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
        
        options.earliestStart = options.earliestStart ||
                Config.eventkrakeDateStart;
        options.latestStart = options.latestStart ||
                Config.eventkrakeDateEnd;
        
        return jQuery.ajax(Config.apiUrl + "events", {
            cache: false,
            crossDomain: true,
            data: options,
            method: "GET"
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
                    jQuery.each(data.events, function(index, event) {
                        Events.setItem(event.id, event);
                    });
                });
            }
            
        }).always(function() {
            // start the timer (again), set to 5 minutes
            Api.timer = window.setTimeout(Api.getEvents, 5 * 60 * 1000);
        });
    }
};