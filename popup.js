function myfunc(){
    var x = $('#options option:selected').text();
    chrome.extension.sendMessage({sel_text: x});
}

$(document).ready(function(){
    $('#options').change(myfunc);
});