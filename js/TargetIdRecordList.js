/**
 *
 * @param {mp.MarkApplier} markApplier
 * @param {mp.TargetIdPopover} targetIdPopover
 * @constructor
 */
mp.TargetIdRecordList = function (markApplier) {
    this.itemList = [];
    this.container = {};
    this.targetIdPopover = {};
    this.markApplier=markApplier;
    this.initElement();
    this.enterDocument();
    /**
     * Created by stms140802 on 2015/3/10.
     */
};

mp.TargetIdRecordList.prototype.HOVER_CSS="mp-list-targetIdItem-hover";
/**
 *
 * @param {mp.TargetIdPopover} popover
 */
mp.TargetIdRecordList.prototype.setPopover = function(popover){
    this.targetIdPopover = popover;
};
mp.TargetIdRecordList.prototype.clearAndHide = function(){
    this.container.hide();
    this.container.find(".mp-list-targetIdItem").remove();
    this.itemList =[];
};
/**
 * @private
 */

mp.TargetIdRecordList.prototype.initElement = function () {
    this.container = $("<div id='mp-targetIdRecordList-container' class='mp-floatBlock'>" +
    "<div class='mp-header mp-draggable'>target id list</div>").draggable();
    // draggable will change the position from absolute to relative;
    this.container.removeAttr("style");
    this.container.hide().appendTo($(document.body));
};
/**
 * @private
 */
mp.TargetIdRecordList.prototype.enterDocument = function () {
    var self = this;
    this.container.on("mouseenter", ".mp-list-targetIdItem", function () {
        var attr = $(this).attr(mp.MarkApplier.MARK_ATTR_NAME);
        $(this).addClass(self.HOVER_CSS);
        $("value[" + mp.MarkApplier.MARK_ATTR_NAME + "=" + attr + "]").addClass(mp.MarkApplier.MARKED_HOVER_CSS);

    })
    this.container.on("mouseleave", ".mp-list-targetIdItem", function () {
        var attr = $(this).attr(mp.MarkApplier.MARK_ATTR_NAME);
        $(this).removeClass(self.HOVER_CSS);
        $("value[" + mp.MarkApplier.MARK_ATTR_NAME + "=" + attr + "]").removeClass(mp.MarkApplier.MARKED_HOVER_CSS);
    })
    this.container.on("click", ".mp-icon-close",function(){
        var item = $(this).parent();
        var markValue = item.attr(mp.MarkApplier.MARK_ATTR_NAME);
        self.markApplier.undoOnMarkedElement(markValue);
        item.remove();
        var index = self.itemList.indexOf(markValue);
        self.itemList = self.itemList.slice(index , 1);
        self.targetIdPopover.unSelectTargetId(markValue);
    })
};

mp.TargetIdRecordList.prototype.addTargetIdItem = function (targetId) {
    this.itemList.push(targetId);
    this.container.append(this.createItem(targetId));
};
mp.TargetIdRecordList.prototype.getItemList = function () {
    return this.itemList;
};
mp.TargetIdRecordList.prototype.hasTargetIdItem = function (targetId) {
    var has = false;
    $.each(this.itemList, function (n, value) {
        if (value=== targetId) {
            has = true;
            return false;
        }
    });
    return has;
};
/**
 * @private
 */
mp.TargetIdRecordList.prototype.createItem = function (targetId) {
    var markAttr = mp.MarkApplier.MARK_ATTR_NAME + "=" + targetId;
    var item = $("<div class='mp-list-targetIdItem'" + markAttr + ">" + targetId + "</div>");
    var closeIcon = $("<span class='mp-icon mp-icon-float-right mp-icon-close'></span>").appendTo(item);
    return item;
};
/**
 *
 * @param  left
 * @param  top
 */
mp.TargetIdRecordList.prototype.showListMenu = function (left, top) {
    this.container.css("left", left);
    this.container.css("top", top);
    this.container.show();
};
mp.TargetIdRecordList.prototype.getContainer = function () {
    return this.container;
};


