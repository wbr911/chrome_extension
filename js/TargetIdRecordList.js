(function(TargetIdRecordList){
    TargetIdRecordList = function(){
        this.itemList = [];
        this.ElementRoot=null;
        this.initElement();
        this.enterDocument();
        /**
         * Created by stms140802 on 2015/3/10.
         */
    }
    TargetIdRecordList.prototype.initElement = function(){
    };
    TargetIdRecordList.prototype.enterDocument = function(){
        this.ElementRoot.on("mouseenter" ,".mp-list-targetIdItem",function(){
            var attr = this.attr(mp.MarkApplier.MARK_ATTR_NAME);
            $("value["+mp.MarkApplier.MARK_ATTR_NAME+"="+attr+"]").addClass(mp.MarkApplier.MARKED_HOVER_CSS);

        } )
        this.ElementRoot.on("mouseleave" ,".mp-list-targetIdItem",function(){
            var attr = this.attr(mp.MarkApplier.MARK_ATTR_NAME);
            $("value["+mp.MarkApplier.MARK_ATTR_NAME+"="+attr+"]").removeClass(mp.MarkApplier.MARKED_HOVER_CSS);
        } )
    };
    TargetIdRecordList.prototype.addTargetIdItem = function(targetId){
        this.itemList.push(createItem(targetId));
    };
    TargetIdRecordList.prototype.hasTargetIdItem = function(targetId){
        var has = false;
        $.each(this.itemList , function(n , value){
            if(value.attr(mp.MarkApplier.MARK_ATTR_NAME)===targetId){
                has = true;
                return false;
            }
        });
        return has;
    };
    function createItem(targetId){
        var markAttr =mp.MarkApplier.MARK_ATTR_NAME+"="+targetId;
        var item  = $("<div class='mp-list-targetIdItem'"+markAttr+">"+targetId+"</div>");
        return item;
    }
})(mp.TargetIdRecordList);
