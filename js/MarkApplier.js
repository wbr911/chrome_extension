mp={};
(function(MarkApplier){
    MarkApplier=function(){
        /**
         * Created by stms140802 on 2015/3/10.
         */
    }
    MarkApplier.MARKED_HOVER_CSS = "mp-marked-hover";
    MarkApplier.MARK_ATTR_NAME = "target-item";
    MarkApplier.GROUP_ATTR_NAME = "group-by-key";
    MarkApplier.MARKED_VALUE_CLASS = "mp-target-item";

    MarkApplier.prototype.addMarkToRangeElements = function(markValue){
        var classApplier  = createClassApplier(markValue);
        classApplier.applyToSelection();
        var effectedElements = $("value[target-item="+markValue+"]");
        if(effectedElements && effectedElements.size()>1){
            effectedElements.attr(MarkApplier.GROUP_ATTR_NAME , markValue);
        }
    }
    MarkApplier.prototype.undoOnMarkedElement = function(markValue){
        var classApplier  = createClassApplier(markValue);
        var valueList = $("value["+MarkApplier.MARK_ATTR_NAME+" = "+markValue+"]");
        if(valueList.length){
            var start = valueList[0];
            var end = valueList[valueList.length-1];
            var r = new Range();
            r.setStart(start , 0);
            r.setEnd(end , end.childNodes.length);
            classApplier.undoToSelection();
        }

    }
    function createClassApplier(markValue){
        var attrName = MarkApplier.MARK_ATTR_NAME;
        var classApplier = range.createClassApplier(MarkApplier.MARKED_VALUE_CLASS , {
            elementTagName : "value",
            elementAttributes :{
                attrName : markValue
            }
        });
        return classApplier;
    }
})(mp.MarkApplier);
