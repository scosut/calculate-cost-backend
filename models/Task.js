import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    minutes: {
        type: Number,
        required: true,
    },
    seconds: {
        type: Number,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
