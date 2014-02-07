gMobile.Models.Map = Backbone.Model.extend({
	defaults: function() {
	      return {
	    	  mabando:"",		//Mã bản đồ
	    	  data:""			//Cấu hình của bản đồ tương ứng
	      };
	  }
})

gMobile.Collections.Maps = Backbone.Collection.extend({
    model: gMobile.Models.Map,
    localStorage: new Backbone.LocalStorage("gServer_Maps"),
    initialize: function(){
    
    },
    
	fetch: function(options) {
            return Backbone.Collection.prototype.fetch.call(this, options);
    },  
    
    removeAll: function(){
    	var me = this;
    	for ( var int = 0; int < me.models.length; int++) {
			var model = me.models[int];
			model.destroy();
		}
    	me.fetch();
    },
    
    addMap: function(_mabando, _data){
    	var me = this;
    	me.create({mabando: _mabando,data: _data});
    },
    
    checkExitsMap: function( _mabando ){
    	var me = this;
    	var model =  me.findWhere({
    		mabando: _mabando
    	});
    	if(model != undefined)
    		return true;
    	else return false;
    },
    
    getMapByMabando: function( _mabando ){
    	var me = this;
    	var model =  me.findWhere({
    		mabando:_mabando
    	});
    	
    	if(model != undefined)
    		return model.attributes;
    	else return null;
    },
    
    deleteMapByKey: function(_mabando){
    	var me = this;
    	var model =  me.findWhere({
    		mabando: _mabando
    	});
    	model.destroy();
    }
    
});

var ListMaps = new gMobile.Collections.Maps; 

