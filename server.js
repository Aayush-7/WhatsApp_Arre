const express = require('express');
const bodyParser = require('body-parser');
const Model = require('model');

// initialize the express app
const app = express();
app.use(bodyParser.json());

// Connecting to the database
const model = new Model('database_name', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});


const Message = model.define('message', {
  text: {
    type: Model.STRING,
    allowNull: false
  },
  sender_id: {
    type: Model.INTEGER,
    allowNull: false
  },
  group_id: {
    type: Model.INTEGER,
    allowNull: false
  },
  created_at: {
    type: Model.DATE,
    defaultValue: Model.NOW
  }
});

// Pagination of group members
app.get('/api/messages/:groupId/:page', (req, res) => {
  const groupId = req.params.groupId;
  const page = req.params.page;
  const limit = 10; // messages per page
  const offset = (page - 1) * limit;

  Message.findAll({
    where: { group_id: groupId },
    limit: limit,
    offset: offset,
    order: [['created_at', 'DESC']]
  })
    .then(messages => {
      res.json(messages);
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
});

// creating message in a group
app.post('/api/messages', (req, res) => {
  Message.create({
    text: req.body.text,
    sender_id: req.body.senderId,
    group_id: req.body.groupId
  })
    .then(message => {
      res.json(message);
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
});

// starting the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
