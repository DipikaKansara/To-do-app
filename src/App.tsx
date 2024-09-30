import React, {useEffect, useState} from 'react';
import axios from "axios";

const TodoList = () => {
    const [todos, setTodos] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [editIndex, setEditIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchTask =  async () => {
            try {
                const res = await axios.get('http://localhost:3000/tasks')
                setTodos(res.data.map((taskObj: { task: string }) => taskObj.task));
            }
            catch(err) {
                alert('Error Fatching tasks: ')
            }
        }
        fetchTask()
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            try {
                if (editIndex !== null) {
                    await axios.put(`http://localhost:3000/tasks/${editIndex}`, { task: inputValue });
                    const updatedTodos = todos.map((todo, index) => (index === editIndex ? inputValue : todo));
                    setTodos(updatedTodos);
                    setEditIndex(null);
                } else {
                    await axios.post('http://localhost:3000/tasks', { task: inputValue });
                    setTodos([...todos, inputValue]);
                }
                setInputValue('');
            } catch (error) {
                console.error('Error saving task:', error);
            }
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       setInputValue(event.target.value)
    }

    const handleDelete = async (index: number) => {
        try {
            await axios.delete(`http://localhost:3000/tasks/${index}`);
            const newTodos = [...todos];
            newTodos.splice(index, 1);
            setTodos(newTodos);
        } catch (error) {
           alert('Error deleting task:');
        }
    };


    const handleEdit = (index: number) => {
        setInputValue(todos[index]);
        setEditIndex(index);
    };
    return(
        <div style={styles.container}>
            <h1 style={styles.header}>To Do List</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Add a new task..."
                />
                <button style={styles.addButton}>Add Task</button>
            </form>
            <ul style={styles.todoList}>
                {todos.map((todo, index) => (
                    <li key={index} style={styles.todoItem}>
                        {todo}
                        <div style={{flexDirection: 'row'}}>
                        <button onClick={() => handleDelete(index)} style={styles.deleteButton}>Delete Task</button>
                        <button  onClick={() => handleEdit(index)} style={styles.updateButton}>Update Task</button></div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
const styles = {
    container: {
        maxWidth: '700px',
        margin: '50px auto',
        padding: '20px',
        backgroundColor: '#f4f4f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    header: {
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        fontSize: '24px',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    input: {
        flexGrow: 1,
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginRight: '10px',
        fontSize: '16px',
    },
    addButton: {
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        margin: '20px'
    },
    todoList: {
        listStyleType: 'none',
        padding: 0,
    },
    todoItem: {
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '20px'
    },
    updateButton: {
        padding: '5px 10px',
        backgroundColor: '#2e39a6',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    }
};

const App = () => {
    return (
        <div>
            <TodoList/>
        </div>
    );
}

export default App

