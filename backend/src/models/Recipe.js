import mongoose from 'mongoose';

// Ingredient schema is embedded, no need for its own model file
const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ingredient name is required'],
        trim: true
    },
    amount: {
        type: String,
        required: [true, 'Ingredient amount is required'],
        trim: true
    }
}, {
    _id: false // Disable _id for subdocuments unless specifically needed
});

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a recipe name'],
        trim: true
    },
    originalText: {
        type: String,
        trim: true,
        default: null
    },
    ingredients: [ingredientSchema],
    instructions: {
        type: [String],
        default: []
    },
    tags: {
        type: [String],
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
