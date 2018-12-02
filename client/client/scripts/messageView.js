var MessageView = {

  render: _.template(`
  <div class = "chat">
        <div class="username <%= isFriend %>"><%= username %></div>
        <div class="message"><%= text %></div>
  </div>
      `)

};