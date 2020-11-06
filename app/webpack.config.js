module.exports = {
    entry: './src/app/index.ts',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devtool: 'inline-source-map',
    output: {
        filename: 'script.js',
        path: require('path').resolve(__dirname, '../assets')
    }
};