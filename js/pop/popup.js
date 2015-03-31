
$(function(){
    var components = {};
    components.loadingPanel = new mp.LoadingPanel($(document.body));
    components.serviceLabel = new mp.pop.ServiceLabel( $("#mp-serviceLabel") , components.loadingPanel);

})/**
 * Created by stms140802 on 2015/3/25.
 */
