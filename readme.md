# LinkedIn AI Comment Assistant

A Chrome extension that helps generate contextual AI responses for LinkedIn posts using GPT-4.

## Features

- Adds an AI response button to LinkedIn posts
- Generates contextually relevant comments
- Avoids common LinkedIn marketing clichés
- Shows loading spinner during generation
- Maintains LinkedIn's native UI/UX

## Installation

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory
5. Click "Extension options"
6. Enter your OpenAI API key and save

## Configuration

After installation, you must configure your OpenAI API key:
1. Click the extension icon in Chrome
2. Select "Extension options"
3. Enter your OpenAI API key in the settings page
4. Click Save

## Project Structure

```
linkedin-ai-extension/
├── manifest.json
├── options.html
├── options.js
├── src/
│   ├── content.js
│   ├── services/
│   │   ├── promptService.js
│   │   └── aiService.js
│   └── utils/
│       └── domUtils.js
├── styles/
│   └── spinner.css
└── images/
    └── icon-48.png
```

## Development

1. Make changes to the source files
2. Reload the extension in Chrome
3. Test on LinkedIn

## License

MIT License