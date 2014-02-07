
$(document).ready(function() {
	document.addEventListener("deviceready", phoneReady, false);
	$("#btnHomeResource").click(function(){
		 var lsCatalog = new ExplorerPageListCatalog;
		 var lsResource = new ExplorerPageListItems;
	});
	
	$("#btnReloadResource").click(function(){
		fnReloadOnlineResource();
	});
	
	$("#search").keypress(function( event ) {
  		if ( event.keyCode == 13 || event.which == 13 ) {
  			var keyword = $("#search").val();
			map.searchGeoName(keyword,20,1);
  			event.preventDefault();
  		}
	});
	
	 $("#gpsPanelButton").click(function(){
		//alert('xem gps');
		 map.startgpsWatch();
	 });
	 
	 $('.mapHeader .ui-input-search a').click(function(){;	
	 	if(map != null && map.layerMarker != undefined){
	 		map.layerMarker.removeAllFeatures();
	 		$("#mapDanhSachKetQua").html('');
	 	}
	 });
	 
});


function phoneReady(){
	
}

function fnActiveView(type){
	if(type == "map"){
		$('.listObjectViewer').hide();
		$('#btnTienIch').show();
		$('.mapViewer').show();
		$("#footerMapPage").hide();
		map.map.updateSize();
		
	}else{
		$('.mapViewer').hide();
		$("#footerMapPage").show();
		$('#btnTienIch').hide();
		$('.listObjectViewer').show();
		map.map.updateSize();
	}
}


$(function(){	
	var setting = new SettingPage;
	var user = new LoginPage;
});


//Đăng ký sự kiện tìm kiếm cho text search
$(document).bind("pageinit", function() {
	 //Đăng ký cho text box tìm kiếm theo địa điểm
	$("#search").keypress(function( event ) {
		
  		if ( event.keyCode == 13 || event.which == 13 ) {
  		
  			var keyword = $("#search").val();
			map.searchGeoName(keyword,20,1);
  			event.preventDefault();
  		}
	});

	$( '#sessionPage' ).on( 'pagebeforeshow',function(event){
		//ListSession.renderListSession();
		var _listSession = new gMobile.Collections.Sessions("Session_"+ map.maBanDo);
		_listSession.fetch();
		_listSession.renderListSession();
	});
	 
});

/*var AppRouter = Backbone.Router.extend({

    routes:{
        "":"home",
        "settingsPage":"settingsPage",
        "loginPage":"loginPage"
    },

    initialize:function () {
        // Handle back button throughout the application
        $('.back').live('click', function(event) {
            window.history.back();
            return false;
        });
        this.firstPage = true;
    },

    home:function () {
        console.log('#home');
        var login = new LoginPage;
        var setting = new SettingPage;
       // this.changePage(new HomeView());
    },

    settingsPage:function () {
        console.log('#settingPage');
        //var setting = new SettingPage;
       //this.changePage(new SettingPage());
    },

    loginPage:function () {
        console.log('#page2');
        //this.changePage(new Page2View());
    },

    changePage:function (page) {
        $(page.el).attr('data-role', 'page');
        page.render();
        $('body').append($(page.el));
        var transition = $.mobile.defaultPageTransition;
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }
        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
    }

});


function startApp() {
  tpl.loadTemplates(['server_item'], function() {
    	 //alert('run callback');
    	 app = new AppRouter();
    	 Backbone.history.start();
    });
}*/
function startApp() {

}