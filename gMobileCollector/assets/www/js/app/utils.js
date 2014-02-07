tpl = {

    // Map of preloaded templates for the app
    templates: {},

    loadTemplates: function(names, callback) {

        var that = this;

        var loadTemplate = function(index) {
            var name = names[index];
            console.log('Loading template: ' + name);
            $.get('js/tpl/' + name + '.html', function(data) {
                that.templates[name] = data;
                //alert(data);
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                	
                    callback();
                }
            }, 'text');
        }

        loadTemplate(0);
    },

    // Get template by name from map of preloaded templates
    get: function(name) {
        return this.templates[name];
    }

};



function getQuerystring(key, default_) {
	if (default_ == null)
		default_ = "";
	key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
	var qs = regex.exec(window.location.href);
	if (qs == null)
		return default_;
	else
		return qs[1];
}

function getQuerystringLink(key, link, default_) {
	if (default_ == null)
		default_ = "";
	key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
	var qs = regex.exec(link);
	if (qs == null)
		return default_;
	else
		return qs[1];
}


function fn_change_Page(page){
	//$.mobile.changePage("#"+page,{transition : "slide"});
	$.mobile.changePage("#"+page);
}

function fomatDateJson(date) {
	if(date == "")
		return "";
	date = date.replace('/Date(', '');
	date = date.replace(')/', '');
	var expDate = new Date(parseInt(date));
	var day = expDate.getDate();
	var month = expDate.getMonth() + 1;
	var year = expDate.getFullYear();
	return day + '/' + month + '/' + year;
}

function convertMetertoDegree (length) {
    var geomUnits = "m";
    var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT["dd"];
    if (inPerDisplayUnit) {
        var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
        length *= (inPerMapUnit / inPerDisplayUnit);
    }
    return length;
}

function hideLoader() {
	$.mobile.loading("hide");
}

function showLoader(text,html) {
	//$.mobile.loading("show");
	$.mobile.loading( 'show', {
		text: text,
		textVisible: true,
		theme: 'gm',
		textonly:false
		//html: html
	});
}

//Convert độ sang độ phút giây
function fnConvertLonLatToDec(value){
	value = value*1000000;
	return  ((Math.floor(value / 1000000)) + '° ' + Math.floor(  ((value/1000000) - Math.floor(value/1000000)) * 60)  + '\' ' +  parseInt( Math.floor(((((value/1000000) - Math.floor(value/1000000)) * 60) - Math.floor(((value/1000000) - Math.floor(value/1000000)) * 60)) * 100000) *60/100000 ) + '"'  );  
}

//Mapsize auf vollen Contentbereich skalieren.
function setmapsize(){
	window.scrollTo(0,0);
	var winhigh = $.mobile.getScreenHeight();
	//var winhigh = $('body').height();//Get available screen height, not including any browser chrome
	var headhigh = $('[data-role="header"]').first().outerHeight(); //Get height of first page's header
	var foothigh = $('[data-role="footer"]').first().outerHeight(); //Get height of first page's header
	var $content=$('[data-role="content"]');
	var contentpaddingheight=parseInt($content.css("padding-top").replace("px", ""))+parseInt($('[data-role="content"]').css("padding-bottom").replace("px", ""));
	//winhigh = winhigh - headhigh - foothigh - contentpaddingheight; 
	//$("#map").css('height',(winhigh - 10) + 'px'); //Change div to maximum visible area
	$("#mapView").css('height',winhigh + 'px');
	$("#map").css('height',winhigh + 'px'); //Change div to maximum visible area
	$(".listObjectViewer").css('height',(winhigh - 110) + 'px'); //110 bằng tổng header vs footer
	$("#panelLeftContent").css('height',(winhigh-2) + 'px');
	$("#contentDSKetQuaGeoName").css('height',(winhigh-50) + 'px');
	
}

function getCurrentServer(){
	CurrentServer = ListServer.findWhere({done:true}).attributes;
	return CurrentServer;
}

function fnCheckShowHide(div){
	if($('#' + div).css('display') == "none") return false;
	else return true;
}

/**
 * fnShowDialog Hiển thị dialog
 */
function fnShowDialog(div) {
	//$("#" + div).removeClass("ui-btn-active");
	$("#" + div).popup("open", {
		positionTo : "window",
		transition : "slideup",
		tolerance : "5, 5"
	});
	//$("#dialogAddconfig").popup("open");
}

/**
 * getObjectInArray
 * */
function getObjectInArray(array, key){
	var result = null;
	for ( var int = 0; int < array.length; int++) {
		if(array[int].key == key){
			result = array[int];
			break;
		}
	}
	return result;
}


function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'UNKNOWN';
    states[Connection.ETHERNET] = 'ETHERNET';
    states[Connection.WIFI]     = 'WIFI';
    states[Connection.CELL_2G]  = 'CELL_2G';
    states[Connection.CELL_3G]  = 'CELL_3G';
    states[Connection.CELL_4G]  = 'CELL_4G';
    states[Connection.CELL]     = 'CELL';
    states[Connection.NONE]     = 'NONE';

    //Không có kết nối hoặc không xác định
    if(states[networkState] == 'NONE' || states[networkState] == 'UNKNOWN')
    	return false;
    else return true;
}

