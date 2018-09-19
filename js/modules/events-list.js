/* global Events, Locations */

var EventsList = {
    updateEvents: function() {
        var eventsList = $("#events-list");
                
        // get all event elements and save their ids
        var oldEvents = $.map($(".event", eventsList).not(".template"), function(n, i){
            return n.id;
        });
        
        // iterate over the database and update/add elements
        Events.iterate(function(event, key, index) {
            var element = $("#el" + event.id);
            if(element.length > 0) {
                // update element
                EventsList.fillElement(element, event);
                
                // remove existing from the event elements array
                var i = oldEvents.indexOf("el" + key);
                if (index > -1) {
                    oldEvents.splice(i, 1);
                }
            } else {
                // add element
                element = $(".event.template", eventsList).clone()
                        .removeClass("template");
                EventsList.fillElement(element, event);
                // find position
                $(".event", eventsList).not(".template").each(function(i, e) {
                    if(new Date(event.datetime) < 
                            new Date($(e).data("event").datetime)) {
                        element.insertBefore(e);
                        return false;
                    }
                });
                // check if inserted
                if($("#el" + event.id).length == 0) {
                    eventsList.append(element);
                }
            }
        }).then(function() {
            // delete the remaining elements in the event elements array
            jQuery.each(oldEvents, function(index, id) {
                $(id).remove();
            });
        });
    },
    
    fillElement: function(element, event) {
        $(element).attr("id", "el" + event.id).data("event", event);        
        
        $(".title", element).empty().append(event.title);
        $(".description", element).empty().append(event.text);
        //$(".url", element).empty().append(event.title);
        
        // time
        var start = new Date(event.datetime);
        var end = new Date(event.datetime_end);
        var time = start.toLocaleString(undefined, {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit"
        });
        time += " - ";
        time += end.toLocaleString(undefined, {
            hour: "numeric",
            minute: "2-digit"
        });
        $(".time", element).empty().append(time);
        
        // location
        // TODO: Findet keine Locations.
        console.log(event.locationid);
        Locations.getItem(event.locationid, function(location) {
            $(".location-name", element).empty().append(location.name);
            $(".location-address", element).empty().append(location.address);
        });        
    }
};