# YouTube Video Analyzer Service

A Node.js service that analyzes YouTube videos using Puppeteer to verify playback and capture screenshots.

## Features

- ✅ Accepts YouTube URLs via REST API
- ✅ Verifies video playback using Puppeteer
- ✅ Captures video thumbnails as screenshots
- ✅ Headless browser automation
- ✅ Error handling and validation

## API Endpoints

### POST /analyze
Analyzes a YouTube video and returns playback information with screenshot.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Video analyzed successfully",
  "data": {
    "url": "https://www.youtube.com/watch?v=VIDEO_ID",
    "playback": {
      "playable": true,
      "isPlaying": true,
      "duration": 120.5,
      "currentTime": 2.1,
      "readyState": 4
    },
    "screenshot": "screenshot_1234567890.png",
    "screenshotPath": "/path/to/screenshot.png"
  }
}
```

### GET /health
Health check endpoint to verify service status.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the service:
```bash
npm start
```

For development with auto-reload:
```bash
npm install -g nodemon
nodemon src/bin/www
```

## Usage Examples

### Using cURL
```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

### Using JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:3000/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  })
});

const result = await response.json();
console.log(result);
```

## Project Structure

```
be/
├── src/
│   ├── controller/
│   │   └── analyzeController.js     # Request handling logic
│   ├── services/
│   │   └── youtube.js              # YouTube analysis business logic
│   ├── utils/
│   │   └── puppeteer.js            # Puppeteer browser automation
│   ├── routes/
│   │   └── index.js                # API route definitions
│   └── bin/
│       └── www                     # Server startup script
├── upload/                          # Screenshot storage directory
├── app.js                          # Express app configuration
└── package.json
```

## Dependencies

- **Express**: Web framework
- **Puppeteer**: Headless browser automation
- **Helmet**: Security middleware
- **Morgan**: HTTP request logger

## Notes

- Screenshots are saved in the `upload/` directory
- Screenshots can be accessed via `/uploads/filename.png`
- The service runs in headless mode for server environments
- Video playback verification waits for video elements to load
- Screenshots are taken after video verification

## Error Handling

The service includes comprehensive error handling for:
- Invalid YouTube URLs
- Network timeouts
- Video playback issues
- Screenshot capture failures
- Server errors

All errors return appropriate HTTP status codes and JSON error messages.
