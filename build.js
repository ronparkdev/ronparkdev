const fs = require('fs');
const showdown = require('showdown');
const converter = new showdown.Converter();
const readme = fs.readFileSync('README.md', 'utf8');
const html = converter.makeHtml(readme);
const htmlTemplate = fs.readFileSync('template.html').toString();

fs.writeFileSync('index.html', htmlTemplate
    .replace('<!-- BODY -->', html)
    .replace('<!-- YEAR -->', new Date().getFullYear()));

console.log('✨ Portfolio site has been generated successfully!');
