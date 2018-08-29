/* global localforage, Api */

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

/*** menu clicks ***/
$("#menu-bar").on("click", ".button", function() {
    console.log(this);
    var section = $(this).data("section");
    
    $(".section").addClass("hidden");
    $("#" + section).removeClass("hidden");
});

