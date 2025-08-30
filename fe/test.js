const http = require("http");
const assert = require("assert");

function callAPI(path) {
    return new Promise((resolve, reject) => {
        http.get({ hostname: "localhost", port: 3000, path }, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on("error", reject);
    });
}

(async () => {
    try {
        const allResults = await callAPI("/results");

        const singleResult = await callAPI("/results?question=Why%20this%20company?");
        assert(singleResult.question === "Why this company?", "Sai question khi query");

    } catch (e) {
        console.error("Test failed:", e.message);
        process.exit(1);
    }
})();