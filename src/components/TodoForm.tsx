import { useState } from 'react';
import {
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Box,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    fetchTodos: () => void;
}

const TodoForm = ({ fetchTodos }: Props) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleDateChange = (date: Date) => {
        const convertedDate = dayjs(date).toISOString();
        setDueDate(convertedDate);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const todo = { title, description, dueDate, priority, id: uuidv4() };
        await axios.post('http://localhost:3000/todos', todo);
        setTitle('');
        setDescription('');
        setPriority('');
        setPriority('');
        fetchTodos();
    };

    return (
        <Box
            sx={{ bgcolor: 'lightgray', borderRadius: '8px', padding: '16px' }}
        >
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Due Date"
                        fullWidth
                        inputFormat="MM/dd/yyyy"
                        onChange={(newValue: Date) => {
                            handleDateChange(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>

                <FormControl margin="normal" fullWidth>
                    <InputLabel id="priority-label">Priority</InputLabel>
                    <Select
                        labelId="priority-label"
                        value={priority}
                        onChange={(e) => {
                            setPriority(e.target.value);
                        }}
                    >
                        <MenuItem value={'1'}>High</MenuItem>
                        <MenuItem value={'2'}>Medium</MenuItem>
                        <MenuItem value={'3'}>Low</MenuItem>
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">
                    Add Todo
                </Button>
            </form>
        </Box>
    );
};

export default TodoForm;
