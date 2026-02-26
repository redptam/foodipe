import { parseRecipeText } from './src/services/llmService.js';

async function test() {
    try {
        const text = 'To make scrambled eggs: 1. Crack 2 eggs into a bowl. 2. Whisk with 1 tbsp milk. 3. Cook in a pan with 1 tsp butter over medium heat until set.';
        const result = await parseRecipeText(text);
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
