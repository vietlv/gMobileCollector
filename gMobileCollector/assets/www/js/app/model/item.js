gMobile.Models.Item = Backbone.Model.extend({
	defaults: function() {
	      return {
	    	  Title:"",
	    	  Link:"",
	    	  ItemID:""
	      };
	  }
})

gMobile.Collections.Items = Backbone.Collection.extend({
    model: gMobile.Models.Item,
	//url:'http://cloudgis.vn/gservices/rest/dserver/gsv11_system/aggregation/0567A77B-DCB8-42F3-9453-A15CFC80185C/items?all=1&page=1&start=0&limit=8',
    url:'',
    
    initialize: function(collectionID){
    	if(collectionID != undefined){
    		this.localStorage = new Backbone.LocalStorage("gServer_Items_"+ collectionID);
    	}
    },
        
    addObject: function(data){
    	var me = this;
    	me.create({Title: data.Title ,Link: data.Link ,ItemID: data.ItemID});
	},
	
	/*
    parse: function(resp){
		  return resp.data;
	},
	*/
	
	removeAll: function(){
    	var me = this;
    	var lenth = me.models.length;
    	for ( var int = 0; int < length; int++) {
			var model = me.models[0];			//Xóa các index đầu tiền sau mỗi lần refresh
			model.destroy();
		}
    	me.fetch();
},
	  
	fetch: function(options) {
            return Backbone.Collection.prototype.fetch.call(this, options);
    }
});

var ListItem = new gMobile.Collections.Items; 