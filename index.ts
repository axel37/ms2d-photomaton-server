import Api from "./src/Api.ts";

const server = Bun.serve({
    port: 3000,
    fetch: async (req) => {
        if (req.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                }
            });
        }

        if (req.method === 'POST' && req.url.endsWith('/send-picture')) {
            try {
                const formData = await req.formData();
                const pictures = formData.getAll('pictures');
                const emails = formData.getAll('emails');



                const response = await Api.sendPictureByMail({ pictures, emails });
                return new Response(response.statusText, {
                    status: response.status,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json"
                    }
                });
            } catch (error) {
                console.error("Error handling /send-picture:", error);
                return new Response("Internal server error", {
                    status: 500,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json"
                    }
                });
            }
        }

        return new Response("Not Found", { status: 404 });
    }
});

console.log(`Listening on http://localhost:${server.port} ...`);
console.log(`Runtime : Bun ${Bun.version}`);