const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment');

const answerSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    creator_id: {
        type: Number
    },
    investor_id: {
        type: Number
    },
    post_id: {
        type: Number
    },
    amount: {
        type: Number
    },
    period: {
        type: Number
    },
    rate: {
        type: Number
    },
    comment: {
        type: String
    }
    
})
answerSchema.plugin(autoIncrement.plugin, {
    model: 'Answer',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

mongoose.model("Answer", answerSchema)