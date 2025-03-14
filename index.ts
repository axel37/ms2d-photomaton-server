import Api from "./src/Api.ts";

// CORS-related headers
const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
};

const server = Bun.serve({
    port: 3000,
    routes: {
        '/send-picture': async req => {
            const body = await req.json();
            console.log(body);
            let response = await Api.sendPictureByMail(body);

            response.headers.append = headers;
            return response;
        }
    },
    // Global error handler
    error(error) {
        console.error(error);
        return new Response(`Internal Error: ${error.message}`, {
            status: 500,
            headers: {
                "Content-Type": "text/plain",
            },
        });
    }
});

console.log(`Listening on http://localhost:${server.port} ...`);
console.log(`Runtime : Bun ${Bun.version}`);