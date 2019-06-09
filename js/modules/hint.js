var Hint = {
    show: function(content) {
        jQuery("#hint").hide().empty().append(content).show();
        window.setTimeout(function() {
            jQuery("#hint").fadeOut("slow");
        }, 3000);
    }
};