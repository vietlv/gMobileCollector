gMobile.View.ResourceItem;
$(function(){
	gMobile.View.ResourceItem = Backbone.View.extend({
		events: {
			"click .item_resource": "selectResource"
		},
		
	    initialize: function() {
	        //this.template = _.template(tpl.get('wine-details'));
	    	this.template = _.template($("#tainguyen_item_template").html());
	    },
	
	    render: function(eventName) {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
	    },
	    
	    selectResource: function(){
	    	showLoader("Đang lấy thông tin bản đồ...");
	    	var attributesModel = this.model.attributes;
	    	var CurrentServer = ListServer.findWhere({done:true}).attributes;
	    	
	    	//Check localstorage
	    	var listMaps = new gMobile.Collections.Maps;
	    	listMaps.fetch();
	    	var mapstorage = listMaps.getMapByMabando(attributesModel.Link);
	    	if(mapstorage != null){
	    		//alert('Get map local');
	    		fnLoadMap(mapstorage.data);
	    	}
	    	else{
		    	var url = CurrentServer.serverurl
				+ "/gservices/rest/vectormaps/"+CurrentServer.systemid+"/map/"
				+ attributesModel.Link;
		    	//alert('Get map online');
		    	$.ajax({
					type : 'GET',
					url : url,
					async : false,
					contentType : "application/json; charset=utf-8",
					dataType : 'jsonp',
					success : function(data) {
						fnLoadMap(data);
						listMaps.addMap(attributesModel.Link, data);
					},
					error:function(){
					},
					complete:function(){
						
					}
				});
	    	}
	    }
	
	});
});