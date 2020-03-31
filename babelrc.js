module.exports = {
    presets: ['@babel/preset-env'],
    configureWebpack: {
        performance: {
            maxAssetSize: 500000,
        },
        plugins: [
            new CopyWebpackPlugin([{ from: 'src/public/', to: 'public' }])
        ],
    },
}