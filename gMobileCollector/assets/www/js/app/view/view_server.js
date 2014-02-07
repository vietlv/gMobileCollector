//Khởi tạo biến View cho ServerItem.
gMobile.View.ServerItem;
$(function(){
	//View: gMobile.View.ServerItem 
	gMobile.View.ServerItem  = Backbone.View.extend({
	    template: _.template($('#server_item_template').html()),
	    events: {
	      "click .editServerItem"   		: "openDialogEditServerItem",
	      "click .ui-radio"					: "updateStatusServerItem",
	      "click .deleteServerItem"  		: "deleteServerItem"
	    },
	
	    initialize: function() {
	      this.listenTo(this.model, 'change', this.render);
	      this.listenTo(this.model, 'destroy', this.remove);
	    },
	    
	    render: function() {
	      console.log('render');
	      console.log(this.model.toJSON());
	     // alert(this.template(this.model.toJSON()));
	      this.$el.html(this.template(this.model.toJSON()));
	      return this;
	    },
	    
	    updateStatusServerItem: function(){
	    	var done = this.model.attributes.done;
	    	if(done == true) done = false;
	    	else done = true;
	    	//Gán lại tất cả checkbox false
	    	if(ListServer.models.length > 0)
    		for ( var int = 0; int < ListServer.models.length; int++) {
    			ListServer.models[int].save({done:false});
			}
	    	this.model.save({done: done});
	    	$("#danhSachServer").trigger("create");
	    },
	    
	    toggleDone: function() {
	      this.model.toggle();
	    },
	    
	    deleteServerItem: function (){
	    	if(confirm("Bạn có muốn xóa Server này không")){
	    		this.model.destroy();
	    	}
	    },
	    
	    //OPEN dialog edit
	    openDialogEditServerItem: function(){
	    	//alert('open edit');
	    	var model = this.model;
	    	$("#serverurlEdit").val(model.attributes.serverurl);
	    	$("#servernameEdit").val(model.attributes.servername);
	    	$("#collectionidedit").val(model.attributes.collectionid);
	    	$("#systemidedit").val(model.attributes.systemid);
	    	$("#dataidedit").val(model.attributes.dataid);
	    	$("#fileidedit").val(model.attributes.fileid);
	    	ServerItemEdit = model;
	    	fnShowDialog('dialogEditconfig');
	    },
	    	
	    close: function() {
	      var value = this.input.val();
	      if (!value) {
	        this.clear();
	      } else {
	        this.model.save({servername: value});
	        this.$el.removeClass("editing");
	      }
	    },
	
	    // If you hit `enter`, we're through editing the item.
	    updateOnEnter: function(e) {
	      if (e.keyCode == 13) this.close();
	    },
	
	    // Remove the item, destroy the model.
	    clear: function() {
	      this.model.destroy();
	    }

	});
});