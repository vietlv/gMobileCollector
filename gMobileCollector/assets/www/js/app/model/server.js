
//Model: gMobile.Models.Server 
gMobile.Models.Server = Backbone.Model.extend({
    // Default attributes for the gMobile.Models.Server item.
    defaults: function() {
      return {
		servername:"",
		serverurl:"",
		systemid:"",
		dataid:"",
		fileid:"",
		collectionid:"",
        done: false
      };
    },

    toggle: function() {
      this.save({done: !this.get("done")});
    }
});
 

//Store: gMobile.Collections.Servers
gMobile.Collections.Servers  = Backbone.Collection.extend({
    model: gMobile.Models.Server,
    
    localStorage: new Backbone.LocalStorage("gServer_server"),
    
    done: function() {
      return this.where({done: true});
    },
    
    remaining: function() {
      return this.where({done: false});
    },

    // We keep the  gMobile.Collections.Servers in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    comparator: 'order'
}); 

var ListServer = new gMobile.Collections.Servers ; 