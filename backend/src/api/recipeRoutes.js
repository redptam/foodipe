import express from 'express';
import { protect } from '../middleware/auth.js';
import { parseRecipeText } from '../services/llmService.js';
import { fetchAndExtractText } from '../services/scraperService.js';
import Recipe from '../models/Recipe.js';
import { validate, parseTextSchema, parseUrlSchema, createRecipeSchema, updateRecipeSchema } from '../validation/schemas.js';

const router = express.Router();

// @desc    Parse unstructured text into recipe format
// @route   POST /api/recipes/parse
// @access  Private
router.post('/parse', protect, validate(parseTextSchema), async (req, res) => {
    try {
        const { text } = req.body;
        const parsedData = await parseRecipeText(text);
        res.status(200).json(parsedData);
    } catch (error) {
        if (error.message.includes('OpenAI API Key')) {
            return res.status(503).json({ message: 'LLM Parsing Service is not configured.' });
        }
        console.error('[PARSE]', error);
        res.status(500).json({ message: 'Failed to parse recipe. Please try again.' });
    }
});

// @desc    Parse recipe from a URL
// @route   POST /api/recipes/parse-url
// @access  Private
router.post('/parse-url', protect, validate(parseUrlSchema), async (req, res) => {
    try {
        const { url } = req.body;

        // SSRF protection: url is already validated as a URL by Zod; now check destination
        const { isSafeUrl } = await import('../services/scraperService.js');
        if (!(await isSafeUrl(url))) {
            return res.status(400).json({ message: 'Invalid or disallowed URL.' });
        }

        const extractedText = await fetchAndExtractText(url);

        if (extractedText.length < 50) {
            return res.status(422).json({ message: 'Could not extract sufficient recipe text from this page.' });
        }

        const parsedData = await parseRecipeText(extractedText);
        parsedData.originalText = extractedText;
        res.status(200).json(parsedData);
    } catch (error) {
        if (error.message.includes('OpenAI API Key')) {
            return res.status(503).json({ message: 'LLM Parsing Service is not configured.' });
        }
        console.error('[PARSE-URL]', error);
        res.status(500).json({ message: 'Failed to fetch and parse recipe. Please try again.' });
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
        console.error('[FETCH]', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
});

// @desc    Create a new recipe
// @route   POST /api/recipes
// @access  Private
router.post('/', protect, validate(createRecipeSchema), async (req, res) => {
    try {
        const { name, ingredients, instructions, tags, originalText } = req.body;

        const recipe = await Recipe.create({
            name,
            ingredients,
            instructions,
            tags,
            originalText,
            user: req.user._id,
        });

        res.status(201).json(recipe);
    } catch (error) {
        console.error('[SAVE]', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
});

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private
router.put('/:id', protect, validate(updateRecipeSchema), async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (recipe.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { name, ingredients, instructions, tags } = req.body;
        recipe.name = name ?? recipe.name;
        recipe.ingredients = ingredients ?? recipe.ingredients;
        if (instructions !== undefined) recipe.instructions = instructions;
        if (tags !== undefined) recipe.tags = tags;

        const updatedRecipe = await recipe.save();
        res.status(200).json(updatedRecipe);
    } catch (error) {
        console.error('[UPDATE]', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
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
            return res.status(403).json({ message: 'Not authorized' });
        }

        await recipe.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error('[DELETE]', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
});

export default router;
