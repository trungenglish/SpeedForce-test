const { verifyVideoPlayback, takePageScreenshot } = require('../utils/puppeteer');
const path = require('path');
const fs = require('fs');

const analyzeVideo = async (url) => {
    try {
        const playbackResult = await verifyVideoPlayback(url);
        
        if (!playbackResult.isPlaying) {
            return {
                success: false,
                message: 'Video is not playable',
                details: playbackResult
            };
        }

        const timestamp = Date.now();
        const screenshotPath = path.join(__dirname, '../../upload', `screenshot_${timestamp}.png`);
        
        const uploadDir = path.dirname(screenshotPath);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        await takePageScreenshot(url, screenshotPath);

        return {
            success: true,
            message: 'Video analyzed successfully',
            data: {
                url,
                playback: playbackResult,
                screenshot: path.basename(screenshotPath),
                screenshotPath: screenshotPath
            }
        };
    } catch (error) {
        console.error('Error in analyzeVideo:', error);
        return {
            success: false,
            message: 'Error occurred during video analysis',
            error: error.message
        };
    }
};

module.exports = {
    analyzeVideo
};