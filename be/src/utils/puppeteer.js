const { launch } = require('puppeteer');

const takePageScreenshot = async (url, outputPath) => {
    let browser = null;

    try {
        browser = await launch({headless: true});
        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        await page.screenshot({
            path: outputPath,
            type: 'png',
        });
    } catch (error) {
        console.error('Error taking screenshot:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

const verifyVideoPlayback = async (url) => {
    let browser = null;

    try {
        browser = await launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        const videoElement = await page.$('video');
        if (!videoElement) {
            throw new Error('Video element not found on page');
        }

        await page.evaluate(()  => {
            const video = document.querySelector('video');
            if (video && video.paused) {
                video.play().catch(e => console.log('Auto-play blocked:', e));
            }
        });

        const isPlaying = await page.evaluate(() => {
            const video = document.querySelector('video');
            return video && !video.paused && !video.ended && video.readyState > 2;
        });

        return {
            isPlaying,
        };

    } catch (error) {
        console.error('Error verifying video playback:', error);
        return { 
            isPlaying: false,
            error: error.message 
        };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = {
    takePageScreenshot,
    verifyVideoPlayback
};