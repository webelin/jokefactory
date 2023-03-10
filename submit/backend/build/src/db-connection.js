import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://root:mongodb@submitdb.uebzony.mongodb.net/SumbitDB?retryWrites=true&w=majority');

export const Joke = mongoose.model('Joke',
    {
        type: Number,
        setup: String,
        punchline: String,
        approvalStatus: 'approved' | 'declined' | 'pending'
    }
);

export const Type = mongoose.model('Type',
    {
        id: Number,
        type: String
    }
);