const gulp = require("gulp");
const pkg = require("./package.json");
const paths = pkg.iconpaths;
const iconfont = require("gulp-iconfont");
const notify = require("gulp-notify");
const consolidate = require("gulp-consolidate");

/**
 * ESLint Server
 */
gulp.task("lint:js-server", () => {
    const esLint = require("gulp-eslint");
    const esLintSrc = ["cartridges/app_custom_as/cartridge/{controllers,models,scripts}/**/*.js"];

    return gulp
        .src(esLintSrc)
        .pipe(
            esLint({
                configFile: ".eslintrc_server.js",
                useEslintrc: false,
                fix: true
            })
        )
        .pipe(esLint.format())
        .pipe(esLint.failAfterError());
});

/**
 * ESLint Client
 */
gulp.task("lint:js-client", () => {
    const esLint = require("gulp-eslint");
    const esLintSrc = ["cartridges/app_custom_as/cartridge/client/*/js/**/*.js", "!cartridges/app_custom_as/cartridge/client/*/js/thirdparty/**/*.js"];

    return gulp
        .src(esLintSrc)
        .pipe(
            esLint({
                configFile: ".eslintrc_client.js",
                useEslintrc: false,
                fix: true
            })
        )
        .pipe(esLint.format())
        .pipe(esLint.failAfterError());
});

/**
 * StyleLint
 */
gulp.task("lint:scss", () => {
    const styleLint = require("gulp-stylelint");
    const styleLintCfg = { reporters: [{ formatter: "string", console: true }],fix:true };
    const styleLintSrc = ["cartridges/app_custom_as/cartridge/static/default/css/**/*.css"];

    return gulp.src(styleLintSrc).pipe(styleLint(styleLintCfg));
});

/**
 * Lint
 */
gulp.task("lint", gulp.series("lint:js-server", "lint:js-client", "lint:scss"));

/**
 * SVG to icon font conversion
 */
gulp.task("iconfont", function(done) {
    paths.icons.forEach(function(path) {
        return gulp
            .src(path.src + "icons/*.svg")
            .pipe(
                iconfont({
                    fontName: "iconfont",
                    formats: ["ttf", "eot", "woff", "woff2"],
                    appendCodepoints: true,
                    appendUnicode: false,
                    normalize: true,
                    fontHeight: 1000,
                    centerHorizontally: true
                })
            )
            .on("glyphs", function(glyphs, options) {
                gulp.src(path.src + "/_iconfont.css")
                    .pipe(
                        consolidate("underscore", {
                            glyphs: glyphs,
                            fontName: options.fontName,
                            fontDate: new Date().getTime()
                        })
                    )
                    .pipe(gulp.dest(path.clientpath));
            })
            .pipe(gulp.dest(path.dest + "/fonts/"))
            .pipe(notify({ message: "iconfont task complete" }));
    });
    done();
});
