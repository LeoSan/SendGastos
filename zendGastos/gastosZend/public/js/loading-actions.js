var loadingActions = {
    containerLoading: '#pendulum-loader',
    idToGlass: function(){
      return $(loadingActions.containerLoading).attr('data-toglass');
    },
    enableLoading:function (id) {
        loadingActions.containerLoading = id
        $(loadingActions.containerLoading).fadeIn();
        loadingActions.addGlass();
    },
    disableLoading:function (id) {
        loadingActions.containerLoading = id
        $(loadingActions.containerLoading).fadeOut();
        loadingActions.removeGlass();
    },
    addGlass:function(){
        $(loadingActions.idToGlass()).addClass("glass");
    },
    removeGlass:function(){
        $(loadingActions.idToGlass()).removeClass("glass");
    },
    customAniamtionLoader:function(timeDelay,id){
        loadingActions.containerLoading = id
        $(loadingActions.idToGlass()).addClass("glass");

        var timeDelaySTO = (timeDelay + 1) * 1000;
        timeDelay = timeDelay * 1000

        $(loadingActions.containerLoading).fadeIn().delay(timeDelay).fadeOut();
        setTimeout(function(){
            $(loadingActions.idToGlass()).removeClass("glass");
        }, timeDelaySTO);
        return false;
    },
    init:function(){
        $(loadingActions.containerLoading).removeClass('hide');
        $(loadingActions.containerLoading).hide();
    }
}

loadingActions.init();