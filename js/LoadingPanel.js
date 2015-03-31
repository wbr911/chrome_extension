var mp = mp ||{};/**
 * Created by stms140802 on 2015/3/27.
 */
mp.LoadingPanel = function($parent){
    this.parent = $parent;
    this.decorate(this.parent);
};
mp.LoadingPanel.prototype.decorate = function($container){
    this.loadingPanel = $("<div class='mp-loadingPanel'></div>").hide().appendTo($container);
    this.loadingGif = $("<img  src='chrome-extension://aanhmophikfpipeafjmifhnppfjgameh/images/loading.gif'>").appendTo(this.loadingPanel);
};

/**
 * private
 * @param $element
 */
mp.LoadingPanel.prototype.showInCenter = function($element){
    var width = $element[0].width;
    var height = $element[0].height;
    var left = ($element.parent().width()- width)/2;
    var top = ($element.parent().height()-height)/2;
    $element.css("position" , "absolute");
    $element.css("top", top);
    $element.css("left", left);
};
mp.LoadingPanel.prototype.show =function(){
    this.loadingPanel.css("height",window.innerHeight);
    this.loadingPanel.show();
    this.showInCenter(this.loadingGif);
};
mp.LoadingPanel.prototype.hide =function(){
    this.loadingPanel.hide();
};

