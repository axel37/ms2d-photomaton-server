import Api from "./src/Api.ts";

const server = Bun.serve({
    port: 3000,
    routes: {
        '/send-picture': async req => {
            const body = await req.json();
            console.log(body);
            return Api.sendPictureByMail(body);
        }
    },
});

console.log(`Listening on http://localhost:${server.port} ...`);
console.log(`Runtime : Bun ${Bun.version}`);