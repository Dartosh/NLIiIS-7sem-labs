import express from 'express';
import { AppInjector } from './app.injector';

const appRouter = express();
const appInjector = new AppInjector();

// appRouter.post('/google/file', async (req, res, next) => {
//     try {
//         await appInjector.googleController.createTextFile(req.body);

//         res.status(200).json('added');
//     } catch {
//         res.status(400).json({
//             message: 'Error',
//         });
//     }
// });

appRouter.get('/google/files', async (req, res, next) => {
    try {
        await appInjector.googleController.getFilesIds();

        res.status(200).json('founded');
    } catch {
        res.status(400).json({
            message: 'Error',
        });
    }
});

appRouter.get('/documents', async (req, res, next) => {
    try {
        const docs = await appInjector.documentsController.findDocumentsByWord(req.query);

        res.status(200).json(docs);
    } catch {
        res.status(400).json({
            message: 'Error',
        });
    }
});

// router.get('/library/document', async (req, res, next) => {
//     const book = await authenticationController.getBook(req.query);
//     res.status(200).json(book);
// });


export default appRouter;
