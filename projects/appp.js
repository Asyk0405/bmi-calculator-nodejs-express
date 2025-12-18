const express = require('express');
const app = express();
const port = 3001; // другой порт, чтобы не конфликтовать с первым примером

app.use(express.urlencoded({ extended: true }));

// хранилище задач в памяти
let todos = [];

// главная страница со списком и формой
app.get('/', (req, res) => {
  const listItems = todos
    .map((item, index) => {
      return `
        <li>
          ${item}
          <form action="/delete" method="POST" style="display:inline;">
            <input type="hidden" name="index" value="${index}" />
            <button type="submit">Delete</button>
          </form>
        </li>
      `;
    })
    .join('');

  res.send(`
    <html>
      <head>
        <title>Simple To-Do List</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { margin-bottom: 10px; }
          form { margin: 10px 0; }
          input[type="text"] { padding: 6px 10px; width: 250px; }
          button { padding: 6px 10px; margin-left: 4px; }
          ul { list-style-type: none; padding: 0; }
          li { margin: 6px 0; }
        </style>
      </head>
      <body>
        <h1>My To-Do List</h1>
        <form action="/add" method="POST">
          <input type="text" name="task" placeholder="New task..." required />
          <button type="submit">Add</button>
        </form>

        <h2>Tasks</h2>
        <ul>
          ${listItems || '<li>No tasks yet</li>'}
        </ul>
      </body>
    </html>
  `);
});

// добавление задачи
app.post('/add', (req, res) => {
  const task = req.body.task;
  if (task && task.trim().length > 0) {
    todos.push(task.trim());
  }
  res.redirect('/');
});

// удаление задачи по индексу
app.post('/delete', (req, res) => {
  const index = parseInt(req.body.index, 10);
  if (!isNaN(index) && index >= 0 && index < todos.length) {
    todos.splice(index, 1);
  }
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`To-Do app listening on http://localhost:${port}`);
});
