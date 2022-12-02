import fs from 'fs';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

export default class GoogleRepository {
    CLIENT_ID = '1096305111579-o0ci0u7ndrv5ucnf8hk9jefvvmothc66.apps.googleusercontent.com';

    CLIENT_SECRET = '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';

    REDIRECT_URI = 'https://developers.google.com/oauthplayground';

    REFRESH_TOKEN = '1//04MhmxUZlqy7OCgYIARAAGAQSNwF-L9Ir_Lrt1Fts8u7D7aaV-eLu5MllEgATGhldkfBXye2gyowjHAz8qUSZJRsSumkSOBHhFUg';

    constructor() {
        this.oAuth2Client = new google.auth.OAuth2(
            this.CLIENT_ID,
            this.CLIENT_SECRET,
            this.REDIRECT_URI,
        );

        this.oAuth2Client.setCredentials({
            refresh_token: this.REFRESH_TOKEN,
        })

        this.drive = google.drive({
            version: 'v3',
            auth: this.oAuth2Client,
        });
    }

    // async createTextFile(title, content) {
    //     try {
    //         const response = await this.drive.files.create({
    //             requestBody: {
    //                 name: `${title}.txt`,
    //                 mimeType: 'text/plain',
    //             },
    //             media: {
    //                 mimeType: 'text/plain',
    //                 body: content,
    //             },
    //         });

    //         console.log('Google response on upload file: ', response.data);
    //     } catch (error) {
    //         console.log('Error on creating file: ', error.message);
    //     }
    // }

    async getFilesIds() {
        try {
            return new Promise(resolve => {
                this.drive.files.list({
                    q: "mimeType = 'application/vnd.google-apps.document' and 'me' in owners and modifiedTime > '2022-11-10T12:00:00'",
                    pageSize: "100",
                    fields: "nextPageToken, files(id)"
                }).then(async (response) => {
                    resolve(response.data.files.map((file) => file.id));
                });
            });
        } catch (error) {
            console.log('Error on getting files ids: ', error.message);

            throw error;
        }
    }

    async getDocContentById(fileId) {
        try {
            return new Promise(resolve => {
                this.drive.files.export({
                    fileId,
                    mimeType: 'text/plain',
                }).then((response) => {
                    resolve(response.data);
                });
            });
        } catch (error) {
            console.log(`Error on getting file [${fileId}] content: `, error.message);

            throw error;
        }
    }

    async getDockInfoById(fileId, content) {
        try {
            return new Promise(resolve => {
                this.drive.files.get({
                  fileId,
                  fields: 'name,webViewLink,modifiedTime,iconLink'
                }).then((response) => {
                  resolve({
                    webViewLink: response.data.webViewLink,
                    name: response.data.name,
                    iconLink: response.data.iconLink,
                    modifiedTime: response.data.modifiedTime,
                    cosSim: 0,
                    snippetFirstPart: '',
                    snippetKeyWord: '',
                    snippetSecondPart: '',
                    content: content,
                  });
                });
            });
        } catch (error) {
            console.log(`Error on getting file info [${fileId}]: `, error.message);

            throw error;
        }
    }
}
