var Dialog = {
    show: function(content) {
        $("#dialog .content").empty().append(content);
        $("#dialog").css("display", "flex");        
        $("#dialog .content").scrollTop(0);
    }
};

$("#dialog .close").click(function() {
    $("#dialog").css("display", "none");
});