import { useState, useEffect } from 'react';
import { TextField, Box, Stack, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import TodoForm from './components/TodoForm';
import axios from 'axios';
import './App.css';

type Todo = {
    id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
};

const App = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Title', width: 150 },
        { field: 'description', headerName: 'Description', width: 250 },
        { field: 'priority', headerName: 'Priority', width: 100 },
        {
            field: 'dueDate',
            headerName: 'Due Date',
            width: 250,
            valueFormatter: (params) => {
                const date = new Date(params.value);
                const dateHumanReadable = date.toDateString();
                return dateHumanReadable;
            },
        },
        {
            field: 'delete',
            headerName: '',
            sortable: false,
            width: 50,
            renderCell: (params) => (
                <IconButton onClick={() => handleDelete(params)}>
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    const handleDelete = async (params: any) => {
        await axios.delete(`http://localhost:3000/todos/${params.row.id}`);
        fetchTodos();
    };

    const fetchTodos = async (query = '') => {
        try {
            let response;
            if (query.length > 0) {
                response = await axios.get(
                    `http://localhost:3000/todos/query/${query}`,
                );
            } else {
                response = await axios.get(`http://localhost:3000/todos/`);
            }

            if (response && response.data.data.todos.length > 0) {
                setTodos(response.data.data.todos);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Debouncer
    useEffect(() => {
        const getData = setTimeout(() => {
            fetchTodos(searchQuery);
        }, 1000);

        return () => clearTimeout(getData);
    }, [searchQuery]);

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <>
            <Box sx={{ width: '60%' }}>
                <Stack spacing={2}>
                    <TodoForm fetchTodos={fetchTodos} />
                    <TextField
                        label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ marginBottom: '1rem' }}
                    />
                    <DataGrid rows={todos} columns={columns} autoHeight />
                </Stack>
            </Box>
        </>
    );
};

export default App;
