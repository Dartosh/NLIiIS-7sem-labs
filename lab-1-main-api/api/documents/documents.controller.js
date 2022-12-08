export default class DocumentsController {
    constructor(documentsService) {
        this.documentsService = documentsService;
    }

    // async createTextFile(body) {
    //     this.googleService.createTextFile(body);
    // }

    async findDocumentsByWord(query) {
        return this.documentsService.findDocumentsByWord(query);
    }
}
