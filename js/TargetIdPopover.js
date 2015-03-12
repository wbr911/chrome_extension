(function(TargetIdPopover){
    TargetIdPopover=function(targetIdRecordList ,markApplier){
        /**
         * Created by stms140802 on 2015/3/10.
         */
        this.targetIdRecordList = targetIdRecordList;
        this.markApplier = markApplier;
        this.initElement();
    }
    TargetIdPopover.prototype.initElement=function(){
        this.popoverContainer = $("<div id='targetIdPopoverContainer' class='floatBlock'>" +
        "<div class='mp-pop-header'><div class='mp-pop-title'>You can adapt below</div><span class='mp-btn mp-close'></span></div>"+
        "</div>");
        this.searchField = $("<div id='mp-pop-searchField'></div>").hide().appendTo(this.popoverContainer);
        this.targetList = $("<div id='mp-pop-targetList'></div>").appendTo(this.popoverContainer);
        this.popoverContainer.hide().appendTo($(document.body));
    }

    TargetIdPopover.prototype.enterDocument =function(){
        var self = this;
        this.popoverContainer.find(".mp-close").bind("click",function(){
            self.popoverContainer.hide();
        });
        this.popoverContainer.bind("blur" , function(){
            self.popoverContainer.hide();
            }
        );
        this.targetList.on("click" , ".mp-pop-targetItem", function(event){
            var item = event.target();
            item.addClass("mp-chosen");
            self.popoverContainer.hide();
            recordRelationOfElement2TargetId(self,item.attr(mp.MarkApplier.MARK_ATTR_NAME));

        });
        this.targetList.on("hover" , ".mp-pop-targetIdItem .mp-chosen", function(event){
            var item = event.target();
            var targetId = item.attr("target-item");
            self.targetIdRecordList.find("div[target-item=targetId]").hover();
        });
    }

    TargetIdPopover.prototype.setData = function(dataArray){
        for( i=0;i < dataArray.length ; i++){
            this.targetList.append(dataArray[i])
        }

    }

    TargetIdPopover.prototype.showPopoverMenu = function(left,top){
        this.popoverContainer.css("left",left);
        this.popoverContainer.css("top",top);
        this.popoverContainer.slideDown(200);
    }

    function createTargetIdItem(data , targetRecordList){
        var item = $("<div class='mp-pop-targetItem'>"+data+"</div>");
        return item;
    }
    function recordRelationOfElement2TargetId(self,targetId){
        if(self.targetIdRecordList.hasTargetIdItem(targetId)){
            self.markApplier.undoOnMarkedElement(targetId);
        }else {
            self.targetIdRecordList.addTargetIdItem(targetId);
        }
        self.markApplier.addMarkToRangeElements(targetId);

    }
})(mp.TargetIdPopover);
