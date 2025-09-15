import { argv } from 'process';
import { existsSync, writeFile } from 'fs';
import { resolve, dirname } from 'path';

try {
  const fieldsJSPath = argv[2];

  if (existsSync(fieldsJSPath)) {
    const resolvedFieldsPath = resolve(fieldsJSPath);
    const targetDir = dirname(resolvedFieldsPath);
    const fieldsJSModule = await import(resolvedFieldsPath);
    const fieldsJS = fieldsJSModule.default;
    const fieldsJSON = fieldsJS();

    writeFile(`${targetDir}/fields.json`, JSON.stringify(fieldsJSON, null, 2), (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  }

} catch (err) {
  console.error(err);
}
