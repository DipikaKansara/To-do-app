const express = require('express')
const cors = require('cors');
const app = express()
const bodyParser = require('body-parser');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const tasks = [];

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const task = req.body;
    tasks.push(task);
    res.json({ message: 'Task added successfully!' });
});

app.put('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const task = req.body;
    tasks[id] = task;
    res.json({ message: 'Task updated successfully!' });
});

app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    tasks.splice(id, 1);
    res.json({ message: 'Task deleted successfully!' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

