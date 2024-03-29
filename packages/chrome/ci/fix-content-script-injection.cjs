const path = require('path');
const fs = require('fs');
const readline = require('readline');

const ROOT_PATH = path.resolve(__dirname, '../');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist');

function searchFilesByRegex(directoryPath, regexPattern) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        throw err;
      }
      const matchedFiles = files.filter((file) => regexPattern.test(file));
      if (matchedFiles.length > 0) {
        const [filename] = matchedFiles;
        resolve(filename);
      } else {
        throw new Error(
          `No files matching the pattern '${regexPattern}' found.`
        );
      }
    });
  });
}

function writeContentsToFile(filename, startingLineNumber, contentsToWrite) {
  const readStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: readStream,
  });

  let lineNumber = 1;
  const lines = [];

  return new Promise((resolve, reject) => {
    rl.on('line', (line) => {
      if (lineNumber === startingLineNumber) {
        lines.push(contentsToWrite);
      }
      lines.push(line);
      lineNumber++;
    });

    rl.on('close', () => {
      // Append the contents if the starting line number is greater than the total line count
      if (startingLineNumber > lineNumber) {
        lines.push(contentsToWrite);
      }

      const updatedContent = lines.join('\n');

      fs.writeFile(filename, updatedContent, 'utf8', (err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(
          `Contents injected to '${filename}' starting from line ${startingLineNumber}.`
        );
        resolve();
      });
    });
  });
}

function removeLineFromFile(filename, lineToRemove) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      // Remove the specified line
      const lines = data.split('\n');
      const updatedLines = lines.filter((line) => line.trim() !== lineToRemove);

      // Create the updated content
      const updatedContent = updatedLines.join('\n');

      // Write the updated content back to the file
      fs.writeFile(filename, updatedContent, 'utf8', (err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(`Line '${lineToRemove}' removed from '${filename}'.`);
        resolve();
      });
    });
  });
}

/**
 * This script is used to fix the content script injection issue,
 * where the content loader is async but injection should be executed as soon as possible.
 */
(async function () {
  const contentScriptFileNameRegExp = /^content-script-loader/i;
  // format like this: content-script-loader.index.ts.aa49bd00.88d6325e.js
  const contentScriptLoaderFileName = await searchFilesByRegex(
    path.join(DIST_PATH, 'assets'),
    contentScriptFileNameRegExp
  );

  // remove injection code from index file (because it's async, we need to inject it manually
  // such that it can be executed in a sync way)
  const indexHash = contentScriptLoaderFileName.split('.')[3];
  const indexFilePath = path.join(
    DIST_PATH,
    'assets',
    `index.ts.${indexHash}.js`
  );
  await removeLineFromFile(indexFilePath, 'injectDappInterface();');

  const injectedContent = `
  function injectDappInterface() {
    const script = document.createElement("script");
    const url = chrome.runtime.getURL("dapp-api.js");
    script.setAttribute("src", url);
    script.setAttribute("type", "module");
    const container = document.head || document.documentElement;
    container.insertBefore(script, container.firstElementChild);
    container.removeChild(script);
  }
  injectDappInterface();
`;
  await writeContentsToFile(
    path.join(DIST_PATH, 'assets', contentScriptLoaderFileName),
    3,
    injectedContent
  );
})();
