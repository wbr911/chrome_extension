/**
 * Created by stms140802 on 2015/3/25.
 */
var mp = mp || {};
mp.service = mp.service || {};
mp.service.ConfigurationService = function () {
    this.currentServce = "";
    this.serviceList = [];
    this.itemList = [];
    this.offLine = true;
    this.defaultDefinitionName = "";
    this.initElement();
    this.enterDocument();
    this.hasErrorStatus = true;
};
mp.service.ConfigurationService.notificationId = "mp-configurationService-notification";
mp.service.ConfigurationService.prototype.initElement = function () {
    var self = this;
    self.fetchAllServiceNameFromServer(function () {
        if (self.serviceList.length > 0) {
           /* chrome.storage.sync.get('service', function (values) {
                if(!values){
                    return;
                }
                if (values.service.value) {
                    self.currentServce =values.service.value;
                    if(values.service.itemList && values.service.itemList.length>0) {
                        self.itemList = values.service.itemList;
                    }else{
                        self.setService(values.service.value);
                    }
                } else {
                    self.setService(self.serviceList[0]);
                }
            });*/
            self.setService(self.serviceList[0]);
        }
    });
};
mp.service.ConfigurationService.prototype.enterDocument = function () {
    var self = this;
    var tempSavedFunction={};
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
            "from the extension");
        console.log(request);
        switch (request.command) {
            case mp.service.Constants.COMMAND_ALL_SERVICE_NAME:
                sendResponse({"data": self.getAllServiceName()});
                break;
            case mp.service.Constants.COMMAND_ITEM_LIST:
                sendResponse({"data": self.getItemListUnderCurrentService()});
                break;
            case mp.service.Constants.COMMAND_DEFINITION_NAME:
               /* tempSavedFunction = sendResponse;
                self.getDefinitionName(function (data) {
                    tempSavedFunction({"data": data});
                    console.log(data);
                });*/
                sendResponse({"data":self.defaultDefinitionName});
                break;
        }
    });
    chrome.notifications.onButtonClicked.addListener(function (id) {
        chrome.tabs.create({url: mp.service.Constants.LOGIN_URL});
        console.log(id + "  is clicked");
    });
    chrome.tabs.onActivated.addListener(function(tab){
        chrome.tabs.get(tab.tabId,function(activeTab){
            var quotationIndex =  activeTab.url.indexOf("?");
            var url =quotationIndex==-1? activeTab.url:activeTab.url.substring(0,quotationIndex);
            self.defaultDefinitionName = url.replace(/(http|https):\/\//,"");
        });
    });

};
mp.service.ConfigurationService.prototype.getAllServiceName = function () {
    if (this.serviceList.length === 0) {
        this.fetchAllServiceNameFromServer(function () {
        }, false);
        if (this.currentServce === "" && this.serviceList.length > 0) {
            this.currentServce = this.serviceList[0];
        }
    }
    return this.serviceList;
};
mp.service.ConfigurationService.prototype.setService = function (serviceName, callback) {
    if (serviceName !== this.currentServce) {
        this.currentServce = serviceName;
        this.fetchItemListByServiceName(serviceName, callback, true);
    }else{
        callback.call(this , "success");
    }
};
mp.service.ConfigurationService.prototype.getItemListUnderCurrentService = function () {
    return this.itemList;
};
mp.service.ConfigurationService.prototype.syncDataWithServer = function (serviceName) {
};
/**
 * private
 */
mp.service.ConfigurationService.prototype.fetchAllServiceNameFromServer = function (callback, async) {
    if (async === undefined) {
        async = true;
    }
    var self = this;
    $.ajax({
        type: "get",
        url: mp.service.Constants.BASE_URL + "/all_services",
        dataType: "json",
        async: async,
        success: function (data) {
            if (self.hasErrorStatus) {
                self.hasErrorStatus = false;
            }
            self.serviceList = data;
            if (callback) {
                callback.call(self, data);
            }
        },
        error: function () {
            self.hasErrorStatus = true;
            self.notifyNetworkError(arguments, "failed to get all the service name" + " , connection is refused");
        }

    });
};
/**
 *
 * @param {string} serviceName
 * @param {function(Array)} callback
 * @param {boolean} async
 */
mp.service.ConfigurationService.prototype.fetchItemListByServiceName = function (serviceName, callback, async) {
    this.saveStatus();
    var self = this;
    if (async === undefined) {
        async = true;
    }
    $.ajax({
        type: "get",
        url: mp.service.Constants.BASE_URL + "/itemList",
        data: "service=" + serviceName,
        dataType: "json",
        async: async,
        success: function (data) {
            if (self.hasErrorStatus) {
                self.hasErrorStatus = false;
            }
            self.itemList = data;
            if (callback) {
                callback.call(window, "success");
            }
        },
        error: function (data) {
            self.hasErrorStatus = true;
            self.notifyNetworkError(arguments, "failed to get item list with service name :" + serviceName + " , connection is refused");
            if (callback) {
                callback.call(window, "error");
            }
            console.log("fetch itemList by service name error");
        }
    });
};
mp.service.ConfigurationService.prototype.notifyNetworkError = function (ajaxArgument, msg) {
    var request = ajaxArgument[0];
    var option = {};
    if (request.responseText && request.responseText.indexOf("<!DOCTYPE html>") === 0) {
        msg = " you need log in hue first  ";
        option = {
            type: "basic",
            iconUrl: "images/icon-login.png",
            title: ajaxArgument[1],
            message: msg,
            buttons: [{title: "click here to login", iconUrl: "images/icon-login.png"}]
        };
    } else {
        option = {
            type: "basic",
            iconUrl: "images/icon-error.png",
            title: ajaxArgument[1],
            message: msg
        };
    }
    /* chrome.tabs.query({'active': true} , function(tabs){
     if(!tabs[0].url ||tabs[0].url.indexOf("chrome")===0){
     return;
     }
     chrome.tabs.executeScript(tabs[0].id , {code:"alert('"+msg+"')"});
     });*/
    var notification = chrome.notifications.create("", option, function (id) {
        console.log("new notification's id is" + id)
    });


};
mp.service.ConfigurationService.prototype.saveStatus = function () {
    chrome.storage.sync.set({'service': {value: this.currentServce , itemList:this.itemList}}, function () {
    });
};
/**
 *
 * @param {function(name)}callback
 */
mp.service.ConfigurationService.prototype.getDefinitionName = function (callback) {
    chrome.tabs.query({active: true}, function(tabs) {
        var quotationIndex =  tabs[0].url.indexOf("?");
        var url =quotationIndex==-1? tabs[0].url:tabs[0].url.substring(0,quotationIndex);
        url = url.replace(/(http|https):\/\//,"");
        console.log(url);
        callback.call(this, url);
    });
};
mp.service.configureService = new mp.service.ConfigurationService();

