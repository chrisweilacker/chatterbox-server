var Friends = {
  toggleStatus: function () {
    Friends.friendlist.push($(this).text());
    App.fetch();
  },
  friendlist: []

};