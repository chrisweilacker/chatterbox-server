var RoomsView = {

  $button: $('#rooms button'),
  $select: $('#rooms select'),

  initialize: function() {
    RoomsView.$button.on('click', Rooms.add);
    RoomsView.renderRoom('ALL');
    RoomsView.$select.on('change', RoomsView.render);
  },

  render: function() {
    App.room = RoomsView.$select.val();
    App.startSpinner();
    App.fetch(App.stopSpinner);
  },

  renderRoom: function(roomName) {
    RoomsView.$select.append(`<option value="${roomName}">${roomName}</option>`);
  }

};
