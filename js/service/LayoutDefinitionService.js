var mp = mp||{};
mp.service = mp.service||{};
mp.service.LayoutDefinitionService = function(){
    /**
     * Created by stms140802 on 2015/3/20.
     */
};
mp.service.LayoutDefinitionService.SAVE_DEFINITION_SUCCESS="save_success";
mp.service.LayoutDefinitionService.SAVE_DEFINITION_FAILURE="save_failure";

/**
 *
 * @param {mp.dto.LayoutDefinitionDto} layoutDef
 * @param {Function} callback
 */
mp.service.LayoutDefinitionService.prototype.upload = function(layoutDef , callback){
    var url = mp.service.Constants.BASE_URL+"/save";
    $.ajax({
        type:'post',
        url:url,
        data:layoutDef,
        success:function(res){
            if(res==mp.service.LayoutDefinitionService.SAVE_DEFINITION_SUCCESS){
                console.log("success");
                callback.call(this,mp.service.LayoutDefinitionService.SAVE_DEFINITION_SUCCESS);
            }else{
                if(res.indexOf("<!DOCTYPE html>")===0){
                    callback.call(this,"you need to log in hue first or the session is out of time")
                }
                console.log("failure");
            }
        },
        error:function(){
            callback.call(window,arguments[1]+"</br>"+ "connection is refused");
            console.log("error");
        }
    });
};
