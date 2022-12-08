import axios from "axios";

export default class DocumentsService {
    constructor(googleService, documentsRepository) {
        this.googleService = googleService;

        this.words = new Map();
        this.docWords = new Map();
        this.idfs = new Map();
        this.docLenghts = new Map();
        this.docInfo = new Map();

        this.initDocuments();
    }

    async initDocuments() {
        let ids = await this.googleService.getAllFilesIds();

        ids.forEach((id) => this.docWords.set(id, new Map()));

        const docsCount = this.docWords.size;

        // const iterator = this.docsWordsGenerator();

        // let number = 0;

        // let point = 100 / docsCount;

        // let iteratorResult = iterator.next();

        // for (let doc of this.docWords) {
        //     yield doc;
        //   }

        for (let doc of this.docWords) {

            await this.readDoc(doc[0]);

            // setTimeout(() => {
            //     console.log('Waiting...');
            // }, 500);

            // number++;

            // iteratorResult = iterator.next();
        }

        this.calculateAllIds();

        this.calculateAllLenghts();

        console.log(this.idfs);
    }

    async readDoc(fileId) {
        const content = await this.googleService.getDockContentById(fileId);

        console.log('Here');

        axios.post('http://127.0.0.1:8080/', {
            Text: content,
        }, {
            headers: { Accept: 'application/json, text/plain, */*' },
            proxy: false,
        }).then(
            async (response) => {
                const words = new Map();

                for (let item of response.data) {
                    const currFrequency = this.words.get(item.Word);

                    this.words.set(item.Word, currFrequency ? currFrequency + item.Frequency : item.Frequency);

                    words.set(item.Word, item.Frequency);
                }

                this.docWords.set(fileId, words);

                await this.getDockInfo(fileId, content);
            }
        );
    }

    async getDocksInfo(fileId, content) {
        return new Promise(async resolve => {
            let docInfo = await this.googleService.getDockInfoById(fileId, content);
            this.docInfo.set(fileId, docInfo);
            resolve();
        });
    }

    async getDockInfo(fileId, content) {
        const docInfo = await this.googleService.getDockInfoById(fileId, content);

        this.docInfo.set(fileId, docInfo);
    }

    calculateAllLenghts() {
        for (let doc of this.docWords) {
            this.calculateDocLength(doc);
        }
    }

    calculateDocLength(doc) {
        let sum = 0;

        for (let docWord of doc[1]) {
            let frequency = this.words.get(docWord[0]);

            if (frequency) {
                sum += Math.pow(frequency, 2);
            }
        }

        let lenght = Math.sqrt(sum);

        this.docLenghts.set(doc[0], lenght);
    }

    calculateAllIds() {
        // let iterator = this.wordsGenerator();

        // let iteratorResult = iterator.next();

        for (let word of this.words) {
            this.calculateWordIdf(word);
        }

        // while (!iteratorResult.done) {
        //     let word = iteratorResult.value;

        //     this.calculateWordIdf(word);

        //     iteratorResult = iterator.next();
        // }
    }

    calculateWordIdf(word) {
        let wordFrequencyInAllDocs = 0;
    
        // let iterator = this.docsWordsIterator();

        // let iteratorResult = iterator.next();

        for (let doc of this.docWords) {
            for (let docWord of doc[1]) {
                if (docWord[0] == word[0]) {
                    wordFrequencyInAllDocs++;
                    break;
                }
            }
        }

        // while (!iteratorResult.done) {
        //   let doc = iteratorResult.value;

        //   for (let docWord of doc[1]) {
        //     if (docWord[0] == word[0]) {
        //         wordFrequencyInAllDocs++;

        //         break;
        //     }
        //   }
        //   iteratorResult = iterator.next();
        // }
    
        let docsCount = this.docWords.size;

        var idf = Math.log(docsCount / wordFrequencyInAllDocs) / Math.log(2);

        this.idfs.set(word[0], idf);
    }

    *docsWordsIterator() {
        for (let doc of this.docWords) {
          yield doc;
        }

        return true;
      }

    *wordsGenerator() {
        for (let word of this.words) {
          yield word;
        }

        return true;
    }

    async getWordsFromQuery(query) {
        return new Promise(resolve => {
            axios.post('http://127.0.0.1:8080/', {
                    Text: query,
                }, {
                    headers: { Accept: 'application/json, text/plain, */*' },
                    proxy: false,
                }).then((response) => {
                    let words = new Map();
        
                    for (let item of response.data) {
                    words.set(item.Word, item.Frequency);
                    }
        
                    resolve(words);
                });
        });
    }

    async findDocumentsByWord(query) {
        const { word } = query;

        const words = await this.getWordsFromQuery(word)

        const wordLength = this.calculateWordsLength(words);

        if (wordLength == 0) {
            return new Promise(resolve => {
              resolve([]);
            });
        }

        let cosSimArray = new Array();

        // let iterator = this.docsWordsGenerator();

        // let iteratorResult = iterator.next();

        for (let doc of this.docWords) {
            let docWords = this.docWords.get(doc[0]);

            let docLength = this.docLenghts.get(doc[0]);
      
            if (docWords && docLength) {
                let cosSim = this.cosineSimilarity(words, wordLength, docWords, docLength);

                if (cosSim != 0) {
                    cosSimArray.push([doc[0], cosSim]);
                }
            }
        }

        // while (!iteratorResult.done) {
        //     let docId = iteratorResult.value;

        //     let docWords = this.docWords.get(docId[0]);

        //     let docLength = this.docLenghts.get(docId[0]);
      
        //     if (docWords && docLength) {
        //         let cosSim = this.cosineSimilarity(words, wordLength, docWords, docLength);

        //         if (cosSim != 0) {
        //             cosSimArray.push([docId[0], cosSim]);
        //         }
        //     }

        //     iterResult = iter.next();
        // }

        cosSimArray.sort((a, b) => b[1] - a[1]);

        let docs = new Array();

        for (let item of cosSimArray) {
            let docInfo = this.docInfo.get(item[0]);;

            if (docInfo) {
                docInfo.cosSim = item[1];
                this.getDocumentSnippet(docInfo, words, this.docWords.get(item[0]));
                docs.push(docInfo);
            }
        }

        return docs;
    }

    *docsWordsGenerator() {
        for (let doc of this.docWords) {
          yield doc;
        }

        return true;
    }

    cosineSimilarity(
        words,
        lenght,
        docWords,
        docLenght,
      ) {
        let sum = 0;
    
        for (let word of words) {
            let wordInDoc = docWords.get(word[0]);

            if (wordInDoc) {
                sum += word[1] * wordInDoc;
            }
        }
    
        return sum / (lenght * docLenght);
    }

    calculateWordsLength(words) {
        let sum = 0;
    
        for (let word of words) {
          let wordFrequency = this.words.get(word[0]);

          let wordIdf = this.idfs.get(word[0]);

          if (wordFrequency && wordIdf) {
            wordIdf = wordIdf * (word[1] / wordFrequency);

            sum += Math.pow(wordIdf, 2);
          }
        }
    
        return Math.sqrt(sum);
    }

    getDocumentSnippet(doc, keyWords, docWords) {
        let keyWord = '';

        for (let word of keyWords) {
          if (docWords.get(word[0])) {
            keyWord = word[0];
          }
        }
    
        let content = doc.content;

        content = content.toLowerCase();

        let keyWordIndex = content.indexOf(keyWord);

        let startIndex = keyWordIndex - 100;

        let endIndex = keyWordIndex + 100;
    
        if (startIndex < 0) {
          startIndex = 0;
        }
    
        doc.snippetFirstPart = doc.content.substring(startIndex, keyWordIndex);

        doc.snippetKeyWord = keyWord;

        doc.snippetSecondPart = doc.content.substring(keyWordIndex + keyWord.length, endIndex);
      }
}

