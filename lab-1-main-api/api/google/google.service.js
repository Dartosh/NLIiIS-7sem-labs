export default class GoogleService {
    constructor(googleRepository) {
        this.googleRepository = googleRepository;

        console.log('GoogleService created.');
    }

    // async createTextFile(body) {
    //     const { title, content } = body;

    //     await this.googleRepository.createTextFile(title, content);
    // }

    async getAllFilesIds() {
        const filesIds = await this.googleRepository.getFilesIds();

        // const filesPromises = filesIds.map(
        //     async (fileId) => ( {
        //         id: fileId,
        //         content: await this.googleRepository.getDocContentById(fileId),
        //     }),
        // );

        // const files = await Promise.all(filesPromises);

        // return files;

        return filesIds;
    }

    async getDockContentById(fileId) {
        const content = await this.googleRepository.getDocContentById(fileId);

        return content;
    }

    async getDockInfoById(fileId, content) {
        const docInfo = await this.googleRepository.getDockInfoById(fileId, content);

        return docInfo;
    }
}
