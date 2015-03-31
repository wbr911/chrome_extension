var mp = mp || {};
mp.pop = mp.pop||{};

/**
 *
 * @param $element
 * @constructor
 */
mp.pop.ServiceLabel = function($element, loadingPanel){
    /**
     * Created by stms140802 on 2015/3/25.
     */
    /**
     *  @type {mp.service.ConfigurationService}
     */
    this.configureService;
    this.serviceLabel = $element;
    this.serviceListPanel = $element.find("#mp-serviceList");
    this.serviceList = [];
    this.serviceBtn  = $element.find(".btn");
    this.searchField = $element.find("#mp-service-search-field");
    this.loadingPanel = loadingPanel;
    var self = this;
    chrome.runtime.getBackgroundPage(
        function(bgPage){
        self.configureService = bgPage.mp.service.configureService;
        self.initElement();
    });
    this.enterDocument();
};
mp.pop.ServiceLabel.prototype.initElement = function(){
    //this.loadingPanel.show();
    this.serviceList = this.configureService.getAllServiceName();
    //this.loadingPanel.hide();
    this.serviceBtn.text(this.configureService.currentServce===""? "no services exist" : this.configureService.currentServce);
    this.renderServiceListPanel(this.serviceList);
};
/**
 * private
 */
mp.pop.ServiceLabel.prototype.renderServiceListPanel = function(data){
    var self = this;
    $.each(data, function( i ,serviceName){
        $("<li><a href='#'>"+serviceName+"</a></li>").appendTo(self.serviceListPanel);
    });
};
mp.pop.ServiceLabel.prototype.enterDocument = function(){
    var self = this;
    this.serviceBtn.click(function(){
        self.serviceListPanel.slideToggle();
        if(self.serviceListPanel.css("display")!=="none"){
            self.serviceLabel.addClass("mp-active");
        }else{
            self.serviceLabel.removeClass("mp-active");
        }
    });
    $(document).on("click" ,":not('.mp-active')",function(e){
        $target = $(e.target);
        if($target.parents(".mp-active").length===0){
            $(".mp-active").hide();
            $(".mp-active").removeClass("mp-active");
        }
    } );
    this.serviceListPanel.on("click" , "li" ,function(e){
        $target = $(e.target);
        var service  = $target.text();
        self.serviceBtn.text(service);
        self.loadingPanel.show();
        self.configureService.setService(service , function(){
            self.loadingPanel.hide();
            self.serviceListPanel.hide();
        });

    });
    this.searchField.keydown(function(e){
        var prefix  = self.searchField.val();
        var matchedList = {};
        $.each(self.serviceList , function(i , item){
           if("a".indexOf(prefix)===0){
               matchedList.push(item);
           }
        });
        self.renderServiceListPanel(matchedList);
    });
};
