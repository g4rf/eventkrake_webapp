/* global localforage, Api, Config, EventsList, LocationList, Dialog */

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

/*** GUI ***/
$(".app-name").empty().append(Config.appName);
$(".app-text").empty().append(Config.appText);

/*** load events ***/
EventsList.updateEvents();

/*** menu clicks ***/
$("#menu-bar").on("click", ".button", function() {
    var section = $(this).data("section");
    
    $(".section").addClass("hidden");
    $("#" + section).removeClass("hidden");
    
    switch(section) {
        case "events-list":
            EventsList.updateEvents();
            break;
        case "location-list":
            LocationList.updateLocations();
            break;
    }
});

/*** tile button clicks ***/
$("#top-bar .button.info").on("click", function() {
    var content = $(".dialog-impress").clone().removeClass("template");
    Dialog.show(content);
});