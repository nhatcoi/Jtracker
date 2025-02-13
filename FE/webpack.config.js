const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
    const isDevelopment = argv.mode !== "production";

    return {
        entry: "./src/index.js", // Điểm bắt đầu của ứng dụng
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "bundle.[contenthash].js",
            clean: true, // Tự động dọn dẹp thư mục dist mỗi lần build
            publicPath: "/",
        },
        resolve: {
            extensions: [".js", ".jsx"],
        },
        devtool: isDevelopment ? "source-map" : false,
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: "babel-loader",
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    type: "asset/resource",
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./public/index.html", // file HTML mẫu của bạn
                filename: "index.html",
            }),
        ],
        devServer: {
            static: {
                directory: path.join(__dirname, "public"),
            },
            historyApiFallback: true, // Hỗ trợ React Router (nếu sử dụng)
            port: 3000,
            open: true,
        },
    };
};
