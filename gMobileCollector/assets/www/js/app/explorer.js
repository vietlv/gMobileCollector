var explorerPage;
$(function(){	
	explorerPage = Backbone.View.extend({
    el: $("#settingsPage"),
    
    events: {
    
    },

    initialize: function() {
      this.listenTo(ListServer, 'add', this.addOne);
      this.listenTo(ListServer, 'reset', this.addAll);
      this.listenTo(ListServer, 'all', this.render);
      ListCatalog.fetch();
    },
    
   
    render: function() {
      var done = ListCatalog.done().length;
      var remaining = ListCatalog.remaining().length;
    },
   
    addOne: function(serverItem) {
        var view = new gMobile.View.ServerItem ({model: serverItem});
        this.$("#listexplorerContent").append(view.render().el);
        $("#listexplorerContent").trigger("create");
    },

    
    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.invoke(ListServer.done(), 'destroy');
      return false;
    },

    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      ListCatalog.each(function (serveritem) { serveritem.save({'done': done}); });
    }

  });

});

