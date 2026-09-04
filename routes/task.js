import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';

const taskRouter = express.Router();

// get all tasks
taskRouter.get('/', async (req, res, next) => {
    try {
        const tasks = await Task.find()
            .sort({ name: 1 })
            .collation({ locale: 'en', strength: 2 });
        res.json(tasks);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

// get task by ID
taskRouter.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404);
            throw new Error('Task not found.');
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found.');
        }

        res.json(task);
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

// add new task
taskRouter.post('/', async (req, res, next) => {
    try {
        const { name, minutes, seconds, rate } = req.body;

        if (
            !name?.trim() ||
            !minutes?.toString().trim() ||
            !seconds?.toString().trim() ||
            !rate?.toString().trim()
        ) {
            res.status(400);
            throw new Error(
                'Task name, minutes, seconds, and rate are required.',
            );
        }

        const newTask = new Task({ name, minutes, seconds, rate });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

// update existing task
taskRouter.put('/:id', async (req, res, next) => {
    try {
        const { _id, name, minutes, seconds, rate } = req.body || {};

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            res.status(404);
            throw new Error('Task not found.');
        }

        const task = await Task.findById(_id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found.');
        }

        if (
            !name?.trim() ||
            !minutes?.toString().trim() ||
            !seconds?.toString().trim() ||
            !rate?.toString().trim()
        ) {
            res.status(400);
            throw new Error(
                'Task name, minutes, seconds, and rate are required.',
            );
        }

        task.name = name;
        task.minutes = minutes;
        task.seconds = seconds;
        task.rate = rate;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

// delete existing task
taskRouter.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404);
            throw new Error('Task not found.');
        }

        const task = await Task.findById(id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found.');
        }

        await task.deleteOne();
        res.json({ message: 'Task deleted successfully.' });
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

export default taskRouter;
