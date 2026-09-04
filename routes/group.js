import express from 'express';
import mongoose from 'mongoose';
import Group from '../models/Group.js';
import Material from '../models/Material.js';

const groupRouter = express.Router();

// get all groups
groupRouter.get('/', async (req, res, next) => {
    try {
        const groups = await Group.find()
            .sort({ name: 1 })
            .collation({ locale: 'en', strength: 2 });
        res.json(groups);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

// get group by ID
groupRouter.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404);
            throw new Error('Group not found.');
        }

        const group = await Group.findById(req.params.id);

        if (!group) {
            res.status(404);
            throw new Error('Group not found.');
        }

        res.json(group);
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

// add new group
groupRouter.post('/', async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name?.trim()) {
            res.status(400);
            throw new Error('Group name is required.');
        }

        const newGroup = new Group({ name });

        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

// update group name
groupRouter.put('/:id', async (req, res, next) => {
    try {
        const { _id, name } = req.body || {};

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            res.status(404);
            throw new Error('Group not found.');
        }

        const group = await Group.findById(_id);

        if (!group) {
            res.status(404);
            throw new Error('Group not found.');
        }

        if (!name?.trim()) {
            res.status(400);
            throw new Error('Group name is required.');
        }

        group.name = name;

        const updatedGroup = await group.save();
        res.json(updatedGroup);
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

// delete existing group
groupRouter.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404);
            throw new Error('Group not found.');
        }

        const group = await Group.findById(id);

        if (!group) {
            res.status(404);
            throw new Error('Group not found.');
        }

        await group.deleteOne();
        await Material.deleteMany({ group_id: id });
        res.json({ message: 'Group deleted successfully.' });
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

export default groupRouter;
