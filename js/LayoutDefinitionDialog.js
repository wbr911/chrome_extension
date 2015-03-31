/**
 * Created by stms140802 on 2015/3/20.
 */
/**
 * @param {mp.service.LayoutDefinitionService} layoutDefinitionService
 * @constructor
 */
mp.LayoutDefinitionDialog = function(layoutDefinitionService){
    /**
     * @private
     */
    this.layoutDefinitionService = layoutDefinitionService;
    /**
     * @private
     */
    this.serviceName = "";
    this.initElement();
    this.enterDocument();
};
mp.LayoutDefinitionDialog.UPLOAD_STATUS_SUCCESS = "success";

mp.LayoutDefinitionDialog.prototype.initElement = function(){
    this.dialog = $("<div class='mp-floatBlock-large' id='mp-layoutDefinitionDialog'>" +
    "<div class='mp-header mp-draggable'>Layout Definition </div>" +
    "<span id='mp-layoutDefinitionDialog-closeBtn' class='mp-icon mp-icon-right-corner mp-icon-close-grey'></span>" +
    "<textarea id='mp-layoutDefinitionDialog-content'></textarea>" +
    "<input id = 'mp-layoutDefinitionDialog-descriptionInput' type ='text' placeholder='input the layout definition'>" +
    "<button id='mp-layoutDefinitionDialog-uploadBtn' class='mp-btn'>upload</button>" +
    "</div>").hide().draggable().appendTo($(document.body));
    this.loadingPanel = new mp.LoadingPanel(this.dialog);
    this.uploadStatusPanel = $("<div class='mp-status-panel'></div>").hide().appendTo(this.dialog);
    this.showInCenter(this.dialog);
    /**
     * @private
     */
    this.defintionTextArea = this.dialog.find("#mp-layoutDefinitionDialog-content");
    /**
     * @private
     */
    this.uploadBtn = this.dialog.find("#mp-layoutDefinitionDialog-uploadBtn");
    /**
     * @private
     */
    this.dialogCloseBtn =this.dialog.find("#mp-layoutDefinitionDialog-closeBtn");
    /**
     * @private
     */
    this.descriptionInput = this.dialog.find("#mp-layoutDefinitionDialog-descriptionInput");

};
/**
 * private
 */
mp.LayoutDefinitionDialog.prototype.showInCenter = function($element){
    $element.css("position","absolute");
    if($element.parent().is("body")) {
        var scrollTop = $(document).scrollTop();
        var scrollLeft = $(document).scrollLeft();
        var ratio = 0.1;
        var top = ($(document).height() - scrollTop) * ratio + scrollTop;
        var left = ($(document).width() - scrollLeft) * ratio + scrollLeft;
        $element.css("top", top);
        $element.css("left", left);
    }else if($element.is("img")){
        // can not get the width of img when it's display is none;
        // why it can not be calculated directly?
        var width = $element[0].width;
        var height = $element[0].height;
        var left = ($element.parent().width()- width)/2;
        var top = ($element.parent().height()-height)/2;
        $element.css("top", top);
        $element.css("left", left);
    }
};
mp.LayoutDefinitionDialog.prototype.enterDocument = function(){
    var self = this;
    this.dialogCloseBtn.click(function(){
        self.dialog.hide();
    });
    this.uploadBtn.click(function(){
        var definitionDto = new mp.dto.LayoutDefinitionDto(self.defintionTextArea.text() , self.serviceName , self.descriptionInput.val());
        self.showUploadingAnimation();
        self.layoutDefinitionService.upload(definitionDto , function(status){
            console.log("animation end");
            self.showUploadStatusPanel(status);
            self.loadingPanel.hide();
        });
    });
};
mp.LayoutDefinitionDialog.prototype.showUploadStatusPanel = function(status){
    this.uploadStatusPanel.hide();
    if(status === mp.service.LayoutDefinitionService.SAVE_DEFINITION_SUCCESS){
        this.uploadStatusPanel.removeClass("mp-wrongStatus");
        this.uploadStatusPanel.text("definition is uploaded");
    }else{
        this.uploadStatusPanel.html(status);
        this.uploadStatusPanel.addClass("mp-wrongStatus");
    }
    var left = (this.uploadStatusPanel.parent().width()-this.uploadStatusPanel.width())/2;
    this.uploadStatusPanel.css("left",left);
    this.uploadStatusPanel.css("top",0 - this.uploadStatusPanel.outerHeight());
    this.uploadStatusPanel.show();
    this.uploadStatusPanel.animate({top:0},700);
    var self = this;
    setTimeout(function(){self.uploadStatusPanel.animate({"top":0 - self.uploadStatusPanel.outerHeight()} , 700)} , 4000);
};
mp.LayoutDefinitionDialog.prototype.setLayoutDefinitionStr = function(definitionStr){
    this.defintionTextArea.text(definitionStr);
};

mp.LayoutDefinitionDialog.prototype.setServiceName = function(serviceName){
    this.serviceName = serviceName;
};
/**
 * private
 */
mp.LayoutDefinitionDialog.prototype.showUploadingAnimation = function(){
    console.log("animation start");
    this.loadingPanel.show();
};

mp.LayoutDefinitionDialog.prototype.show = function(){
    this.dialog.show();
};
mp.LayoutDefinitionDialog.prototype.hide = function(){
    this.dialog.hide();
};
