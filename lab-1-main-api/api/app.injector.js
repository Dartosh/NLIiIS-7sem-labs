import GoogleRepository from "./google/google.repository";
import GoogleController from "./google/google.controller";
import GoogleService from "./google/google.service";
import DocumentsController from "./documents/documents.controller";
import DocumentsService from "./documents/documents.service";

export class AppInjector {
    constructor() {
        this.googleRepository = new GoogleRepository();
        this.googleService = new GoogleService(this.googleRepository);
        this.googleController = new GoogleController(this.googleService);

        this.documentsService = new DocumentsService(this.googleService);
        this.documentsController =  new DocumentsController(this.documentsService);
    }

    get getGoogleController() {
        return this.googleController;
    }

    get getDocumentsController() {
        return this.documentsController;
    }
}
