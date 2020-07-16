/* global Events, Locations, Config, Dialog, Helper, moment */

var EventsList = {
    updateEvents: function(filter) {
        var eventsList = $("#events-list .events-list");
                
        // get all event elements and save their ids
        var oldEvents = jQuery.map(jQuery(".event", eventsList).not(".template"), function(n, i){
            return n.id;
        });
        
        // check if there are any events in the database
        Events.length().then(function(n) {
            if(n == 0) { // no events yet, check in 1 sec again
                window.setTimeout(EventsList.updateEvents, 1000);
                return;
            }
            $(".no-events", eventsList).remove();
            
            // iterate over the database and update/add elements
            Events.iterate(function(event, key, index) {
                if(typeof filter != "undefined") {
                    filter = filter.toLowerCase();
                    if(event.title.toLowerCase().indexOf(filter) == -1 &&
                       event.text.toLowerCase().indexOf(filter) == -1 &&
                       event.excerpt.toLowerCase().indexOf(filter) == -1) {
                        return;
                    }
                }
                
                var time = moment(jQuery("#events-list .day-time-picker .day").val());
                time.hour(jQuery("#events-list .day-time-picker .time").val());
                    
                var element = $("#el" + event.id);
                if(element.length > 0) {
                    // remove element if outdated
                    if(moment(event.end).isBefore(time)) {
                        element.remove();
                        
                    } else { // update element
                        EventsList.fillElement(element, event);
                    }
                    
                    // remove existing from the event elements array
                    var i = oldEvents.indexOf("el" + key);
                    if (index > -1) {
                        oldEvents.splice(i, 1);
                    }
                } else {
                    // only if not outdated
                    if(moment(event.end).isAfter(time)) {
                        // add element
                        element = $(".event.template", eventsList).clone()
                                .removeClass("template");
                        EventsList.fillElement(element, event);
                        // find position
                        $(".event", eventsList).not(".template").each(function(i, e) {
                            if(moment(event.start).isBefore( 
                                    moment($(e).data("event").start))) {
                                element.insertBefore(e);
                                return false;
                            }
                        });
                        // check if inserted
                        if($("#el" + event.id).length == 0) {
                            eventsList.append(element);
                        }
                    }
                }
            }).then(function() {
                // delete the remaining elements in the event elements array
                jQuery.each(oldEvents, function(index, id) {
                    $(id).remove();
                });
            });
        });
    },
    
    clear: function() {
        var eventsList = $("#events-list");
        $(".event", eventsList).not(".template").remove();
    },
    
    fillElement: function(element, event) {
        $(element).attr("id", "el" + event.id).data("event", event);        
        
        $(".title", element).empty().append(event.title);
        
        // time
        var start = moment(event.start);
        var end = moment(event.end);
        var time = start.format(Config.startDateFormat);
        time += " - ";
        time += end.format(Config.endDateFormat);
        $(".time", element).empty().append(time);
        
        // location
        Locations.getItem(event.locationid, function(err, location) {
            if(location == null) return;
            $(".location-name", element).empty().append(location.name);
            $(".location-address", element).empty().append(location.address);
        });        
    }
};

/** load day-time-picker **/
(function() {
    var dayPicker = jQuery("#events-list .day-time-picker .day");
    var timePicker = jQuery("#events-list .day-time-picker .time");
    
    var date = moment(Config.eventkrakeDateStart).startOf("day");
    var end = moment(Config.eventkrakeDateEnd).startOf("day");
    while(date.isBefore(end)) {
        dayPicker.append("<option value='" + date.toISOString() + "'>" 
                + date.format("dddd, D.M.") + "</option>");
        
        date.add(1, "day");
    }
    
    for(var i = 0; i < 24; i++) {
        timePicker.append("<option value='" + i + "'>ab " 
                + i + " Uhr</option>");
    }
})();

$("#events-list").on("click", ".event", function() {
    Helper.showEvent($(this).data("event"));
});

jQuery("#events-list .day-time-picker select").on("change", function() {
    EventsList.clear();
    EventsList.updateEvents();
});

$("#events-list .button.search").click(function() {
    $(".dialog").css("display", "none");
    $("#search").css("display", "flex");
    $("#search .term").focus();
    $("#search .term").select();
});

$("#search button.search").click(function() {
    EventsList.clear();
    EventsList.updateEvents($("#search .term").val());
    $("#search").css("display", "none");
});

$("#search button.reset").click(function() {
    EventsList.updateEvents();
    $("#search").css("display", "none");
});

$("#search button.close").click(function() {
    $("#search").css("display", "none");
});