var Dialog = {
    show: function(content) {
        $(".dialog").css("display", "none");
        $("#dialog .content").empty().append(content);
        $("#dialog").css("display", "flex");        
        $("#dialog .content").scrollTop(0);
    },
    
    close: function() {
        $("#dialog").css("display", "none");
    }
};

$("#dialog .close").click(function() {
    Dialog.close();
});