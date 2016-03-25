var mongoose = require('mongoose');

var IdeaSchema = mongoose.Schema({
    title: String,
    description: String,
    photo: String,
    status: String,
    site: String,
    developmentSite: String,
    upvotes: Number,
    uniqueURL: String,
    creator: {
	type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    neededRoles: [
	{
	    type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
	}
    ],
    participants: [
	{
	    type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
	}
    ],
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Idea", IdeaSchema);
