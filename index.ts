import Api from "./src/Api.ts";

const server = Bun.serve({
    port: 3000,
    routes: {
        '/send-picture': async req => {
            const { pictures, emails } = req.json();
            return Api.sendPictureByMail({pictures: pictures, emails: emails});
        }
    },
});

console.log(`Listening on http://localhost:${server.port} ...`);
console.log(Bun.version);