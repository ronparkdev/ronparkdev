const fs = require('fs');
const showdown = require('showdown');
const converter = new showdown.Converter();

const readme = fs.readFileSync('README.md', 'utf8');
const html = converter.makeHtml(readme);

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Want to know Ron?</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1, h2, h3, h4, h5, h6 {
            color: #333333;
            margin-top: 1.5rem;
        }
        p {
            line-height: 1.8;
            color: #555555;
            margin: 1rem 0;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        pre {
            background: #f1f1f1;
            padding: 15px;
            border-radius: 5px;
        }
        code {
            background: #e9ecef;
            padding: 2px 4px;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            background: #343a40;
            color: #ffffff;
            position: fixed;
            width: 100%;
            bottom: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        ${html}
    </div>
    <footer class="footer">
        &copy; ${new Date().getFullYear()} Sang Min Park. All rights reserved.
    </footer>
</body>
</html>`;

fs.writeFileSync('index.html', htmlTemplate);
