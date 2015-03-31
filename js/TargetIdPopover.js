mp.TargetIdPopover = function (markApplier) {
    /**
     * Created by stms140802 on 2015/3/10.
     */
    this.markApplier = markApplier;
    this.range = {};
    this.popoverContainer = {};
    this.searchField = {};
    this.targetList = {};
    this.initElement();
    this.enterDocument();
};
/**
 *
 * @param {mp.TargetIdRecordList} recordList
 */
mp.TargetIdPopover.prototype.setTargetIdRecordList = function (recordList) {
    this.targetIdRecordList = recordList;
};
mp.TargetIdPopover.prototype.unSelectTargetId = function (markValue) {
    this.targetList.find("div[" + mp.MarkApplier.MARK_ATTR_NAME + "=" + markValue + "]").removeClass("mp-chosen");
};
mp.TargetIdPopover.prototype.clearAndHide = function () {
    this.popoverContainer.hide();
    this.targetList.find(".mp-chosen").removeClass("mp-chosen");
};
/**
 * @private
 */
mp.TargetIdPopover.prototype.initElement = function () {

    this.popoverContainer = $("<div tabindex='1' id='mp-targetIdPopoverContainer' class='mp-floatBlock mp-clearfix'>" +
    "<div class='mp-header'><div class='mp-pop-title'>You can adapt below</div></div>" +
    "<span class='mp-icon mp-icon-right-corner mp-icon-close-grey' style='color:#DDD'></span>" +
    "</div>");
    this.searchField = $("<div id='mp-pop-searchField'></div>").hide().appendTo(this.popoverContainer);
    this.targetList = $("<div id='mp-pop-targetList'></div>").appendTo(this.popoverContainer);
    this.popoverContainer.hide().appendTo($(document.body));
};
/**
 * @private
 */
mp.TargetIdPopover.prototype.fetchItemList = function(){
    var self = this;
    chrome.runtime.sendMessage({command:mp.service.Constants.COMMAND_ITEM_LIST},function(response){
        self.setData(response.data);
    });
};
mp.TargetIdPopover.prototype.enterDocument = function () {
    var self = this;
    this.popoverContainer.find(".mp-close").bind("click", function () {
        self.popoverContainer.hide();
    });
    this.popoverContainer.on("click", ".mp-icon-close-grey", function () {
        self.popoverContainer.hide();
    });
    this.popoverContainer.blur(function () {
            self.popoverContainer.hide();
        }
    );
    this.targetList.on("click", ".mp-pop-targetIdItem", function (event) {
        var $item = $(event.target);
        $item.addClass("mp-chosen");
        self.recordRelationOfElement2TargetId(self, $item.attr(mp.MarkApplier.MARK_ATTR_NAME));
        self.popoverContainer.hide();

    });
    this.targetList.on("mouseenter", ".mp-pop-targetIdItem", function (event) {
        var item = $(event.target);
        item.addClass("mp-pop-targetId-hover");
    });
    this.targetList.on("mouseleave", ".mp-pop-targetIdItem", function (event) {
        var item = $(event.target);
        item.removeClass("mp-pop-targetId-hover");
    });
};

mp.TargetIdPopover.prototype.setData = function (dataArray) {
    this.targetList.children().remove();
    for (i = 0; i < dataArray.length; i++) {
        this.targetList.append(this.createTargetIdItem(dataArray[i]));
    }

};

mp.TargetIdPopover.prototype.showPopoverMenuUnderSelectedNodes = function () {
    this.fetchItemList();
    var left, top;
    var endContainer = document.getSelection().getRangeAt(0).endContainer;
    if (endContainer.nodeType == 3) {
        endContainer = endContainer.parentNode;
    }
    $endContainer = $(endContainer);
    var baseOffset = $endContainer.offset();
    left = ($endContainer.width() / 2 + baseOffset.left) - this.popoverContainer.width() / 2;
    top = $endContainer.height() + baseOffset.top;
    this.popoverContainer.css("left", left);
    this.popoverContainer.css("top", top);
    this.popoverContainer.slideDown(200);
};
/**
 * @private
 */
mp.TargetIdPopover.prototype.createTargetIdItem = function (data) {
    var item = $("<div class='mp-pop-targetIdItem' " + mp.MarkApplier.MARK_ATTR_NAME + "=" + data + ">" + data + "</div>");
    return item;
};
/**
 * @private
 */
mp.TargetIdPopover.prototype.recordRelationOfElement2TargetId = function (self, targetId) {
    if (self.targetIdRecordList.hasTargetIdItem(targetId)) {
        self.markApplier.undoOnMarkedElement(targetId);
    } else {
        self.targetIdRecordList.addTargetIdItem(targetId);
    }
    self.markApplier.addMarkToRangeElements(targetId);

};
/**
 * @private
 */
mp.TargetIdPopover.prototype.prepareMockData = function () {
    this.setData(["corporate Name", "address", "telephone","representative"])
};