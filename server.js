const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.single('audio'), async (req, res) => {
  const filePath = req.file.path;
  const data = fs.readFileSync(filePath);

  try {
    const fetch = await import('node-fetch').then(module => module.default);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/arijitx/wav2vec2-xls-r-300m-bengali",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }
    );

    const result = await response.json();
    fs.unlinkSync(filePath); // Delete the file after processing
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing audio');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
