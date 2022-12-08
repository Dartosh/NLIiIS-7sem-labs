export default class GoogleController {
    constructor(googleService) {
        this.googleService = googleService;

        console.log('GoogleController created.');
    }

    // async createTextFile(body) {
    //     this.googleService.createTextFile(body);
    // }

    async getFilesIds() {
        this.googleService.getFilesIds();
    }
}
