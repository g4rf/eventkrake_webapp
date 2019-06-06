/* global Events, Locations, Config, Dialog, Helper */

var LocationList = {
    updateLocations: function() {
        Locations.length().then(function(n) {
            if(n == 0) { // no events yet, check in 1 sec again
                window.setTimeout(LocationList.updateLocations, 1000);
                return;
            }
        
            var locationList = $("#location-list");
            var locations = $(".locations", locationList);

            // save current selection, empty list
            var currentLocation = locations.val();
            locations.empty();

            // iterate over locations
            Locations.iterate(function(location, key, index) {
                $("<option />").val(location.id).append(location.name)
                        .appendTo(locations);
            }).then(function() {
                // sort locations
                var locationOptions = $("option", locations);
                locationOptions.sort(function(a, b) {
                    return a.text.localeCompare(b.text, "de", { sensitivity: 'base' });
                });
                locations.empty().append(locationOptions);
                if(currentLocation) locations.val(currentLocation);
                else locations.prop("selectedIndex", 0);

                LocationList.updateEvents();
            });
        });
    },
    
    updateEvents: function() {
        var locationList = $("#location-list");
        var eventsList = $(".events-list", locationList);

        // remove events
        LocationList.clear(); 
        
        // get selected location
        var currentLocation = $(".locations", locationList).val();
        
        // hide no events sign
        $(".no-events", locationList).remove();
        
        // iterate over the database and add events
        Events.iterate(function(event, key, index) {
            if(event.locationid != currentLocation) return;
            
            // add element
            var element = $(".event.template", eventsList).clone()
                    .removeClass("template");
            LocationList.fillElement(element, event);
            // find position
            var inserted = false;
            $(".event", eventsList).not(".template").each(function(i, e) {
                if(new Date(event.datetime.replace(" ", "T")) < 
                        new Date($(e).data("event").datetime.replace(" ", "T"))) {
                    element.insertBefore(e);
                    inserted = true;
                    return false;
                }
            });
            // check if inserted
            if(! inserted) eventsList.append(element);
        });
    },
    
    clear: function() {
        var eventsList = $("#location-list .events-list");
        $(".event", eventsList).not(".template").remove();
    },
    
    fillElement: function(element, event) {
        $(element).data("event", event);        
        
        $(".title", element).empty().append(event.title);
        
        // time
        var start = new Date(event.datetime.replace(" ", "T"));
        var end = new Date(event.datetime_end.replace(" ", "T"));
        var time = start.toLocaleString(undefined, Config.startDateFormat);
        time += " - ";
        time += end.toLocaleString(undefined, Config.endDateFormat);
        $(".time", element).empty().append(time);
        
        // excerpt
        if(event.excerpt.length > 0) {
            $(".excerpt", element).empty().append(event.excerpt);
        } else {
            if(event.text.length > 0) {                
                $(".excerpt", element).empty().append(
                    $("<div>" + event.text + "</div>").text()
                        .substring(0,100) + "…"
                );
            } else {
                jQuery(".excerpt", element).hide();
            }
        }
    }
};

$("#location-list").on("click", ".event", function() {
    Helper.showEvent($(this).data("event"));
});

$("#location-list .locations").on("change", function() {
    LocationList.updateEvents();
});