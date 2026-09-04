import express from 'express';
import mongoose from 'mongoose';
import Material from '../models/Material.js';

const materialRouter = express.Router();

// get all materials
materialRouter.get('/', async (req, res, next) => {
    try {
        const materials = await Material.aggregate(
            [
                {
                    $lookup: {
                        from: 'groups',
                        localField: 'group_id',
                        foreignField: '_id',
                        as: 'group',
                    },
                },
                {
                    $unwind: '$group',
                },
                {
                    $sort: { 'group.name': 1, name: 1 },
                },
            ],
            { collation: { locale: 'en', strength: 2 } },
        );

        res.json(materials);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

// get material by ID
materialRouter.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404);
            throw new Error('Material not found.');
        }

        const material = await Material.findById(req.params.id);

        if (!material) {
            res.status(404);
            throw new Error('Material not found.');
        }

        res.json(material);
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

// add new material
materialRouter.post('/', async (req, res, next) => {
    try {
        const { name, quantity, cost, group_id } = req.body;

        if (
            !name?.trim() ||
            !quantity?.trim() ||
            !cost?.toString().trim() ||
            !group_id?.trim()
        ) {
            res.status(400);
            throw new Error(
                'Material name, quantity, cost, and group are required.',
            );
        }

        const newMaterial = new Material({ name, quantity, cost, group_id });

        const savedMaterial = await newMaterial.save();
        res.status(201).json(savedMaterial);
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

// update existing material
materialRouter.put('/:id', async (req, res, next) => {
    try {
        const { _id, name, quantity, cost, group_id } = req.body || {};

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            res.status(404);
            throw new Error('Material not found.');
        }

        const material = await Material.findById(_id);

        if (!material) {
            res.status(404);
            throw new Error('Material not found.');
        }

        if (
            !name?.trim() ||
            !quantity?.trim() ||
            !cost?.toString().trim() ||
            !group_id?.trim()
        ) {
            res.status(400);
            throw new Error(
                'Material name, quantity, cost, and group are required.',
            );
        }

        material.name = name;
        material.quantity = quantity;
        material.cost = cost;
        material.group_id = group_id;

        const updatedMaterial = await material.save();
        res.json(updatedMaterial);
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

// delete existing material
materialRouter.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404);
            throw new Error('Material not found.');
        }

        const material = await Material.findById(id);

        if (!material) {
            res.status(404);
            throw new Error('Material not found.');
        }

        await material.deleteOne();
        res.json({ message: 'Material deleted successfully.' });
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

export default materialRouter;
