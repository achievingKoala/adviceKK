const fs = require('fs');
const path = require('path');

function extractAdvice(inputFile, outputFile) {
    try {
        // Read the input file
        const content = fs.readFileSync(inputFile, 'utf8');
        
        // Split the content into sections separated by multiple newlines
        const sections = content.split(/\n\s*\n+/);
        
        const adviceList = [];
        let inAdviceSection = false;
        
        // Process each section
        for (const section of sections) {
            const lines = section.split('\n').map(line => line.trim()).filter(line => line);
            if (lines.length === 0) continue;
            
            // Check if this is the start of the advice section
            if (lines.some(line => line.includes('Excellent Advice for Living'))) {
                inAdviceSection = true;
                continue;
            }
            
            // Skip if not in the advice section yet
            if (!inAdviceSection) continue;
            
            // Skip section separators and page numbers
            if (lines[0].match(/^\*+$/) || lines[0].match(/^\d+$/)) {
                continue;
            }
            
            // Skip sections that are too short or don't look like advice
            const text = lines.join(' ');
            if (text.length < 20 || 
                text.includes('Kevin Kelly') || 
                text.includes('ISBN') ||
                text.includes('Copyright') ||
                text.match(/^[A-Z][a-z]+ [A-Z][a-z]+$/) ||
                text.match(/^[A-Z ]+$/) ||
                text.match(/^[A-Z][a-z]+( [A-Z][a-z]+)*:$/) ||
                text.match(/^[A-Z][a-z]+( [A-Z][a-z]+)* [0-9]+$/)) {
                continue;
            }
            
            // Clean up the text
            const cleanText = text
                .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
                .replace(/^\s+/, '')    // Remove leading spaces
                .replace(/\s+$/, '');   // Remove trailing spaces
                
            // Add to the advice list if it looks like actual advice
            if (cleanText.length >= 20 && cleanText.split(' ').length >= 3) {
                adviceList.push({
                    id: adviceList.length + 1,
                    en: cleanText,
                    zh: ""
                });
            }
        }
        
        // Write to output file
        fs.writeFileSync(outputFile, JSON.stringify(adviceList, null, 2));
        console.log(`Successfully extracted ${adviceList.length} pieces of advice to ${outputFile}`);
        
        // Print first 10 items as a sample
        console.log("\nSample of extracted advice:");
        console.log(JSON.stringify(adviceList.slice(0, 10), null, 2));
        
    } catch (error) {
        console.error('Error processing file:', error);
    }
}

// Usage
const inputFile = path.join(__dirname, 'Excellent Advice for Living Wisdom I Wish Id Known Earlier.txt');
const outputFile = path.join(__dirname, 'cleanExtractedAdvice.json');
extractAdvice(inputFile, outputFile);
