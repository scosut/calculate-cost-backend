import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: String,
        required: true,
        trim: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
        required: true,
    },
});

const Material = mongoose.model('Material', materialSchema);

export default Material;
