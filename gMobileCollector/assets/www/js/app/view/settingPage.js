$.support.cors = true;

$(document).bind("mobileinit", function () {
    $.mobile.loadingMessage = "&nbsp;";
    $.mobile.selectmenu.prototype.options.nativeMenu = true;
    $.mobile.pushStateEnabled = false; 
    //$.mobile.page.prototype.options.backBtnTheme = "a";
    //$.mobile.page.prototype.options.backBtnText = _("Back");
    $.mobile.page.prototype.options.backBtnText = "Trở lại";

});

var SettingPage;
$(function(){	
 SettingPage = Backbone.View.extend({
	//Bắt sự kiện trong trang settingPage
    el: $("#settingsPage"),

    //Đăng ký các sự kiện trên trang settingPage
    events: {
      //"keypress #new-todo":  "createOnEnter",
      "keypress #serverurl":  "onkeypressEnter",
      "click .refreshServerEdit": "refreshServerEdit",
      "click .btnSaveServerItem": "saveServerItem",
      //"click #btnAddConfig": "clearCompleted",
      "click #btnAddConfig": "createServerItem",
      "click #btnLoadConfig": "fnLoadConfigFromServer"
      //"click #toggle-all": "toggleAllComplete"
    },

    initialize: function() {
      this.listenTo(ListServer, 'add', this.addOne);
      this.listenTo(ListServer, 'reset', this.addAll);
      this.listenTo(ListServer, 'all', this.render);
      ListServer.fetch();
    },
    
    onkeypressEnter: function(){
    	if (e.keyCode == 13){
    		fnLoadConfigFromServer(e);
    	}
    },
    
    fnLoadConfigFromServer: function(e){
		 	showLoader();
	    	var url = $("#serverurl").val();
	    	url += "/gservices/rest/utilities/gsv11_system/mobileconfig";
	    	$.ajax({
	    		type : 'GET',
	    		url : url,
	    		contentType : "application/json; charset=utf-8",
	    		dataType : 'json',
	    		success : function(data) {
	    			hideLoader();
	    			$("#servername").val(data.servername);
	    			$("#collectionid").val(data.collectionid);
	    			$("#systemid").val(data.systemid);
	    			$("#dataid").val(data.dataid);
	    			//$("#drsid").val(data.systemid);
	    			$("#fileid").val(data.fileid);
	    		},
	    		error:function(){
	    			hideLoader();	
	    		},
	    		complete:function(){
	    			hideLoader();	
	    		}
	    	}); 
    },
    
    refreshServerEdit: function(){
    	showLoader();
    	var url = $("#serverurlEdit").val();
    	url += "/gservices/rest/utilities/gsv11_system/mobileconfig";
    	$.ajax({
    		type : 'GET',
    		url : url,
    		contentType : "application/json; charset=utf-8",
    		dataType : 'json',
    		success : function(data) {
    			hideLoader();
    			$("#servernameEdit").val(data.servername);
    			$("#collectionidedit").val(data.collectionid);
    			$("#systemidedit").val(data.systemid);
    			$("#dataidedit").val(data.dataid);
    			$("#fileidedit").val(data.fileid);
    			//$("#drsid").val(data.systemid);
    		},
    		error:function(){
    			hideLoader();	
    		},
    		complete:function(){
    			hideLoader();	
    		}
    	}); 
    },
    
    saveServerItem: function(){
    	//alert('save item');
    	ServerItemEdit.save({
    		servername: $("#servernameEdit").val(),
    		serverurl:$("#serverurlEdit").val(),
			systemid: $("#systemidedit").val(),
			dataid: $("#dataidedit").val(),
			fileid: $("#fileidedit").val(),
			collectionid: $("#collectionidedit").val()
		});
        //alert('edit success');
        $("#dialogEditconfig").popup("close");
        $("#danhSachServer").trigger("create");
    },
    
    render: function() {
      var done = ListServer.done().length;
      var remaining = ListServer.remaining().length;

      if (ListServer.length) {
        //this.main.show();

       
      } else {
       // this.main.hide();
       // this.footer.hide();
      }
    },
   
    addOne: function(serverItem) {
    	console.log("model");
    	//alert(serverItem.attributes.servername);
        var view = new gMobile.View.ServerItem ({model: serverItem});
        this.$("#danhSachServer").append(view.render().el);
        $("#danhSachServer").trigger("create");
    },

    //Add all items
    addAll: function() {
      ListServer.each(this.addOne, this);
    },
    
    createServerItem:function(e){
    	var url = $("#serverurl").val();
    	var found = ListServer.findWhere({'serverurl': url})
    
    	if(found != undefined) {
    		alert('Server đã tồn tại');
    		return;
    	}
    	if(url == ""){
    		alert('Đường dẫn server không được bỏ trống');
    		return;
    	}
    	ListServer.create({
    		servername: $("#servername").val(),
    		serverurl:$("#serverurl").val(),
    		status: 0,
    		systemid: $("#systemid").val(),
    		dataid: $("#dataid").val(),
    		fileid: $("#fileid").val(),
    		collectionid: $("#collectionid").val(),
            done: false
    	});
    	$("#danhSachServer").trigger("create");
    	$("#dialogAddconfig").popup("close");
    },

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.invoke(ListServer.done(), 'destroy');
      return false;
    },

    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      ListServer.each(function (serveritem) { serveritem.save({'done': done}); });
    }

  });

});

function fnUpdateStatusServer(url){
	var model = ListServer.findWhere({'serverurl': url})
	var done = model.attributes.done;
	if(done == true) done = false;
	else done = true;
	//Gán lại tất cả checkbox false
	if(ListServer.models.length > 0)
	for ( var int = 0; int < ListServer.models.length; int++) {
		ListServer.models[int].save({done:false});
	}
	model.save({done: done});
	$("#danhSachServer").trigger("create");
}