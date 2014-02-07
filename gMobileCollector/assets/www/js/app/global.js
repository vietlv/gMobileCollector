var gMobile = {};
gMobile.Models = gMobile.Models || {};
gMobile.Collections = gMobile.Collections || {};
gMobile.View = gMobile.View || {};

//Model lựa chọn để sửa
var ServerItemEdit;
var CurrentServer;
var itemIdSelect;

var apikey;
var controlTouch = null;
var multiTouchEvent = 0;
var timeoutId;
var waitFor = 1000;
var selectControl = null;
var keyEdit = null;
