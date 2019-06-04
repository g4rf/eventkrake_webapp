/* global localforage, Api, Config, EventsList, LocationList, Dialog, Map */

/*** do some good stuff from Boilerplate ***/
MBP.hideUrlBarOnLoad(); // Hide URL Bar
MBP.preventZoom(); // Prevent iOS from zooming onfocus
MBP.startupImage(); // iOS Startup Image helper

/*** create localForage instances ***/
var Events = localforage.createInstance({
    name: "Eventkrake",
    storeName: "events"
});
var Locations = localforage.createInstance({
    name: "Eventkrake",
    storeName: "locations"
});

/*** load data ***/
Api.getEvents();

/*** load events and locations ***/
EventsList.updateEvents();
LocationList.updateLocations();

/*** GUI ***/
$(".app-name").empty().append(Config.appName);
$(".app-text").empty().append(Config.appText);

/*** menu clicks ***/
$("#menu-bar").on("click", ".button", function() {
    var section = $(this).data("section");
    
    $("#menu-bar .button").removeClass("highlighted");
    $(this).addClass("highlighted");
    
    switch(section) {
        case "events-list":
            EventsList.updateEvents();
            break;
        case "location-list":
            LocationList.updateLocations();
            break;
        case "map-section":
            Map.initialize();
            break;
    }
    
    $(".section").addClass("hidden");
    $("#" + section).removeClass("hidden");
});

/*** tile button clicks ***/
$("#top-bar .button.info").on("click", function() {
    var content = $(".dialog-impress").clone().removeClass("template");
    Dialog.show(content);
});