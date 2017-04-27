module.exports = {
    inputFiles: [
        "demo/vue.bundle.js",
        "demo/vue/index.ejs.html",
        "demo/react.bundle.js",
        "demo/react/index.ejs.html",
        "demo/angular.bundle.js",
        "demo/angular/index.ejs.html"
    ],
    outputFiles: file => file.replace(".ejs", ""),
    json: false,
    ejsOptions: {
        rmWhitespace: true
    },
    sha: 256,
    customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + "-" + md5String + extensionName,
    noOutputFiles: [],
}