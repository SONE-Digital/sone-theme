import prettier from 'prettier';

export default function HubSpotPrettier (config) {
  return {
    name: 'hubspot-prettier', // this name will show up in logs and errors
    transform(source, filePath) {
      return prettier.format(source, { ...config, filepath: filePath });
    },
  };
}
