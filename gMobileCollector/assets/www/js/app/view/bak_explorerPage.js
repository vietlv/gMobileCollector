
var ExplorerPageListCatalog;
$(function(){	
	ExplorerPageListCatalog = Backbone.View.extend({
	//Báº¯t sá»± kiá»‡n trong trang settingPage
    el: $("#explorerPage"),

    //Ä�Äƒng kĂ½ cĂ¡c sá»± kiá»‡n trĂªn trang settingPage
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
      
      showLoader("Vui lĂ²ng chá»�...");
      var url_catalog = CurrentServer.serverurl+ "/gservices/rest/dserver/"+CurrentServer.systemid+"/spaces?parentid="+CurrentServer.collectionid;
     

     
      ListCatalog.url = url_catalog;
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
      });
        
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


var ExplorerPageListItems;
$(function(){	
	ExplorerPageListItems = Backbone.View.extend({
	//Báº¯t sá»± kiá»‡n trong trang settingPage
    el: $("#explorerPage"),

    //Ä�Äƒng kĂ½ cĂ¡c sá»± kiá»‡n trĂªn trang settingPage
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
      showLoader("Vui lĂ²ng chá»�...");
      CurrentServer = ListServer.findWhere({done:true}).attributes;
      var url_item = CurrentServer.serverurl+ "/gservices/rest/dserver/"+CurrentServer.systemid+"/aggregation/"+CurrentServer.collectionid +"/items?all=1&page=1&start=0&limit=100";
      ListItem.url = url_item;
      //fnLoadDanhSachItem(CurrentServer.collectionid);
      
      ListItem.fetch({ 
    	 beforeSend: setHeader,
    	 success: function(){
    		 hideLoader();
    		 //Custom láº¡i success    		
    		 $("#listexplorerItems").html("");
    		 for ( var int = 0; int < ListItem.models.length; int++) {
			     var view = new gMobile.View.ResourceItem({model: ListItem.models[int]});
			     $("#listexplorerItems").append(view.render().el);	
			}
    	 }
      });
      
      
        
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
    	//Link tá»›i báº£n Ä‘á»“
    }
    
  });

});

