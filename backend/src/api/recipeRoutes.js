import express from 'express';
import { protect } from '../middleware/auth.js';
import { parseRecipeText } from '../services/llmService.js';
import { fetchAndExtractText } from '../services/scraperService.js';
import Recipe from '../models/Recipe.js';

const router = express.Router();

// @desc    Parse unstructured text into recipe format
// @route   POST /api/recipes/parse
// @access  Private
router.post('/parse', protect, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'Recipe text is required' });
        }

        const parsedData = await parseRecipeText(text);
        res.status(200).json(parsedData);
    } catch (error) {
        if (error.message.includes('OpenAI API Key')) {
            return res.status(503).json({ message: 'LLM Parsing Service is not configured.' });
        }
        console.error('Parse Error:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});

// @desc    Parse recipe from a URL
// @route   POST /api/recipes/parse-url
// @access  Private
router.post('/parse-url', protect, async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ message: 'Recipe URL is required' });
        }

        // Ensure valid URL format before parsing
        try {
            new URL(url);
        } catch {
            return res.status(400).json({ message: 'Invalid URL format' });
        }

        const extractedText = await fetchAndExtractText(url);

        // Double check we got enough text to parse
        if (extractedText.length < 50) {
            return res.status(422).json({ message: 'Could not extract sufficient recipe text from this page.' });
        }

        const parsedData = await parseRecipeText(extractedText);
        // Include original text just in case user wants to fall back
        parsedData.originalText = extractedText;
        res.status(200).json(parsedData);
    } catch (error) {
        if (error.message.includes('OpenAI API Key')) {
            return res.status(503).json({ message: 'LLM Parsing Service is not configured.' });
        }
        console.error('Parse URL Error:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});

// @desc    Get all recipes for user
// @route   GET /api/recipes
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a new recipe
// @route   POST /api/recipes
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { name, ingredients, instructions, tags, originalText } = req.body;

        if (!name || !ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ message: 'Name and ingredients array are required' });
        }

        const recipe = await Recipe.create({
            name,
            ingredients,
            instructions: instructions || [],
            tags: tags || [],
            originalText,
            user: req.user._id
        });

        res.status(201).json(recipe);
    } catch (error) {
        console.error('Save Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const { name, ingredients, instructions, tags } = req.body;
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (recipe.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        recipe.name = name || recipe.name;
        recipe.ingredients = ingredients || recipe.ingredients;
        if (instructions) {
            recipe.instructions = instructions;
        }
        if (tags) {
            recipe.tags = tags;
        }

        const updatedRecipe = await recipe.save();
        res.status(200).json(updatedRecipe);
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (recipe.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await recipe.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error('Delete Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
