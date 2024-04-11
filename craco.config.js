// craco.config.js
module.exports = {
    webpack: {
        configure: {
            resolve: {
                fallback: {
                    crypto: require.resolve('crypto-browserify'),
                    stream: require.resolve("stream-browserify"),
                    url: false,
                    zlib: false,
                    https: false,
                    http: false
                },
            },
        },
    },
};
