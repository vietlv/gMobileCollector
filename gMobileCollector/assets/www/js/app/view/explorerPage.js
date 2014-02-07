
var ExplorerPageListCatalog;
$(function(){	
	ExplorerPageListCatalog = Backbone.View.extend({
	//Bắt sự kiện trong trang settingPage
    el: $("#explorerPage"),

    //Đăng ký các sự kiện trên trang settingPage
    events: {
      //"click #toggle-all": "toggleAllComplete"
    	
    },

    initialize: function() {
      $("#listexplorerContent").html("");
      this.listenTo(ListCatalog, 'add', this.addOne);
      this.listenTo(ListCatalog, 'reset', this.addAll);
      this.listenTo(ListCatalog, 'all', this.render);

      var setHeader = function (xhr) {
		  xhr.setRequestHeader("gAuthenticationKey", apikey);
	  }
      
      showLoader("Vui lòng chờ...");
      var url_catalog = CurrentServer.serverurl+ "/gservices/rest/dserver/"+CurrentServer.systemid+"/spaces?parentid="+CurrentServer.collectionid;
     
      fnLoadDanhSachCatalog(CurrentServer.collectionid);
     
    /*ListCatalog.url = url_catalog;
      ListCatalog.fetch({ 
    	 beforeSend: setHeader,
    	 success: function(){
    		 hideLoader();
    		 $("#listexplorerContent").html("");
    		 for ( var int = 0; int < ListCatalog.models.length; int++) {
    			 var view = new gMobile.View.CatalogItem({model: ListCatalog.models[int]});
			     $("#listexplorerContent").append(view.render().el);
			}
    		//alert(ListCatalog.models.length);
    	 }
      });*/
        
    },
        
    render: function() {
    
    },
   
    addOne: function(catalog) {
    	//var view = new gMobile.View.CatalogItem({model: catalog});
    	//$("#listexplorerContent").append(view.render().el);	 
    },

    //Add all items
    addAll: function() {
    	//ListCatalog.each(this.addOne, this);
    }
    
  });

});


function fnLoadDanhSachCatalog(idcollection, reload){
	itemIdSelect = idcollection;
	$("#listexplorerContent").html("");
	var _listCatalog = new gMobile.Collections.Catalogs(idcollection);
	var url_catalog = CurrentServer.serverurl+ "/gservices/rest/dserver/"+CurrentServer.systemid+"/spaces?parentid="+idcollection;
    _listCatalog.fetch();
    if(reload == true){
    	//_listCatalog.removeAll();	//Xóa cache
    	var length = _listCatalog.models.length;
    	for(int = 0; int <length; int++ ){
    		_listCatalog.models[0].destroy();
    	}
    	_listCatalog.fetch();
    }
    if(_listCatalog.models.length == 0){
    	  var setHeader = function (xhr) {
	  		  xhr.setRequestHeader("gAuthenticationKey", apikey);
	  	  }
	      $.ajax({
	          type: 'GET',
	          url: url_catalog,
	          beforeSend : setHeader,
	          async: false,        
	          contentType: "application/json; charset=utf-8",
	          dataType: 'json',
	          success: function (data) {
	        	  hideLoader();
	        	  var _data = data.data;
	        	  if(_data.length > 0){
	        		  for ( var int = 0; int < _data.length; int++) {
	        			  _listCatalog.create({
	        				  Title: 	_data[int].Title,
	        				  ItemID: 	_data[int].ItemID
	        			  });
	        		  }
	        	  }
	        	  _listCatalog.fetch();
	        	  for ( var int = 0; int < _listCatalog.models.length; int++) {
	     			 var view = new gMobile.View.CatalogItem({model: _listCatalog.models[int]});
	 			     $("#listexplorerContent").append(view.render().el);
	        	  }
	          },
	          error: function (jqXHR, textStatus, errorThrown) {
	        	  hideLoader();
	          },
	          complete: function () {
	          }
	      });
    }else{
  	  for ( var int = 0; int < _listCatalog.models.length; int++) {
			var view = new gMobile.View.CatalogItem({model: _listCatalog.models[int]});
			$("#listexplorerContent").append(view.render().el);
   	  }
  	hideLoader();
    }
}

function fnLoadDanhSachItem(idcollection, reload){
	itemIdSelect = idcollection;
	$("#listexplorerItems").html("");
	var _listItem = new gMobile.Collections.Items("ac"+idcollection);
	_listItem.fetch();
	if(reload == true){
		//Xóa cache
		var length = _listItem.models.length;
    	for(int = 0; int <length; int++ ){
    		_listItem.models[0].destroy();
    	}
		_listItem.fetch();
	}
	 var setHeader = function (xhr) {
		  xhr.setRequestHeader("gAuthenticationKey", apikey);
	 }
     CurrentServer = ListServer.findWhere({done:true}).attributes;
     var url_item = CurrentServer.serverurl+ "/gservices/rest/dserver/"+CurrentServer.systemid+"/aggregation/"+idcollection +"/items?all=1&page=1&start=0&limit=100";
     
     if(_listItem.models.length == 0){
   	  	  var setHeader = function (xhr) {
	  		  xhr.setRequestHeader("gAuthenticationKey", apikey);
	  	  }
	      $.ajax({
	          type: 'GET',
	          url: url_item,
	          beforeSend : setHeader,
	          async: false,        
	          contentType: "application/json; charset=utf-8",
	          dataType: 'json',
	          success: function (data) {
	        	  hideLoader();
	        	  var _data = data.data;
	        	  if(_data.length > 0){
	        		  for ( var int = 0; int < _data.length; int++) {
	        			  _listItem.addObject(_data[int]);
	        		  }
	        	  }
	        	  _listItem.fetch();
	        	  for ( var int = 0; int < _listItem.models.length; int++) {
	 			     	var view = new gMobile.View.ResourceItem({model: _listItem.models[int]});
	 			     	$("#listexplorerItems").append(view.render().el);	
	        	  }
	          },
	          error: function (jqXHR, textStatus, errorThrown) {
	              //callback([], options)
	        	  //alert(textStatus);
	        	  hideLoader();
	          },
	          complete: function () {
	          }
	      });
   }else{
	   for ( var int = 0; int < _listItem.models.length; int++) {
	     	var view = new gMobile.View.ResourceItem({model: _listItem.models[int]});
	     	$("#listexplorerItems").append(view.render().el);	
	  }
	   hideLoader();
   }
}

function fnReloadOnlineResource(){
	fnLoadDanhSachCatalog(itemIdSelect,true);
	fnLoadDanhSachItem(itemIdSelect,true);
}

var ExplorerPageListItems;
$(function(){	
	ExplorerPageListItems = Backbone.View.extend({
	//Bắt sự kiện trong trang settingPage
    el: $("#explorerPage"),

    //Đăng ký các sự kiện trên trang settingPage
    events: {
      //"click #toggle-all": "toggleAllComplete"
    	"click .item_resource": "selectResource"
    },

    initialize: function() {
      this.listenTo(ListItem, 'add', this.addOne);
      this.listenTo(ListItem, 'reset', this.addAll);
      this.listenTo(ListItem, 'all', this.render);

      var setHeader = function (xhr) {
		  xhr.setRequestHeader("gAuthenticationKey", apikey);
	  }
      showLoader("Vui lòng chờ...");
      CurrentServer = ListServer.findWhere({done:true}).attributes;
      fnLoadDanhSachItem(CurrentServer.collectionid);
      /*
      var url_item = CurrentServer.serverurl+ "/gservices/rest/dserver/"+CurrentServer.systemid+"/aggregation/"+CurrentServer.collectionid +"/items?all=1&page=1&start=0&limit=100";
      ListItem.url = url_item;
      ListItem.fetch({ 
    	 beforeSend: setHeader,
    	 success: function(){
    		 hideLoader();
    		 //Custom lại success    		
    		 $("#listexplorerItems").html("");
    		 for ( var int = 0; int < ListItem.models.length; int++) {
			     var view = new gMobile.View.ResourceItem({model: ListItem.models[int]});
			     $("#listexplorerItems").append(view.render().el);	
			}
    	 }
      });
      */
      
      
        
    },
    
    
    render: function() {
    
    },
   
    addOne: function(item) {
    	//var view = new gMobile.View.ResourceItem({model: item});
	    // $("#listexplorerItems").append(view.render().el);	 
    },

    //Add all items
    addAll: function() {
    	ListItem.each(this.addOne, this);
    },
    
    selectResource: function(){
    	//Link tới bản đồ
    }
    
  });

});

