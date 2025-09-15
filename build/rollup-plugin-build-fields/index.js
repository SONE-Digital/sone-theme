import {utimes} from 'fs';

const touch = path => {
  return new Promise((resolve, reject) => {
    const time = new Date();
    utimes(path, time, time, err => {
      if (err) {
        return open(path, 'w', (err, fd) => {
          if (err) return reject(err);
          close(fd, err => (err ? reject(err) : resolve(fd)));
        });
      }
      resolve();
    });
  });
};

export default function HubSpotBuildFields (fieldsDir, fieldsJSFile) {
  return {
    name: 'build-fields-json', // this name will show up in logs and errors
    async buildStart() {
      // start watching all the files in the fields directory
      this.addWatchFile(fieldsDir);
    },
    async generateBundle() {
      // touch the fields.js file to trigger a rebuild
      touch(fieldsJSFile);
    }
  };
}
