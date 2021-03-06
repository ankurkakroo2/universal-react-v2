const os = require('os');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const copydir = require('copy-dir');

function dirExists(dir) {
  return fs.existsSync(dir);
}

function createDir(dir) {
  try {
    fs.mkdirSync(dir);
  } catch (e) {
    console.error(chalk.red('error creating directory'));
    throw e;
  }
}

function copyDir(sourcePath, destPath, exclusions) {
  copydir.sync(
    sourcePath,
    destPath,
    {
      utimes: true, // keep add time and modify time
      mode: true, // keep file mode
      cover: true, // cover file when exists, default is true

      filter: function (stat, filepath) {
        const _filename = path.parse(filepath).base;

        if (stat === 'file' && exclusions.includes(_filename)) {
          return false;
        }
        return true;
      }
    },
    function (err) {
      if (err) {
        throw err;
      }
    }
  );
}

function writeFile(filePath, data) {
  fs.writeFileSync(filePath, data);
}

function writeJsonFile(jsonFilePath, json) {
  writeFile(jsonFilePath, JSON.stringify(json, null, 2) + os.EOL);
}

module.exports = {
  dirExists,
  createDir,
  copyDir,
  writeJsonFile
};
