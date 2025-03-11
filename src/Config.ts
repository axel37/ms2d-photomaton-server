export default class Config {
    static get picturesPath(): string {
        return process.env.PICTURES_PATH ?? 'pictures/';
    }
}