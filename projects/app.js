const express = require('express');
const app = express();
const port = 3002;

// массивчик с цитатками
const quotes = [
  "The only limit to our realization of tomorrow is our doubts of today.",
  "Learning never exhausts the mind.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The future depends on what you do today.",
  "Code is like humor. When you have to explain it, it’s bad."
];

app.use(express.static('public'));

// главная
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Random Quote Generator</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { margin-bottom: 20px; }
          #quote { margin-top: 20px; font-size: 20px; font-style: italic; }
          button { padding: 8px 16px; font-size: 16px; }
        </style>
      </head>
      <body>
        <h1>Random Quote Generator</h1>
        <button onclick="getQuote()">Get quote</button>
        <div id="quote"></div>

        <script>
          async function getQuote() {
            const res = await fetch('/quote');
            const data = await res.json();
            document.getElementById('quote').innerText = data.quote;
          }
        </script>
      </body>
    </html>
  `);
});


app.get('/quote', (req, res) => {
  const index = Math.floor(Math.random() * quotes.length);
  const quote = quotes[index];
  res.json({ quote });
});

app.listen(port, () => {
console.log(`Quote app listening on http://localhost:${port}`);
});
