var Config = {
    appName: "app_name",
    appText: '<div style="">'
            + 'A short description for the info dialog.'
        + '</div>',
    
    eventkrakeDateStart: "2019-06-14T00:00:00",
    eventkrakeDateEnd: "2019-06-17T06:00:00",
    eventkrakeFestival: ["brn2019"],
    
    startDateFormat: {
        weekday: "long",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit"
    },
    endDateFormat: {
        hour: "numeric",
        minute: "2-digit"
    },
    
    mapCenter: [51.067, 13.7545],
    mapZoom: 16,
    mapMaxZoom: 19,
    mapMinZoom: 14,
    mapRotation: -24.556484, // not used
    mapTileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    mapAttribution: "<a href='https://openstreetmap.org'>OpenStreetMap</a>"
};