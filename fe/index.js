const http = require('http');
const url = require('url');

const callModel = async (modelName, delay, successRate) => {
    await new Promise(r => setTimeout(r, delay));
    if (Math.random() > successRate) throw new Error(`${modelName} failed`);
    return {
        model: modelName,
        confidence: 0.5 + Math.random() * 0.5,
        result: Math.random() > 0.5 ? 'Human' : 'AI'
    };
};
const modelA = () => callModel('ModelA', 1000, 0.9);
const modelB = () => callModel('ModelB', 2000, 0.7);
const modelC = () => callModel('ModelC', 3000, 0.95);

const QUESTIONS = [
    "Tell me about yourself",
    "Why this company?",
    "Greatest weakness?",
    "Describe a challenge you solved",
    "Where do you see yourself in 5 years?"
]

formatResponse = (question,res,start) => {
    return {
        question: question,
        model: res.model,
        result: res.result,
        confidence: Number(res.confidence.toFixed(2)),
        timeTaken: Date.now() - start
    }
}

async function askModels(question) {
    const start = Date.now();

    try {
        console.log("Asking Model A: ", question);
        const res = await modelA();
        return formatResponse(question,res,start);
    } catch (e) {
        console.log(`Model A failed, trying Model B: "${question}" - ${e.message}`);
        try {
            const res = await modelB();
            return formatResponse(question,res,start);
        } catch (e) {
            console.log(`Model B failed, trying Model C: "${question}" - ${e.message}`);
            try {
                const res = await modelC();
                return formatResponse(question,res,start);
            }catch (e) {
                console.log(`All models failed for question: "${question}" - ${e.message}`);
                return {
                    question,
                    error: e.message,
                    model: null,
                    confidence: null,
                    result: null,
                    timeTaken: Date.now() - start
                };
            }
        }
    }
}

async function getAllResults() {
    const promises = QUESTIONS.map(q => askModels(q));
    return await Promise.all(promises);
}

async function getSingleQuestion(question) {
    return await askModels(question);
}

const server = http.createServer(async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    const parsedUrl = url.parse(req.url, true);
    const { pathname, query } = parsedUrl;

    if (pathname === '/results' && req.method === 'GET') {
        try {
            if (query.question) {
                const result = await getSingleQuestion(query.question);
                res.writeHead(200);
                res.end(JSON.stringify(result, null, 2));
                return;
            }
            const results = await getAllResults();
            res.writeHead(200);
            res.end(JSON.stringify(results,null, 2 ));
        } catch (error){
            console.error('Server error:', error);
            res.writeHead(500);
            res.end(JSON.stringify({
                error: 'Internal server error',
                message: error.message
            }));
        }
    }
})

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});