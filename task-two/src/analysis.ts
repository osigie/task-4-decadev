// import console from "console";
import { sample } from 'lodash';

/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */
//  const {createReadStream} = require('fs')

// const createReadStream = require('fs').createReadStream;
// const createWriteStream = require('fs').createWriteStream;
import fs from 'fs';

type Categories = {
  [key: string]: number;
};
interface Result {
  'valid-domains': string[];
  totalEmailsParsed: number;
  totalValidEmails: number;
  categories: Categories;
}
function analyseFiles(inputPath: string[], output: string) {
  let data = '';
  let totalEmailsParsed = 0;
  let totalValidEmails = 0;
  const categoriesObj: Categories = {};
  const validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // looping through the input since we have input of array

  inputPath.forEach((path) => {
    const stream = fs.createReadStream(path, 'UTF8');
    stream.on('data', (chunk: string) => {
      if (chunk === undefined) {
        console.log('error found');
      }
      data += chunk;
    });

    stream.on('end', () => {
      const realMails = data
        .split('\n')
        .filter((data: string) => data.includes('@'));
      totalEmailsParsed += realMails.length;
      const validEmails = realMails.filter((data) => data.match(validRegex));
      totalValidEmails += validEmails.length;
      const mailsWithOutAt = validEmails.map((data) => data.split('@')[1]);
      const uniqueMails = [...new Set(mailsWithOutAt)];

      // Getting the unique mails and putting the occurence as key

      mailsWithOutAt.forEach((data) => {
        return (categoriesObj[data] = categoriesObj[data] + 1 || 1);
      });
      // Creating the actual result object
      const result: Result = {
        'valid-domains': uniqueMails,
        totalEmailsParsed: totalEmailsParsed,
        totalValidEmails: totalValidEmails,
        categories: categoriesObj,
      };

      // streaming to JSON file
      const writeData = JSON.stringify(result, null, 3);
      const writeStream = fs.createWriteStream(output);
      writeStream.write(writeData);
    });
  });
}
export default analyseFiles;
