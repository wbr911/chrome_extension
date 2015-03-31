/**
 * Created by stms140802 on 2015/3/10.
 */
var mp = mp||{};
rangy.init();
mp.MarkApplier = function () {
    this.range = {};
};
mp.MarkApplier.MARKED_HOVER_CSS = "mp-marked-hover";
mp.MarkApplier.MARK_ATTR_NAME = "target-item";
mp.MarkApplier.GROUP_ATTR_NAME = "group-by-key";
mp.MarkApplier.MARKED_VALUE_CLASS = "mp-target-item";
mp.MarkApplier.prototype.addMarkToRangeElements = function (markValue) {
    //reset the range with the one saved before, since click will also reset the original expected range object
    var selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(this.range);
    var classApplier = this.createClassApplier(markValue);
    classApplier.applyToSelection();
    var effectedElements = $("value[target-item=" + markValue + "]");
    if (effectedElements && effectedElements.size() > 1) {
        effectedElements.attr(mp.MarkApplier.GROUP_ATTR_NAME, markValue);
    }
    //clear the selection
    selection.removeAllRanges();
};
mp.MarkApplier.prototype.saveRange = function(range){
    this.range = range;
}
mp.MarkApplier.prototype.undoOnMarkedElement = function (markValue) {
    var classApplier = this.createClassApplier(markValue);
    var valueList = $("value[" + mp.MarkApplier.MARK_ATTR_NAME + " = " + markValue + "]");
    $.each(valueList,function(i , value){
        $(value).replaceWith($(value).contents());
    });
    /*if (valueList.length) {
        var start = valueList[0];
        var end = valueList[valueList.length - 1];
        var rangeToUndo = new Range();
        rangeToUndo.setStart(start, 0);
        rangeToUndo.setEnd(end, end.childNodes.length);
        var tempRange = this.range;
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(rangeToUndo);
        classApplier.undoToSelection();
        this.range = tempRange;
    }*/

};
mp.MarkApplier.prototype.createClassApplier = function (markValue) {
    var classApplier = rangy.createClassApplier(mp.MarkApplier.MARKED_VALUE_CLASS, {
        elementTagName: "value",
        elementAttributes: {
            "target-item" : markValue
        }
    });
    return classApplier;
};
