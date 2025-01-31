/**
 * For detection changes every 300 seconds if scaffold can't see updates of files
 */
module.exports = {
    webpack: (config) => {
      config.watchOptions.poll = 300;
      return config;
    },
};