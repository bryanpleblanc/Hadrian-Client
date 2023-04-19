import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FormControl,
    Select,
    MenuItem,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

interface Operation {
    id: string;
    name: string;
    duration: number;
}

interface Dependency {
    from: string;
    to: string;
}

interface Job {
    jobId: string;
    operations: Operation[];
    dependencies: Dependency[];
    criticalPath: Operation[];
    currentOperationIndex: number;
}

const App: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | undefined>(undefined);

    useEffect(() => {
        // Replace this with the actual API call to get the job data
        async function fetchJobs() {
            try {
                // Replace the URL with your API endpoint
                const response = await axios.get<Job[]>(
                    'http://localhost:3000/jobs',
                );
                console.log('data', response.data);
                setJobs(response.data.data);
            } catch (error) {
                console.error('Error fetching job data:', error);
            }
        }

        fetchJobs();
    }, []);

    const handleSelectChange = (
        event: React.ChangeEvent<{ value: unknown }>,
    ) => {
        const jobId = event.target.value as string;
        setSelectedJob(jobs.find((job) => job.jobId === jobId));
    };

    const handleJobClick = (job: Job) => {
        if (job.currentOperationIndex < job.operations.length - 1) {
            job.currentOperationIndex += 1;
            setSelectedJob({ ...job });
        }
    };

    return (
        <div>
            <h1>Job Data</h1>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                <Select
                    value={selectedJob?.jobId || ''}
                    onChange={handleSelectChange}
                    displayEmpty
                >
                    <MenuItem value="" disabled>
                        Select a job
                    </MenuItem>
                    {jobs.map((job) => (
                        <MenuItem key={job.jobId} value={job.jobId}>
                            {job.jobId}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {selectedJob && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Current Operation</TableCell>
                                <TableCell>Current Job Duration</TableCell>
                                <TableCell>Select Next Operation</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    {
                                        selectedJob.operations[
                                            selectedJob.currentOperationIndex
                                        ].name
                                    }
                                </TableCell>
                                <TableCell>
                                    {
                                        selectedJob.operations[
                                            selectedJob.currentOperationIndex
                                        ].duration
                                    }
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() =>
                                            handleJobClick(selectedJob)
                                        }
                                    >
                                        <ArrowForward />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3}>
                                    Upcoming Operations:
                                </TableCell>
                            </TableRow>
                            {selectedJob.operations.map((op, index) => (
                                <TableRow key={op.id}>
                                    <TableCell
                                        sx={{
                                            bgcolor:
                                                index ===
                                                selectedJob.currentOperationIndex
                                                    ? '#C7F2E2'
                                                    : 'inherit',
                                        }}
                                    >
                                        {op.name} ({op.duration})
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default App;
