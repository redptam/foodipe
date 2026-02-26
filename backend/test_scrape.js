import { fetchAndExtractText } from './src/services/scraperService.js';

async function test() {
    try {
        const text = await fetchAndExtractText('https://pinchofyum.com/best-chicken-tinga-tacos');
        console.log("Success! Length:", text.length);
        console.log(text.substring(0, 100)); // print start of text
    } catch (e) {
        console.error("Caught error in test:", e);
    }
}
test();
