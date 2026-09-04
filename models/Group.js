import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
