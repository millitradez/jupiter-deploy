const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.text());

app.all('*', async (req, res) => {
  try {
    const path = req.path.replace(/^\/+/, "");
    const queryString = req.url.split('?')[1] || '';
    const target = `https://quote-api.jup.ag/${path}${queryString ? '?' + queryString : ''}`;
    
    const response = await fetch(target, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.JUPITER_API_KEY,
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : null,
    });
    
    const data = await response.text();
    
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Content-Type', 'application/json');
    res.status(response.status).send(data);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy listening on port ${port}`);
});
