/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */

import fs from 'fs';

import dns, { MxRecord } from 'dns';

function validateEmailAddresses(inputPath: string[], outputFile: string) {
  let data = '';

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

    stream.on('close', () => {
      const realMails = data
        .split('\n')
        .filter((data: string) => data.includes('@'));

      const validEmails = realMails.filter((data) => data.match(validRegex));

      const mailsWithOutAt = validEmails.map((data) => data.split('@')[1]);
      const uniqueMails = [...new Set(mailsWithOutAt)];

      // using dns to check for valid domain

      const options = {
        all: true,
      };

      const toCsv = fs.createWriteStream(outputFile, { flags: 'w' });
      toCsv.write('Emails' + '\n');

      uniqueMails.forEach((each) => {
        dns.resolve(each, 'MX', (err: Error | null, addresses: MxRecord[]) => {
          console.log(err);
          if (addresses && addresses.length > 0) {
            const writeData = JSON.stringify(each, null, 3);
            toCsv.write(writeData + '\n');
          }
        });
      });
    });
  });
}

export default validateEmailAddresses;
