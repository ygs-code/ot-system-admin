const PurgeCss = require('@fullhuman/postcss-purgecss');
const path = require("path");


 

const PurgeOptions = {

    // Specify the paths to all of the template files in your project 
    content: [
        path.join(process.cwd(), "/client/**/*.html"),
        path.join(process.cwd(), "/client/**/*.js"),
        path.join(process.cwd(), "/client/**/*.jsx"),
        // path.join(process.cwd(), "/client/**/*.html"),
        // path.join(process.cwd(), "/client/**/*.html"),
    //   './src/**/*.html',
    //   './src/**/*.js',
    //   './src/**/*.jsx',
      // etc.
    ],

    // Include any special characters you're using in this regular expression
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
};

module.exports = {
    plugins: [
        require('tailwindcss'),
        PurgeCss(PurgeOptions),
    ],
}