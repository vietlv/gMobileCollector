gMobile.View.CatalogItem;
$(function(){
	gMobile.View.CatalogItem = Backbone.View.extend({
		
		events: {
			"click .item_catalog": "selectCatalog"
		},

	    initialize: function() {
	        this.template = _.template($('#catalog_item_template').html());
	        this.listenTo(this.model, 'change', this.render);
	  	    this.listenTo(this.model, 'destroy', this.remove);
	    },
	
	    render: function(eventName) {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
	    },
	    selectCatalog: function(){
	    	showLoader("Vui lòng chờ...");
	    	var collectionid = this.model.attributes.ItemID;
	    	fnLoadDanhSachCatalog(collectionid);
	    	fnLoadDanhSachItem(collectionid);
	    	
	        /*var url_item = CurrentServer.serverurl+ "/gservices/rest/dserver/"+CurrentServer.systemid+"/aggregation/"+collectionid +"/items?all=1&page=1&start=0&limit=100";
	        ListItem.url = url_item;
	        var setHeader = function (xhr) {
				  xhr.setRequestHeader("gAuthenticationKey", apikey);
			}
	        ListItem.fetch({ 
	        	beforeSend: setHeader,
	        	success: function(){
		      		hideLoader();
	        		$("#listexplorerItems").html("");
		      		 for ( var int = 0; int < ListItem.models.length; int++) {
		  			     var view = new gMobile.View.ResourceItem({model: ListItem.models[int]});
		  			     $("#listexplorerItems").append(view.render().el);	
		  			}
		      	 }
	        });
	        
	        var url_catalog = CurrentServer.serverurl+ "/gservices/rest/dserver/"+CurrentServer.systemid+"/spaces?parentid="+collectionid;
	        ListCatalog.url = url_catalog;
	        ListCatalog.fetch({ 
	        	beforeSend: setHeader,
	        	success: function(){
		      		 $("#listexplorerContent").html("");
		      		 for ( var int = 0; int < ListCatalog.models.length; int++) {
		      			 var view = new gMobile.View.CatalogItem({model: ListCatalog.models[int]});
		  			     $("#listexplorerContent").append(view.render().el);
		  			}
	        	}
	        });*/
	    }
	
	});
});

gMobile.View.ListCatalogItem;
$(function(){
	gMobile.View.ListCatalogItem = Backbone.View.extend({
		
	    initialize: function() {
	       // this.template = _.template(tpl.get('wine-details'));
	    },
	
	    render: function(eventName) {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
	    }
	
	});
});
