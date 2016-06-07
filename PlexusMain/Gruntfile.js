module.exports = function(grunt) {

    //Initializing the configuration object
    grunt.initConfig({

        // Task configuration
        less: {
            development: {
                options: {
                    compress: true
                },
                files: {
                    //compiling frontend.less into frontend.css
                    "./public/stylesheets/frontend.css":"./config/dev-css/frontend.less",
                    "./public/stylesheets/backend.css":"./config/dev-css/backend.less"
                }
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            js_libraries: {
                src: [
                    './bower_components/jquery/dist/jquery.js',
                    './bower_components/blockUI/jquery.blockUI.js',
                    './bower_components/bootstrap/dist/js/bootstrap.js',
                    './bower_components/bootstrap-fileinput/js/fileinput.js',
                    './bower_components/bootbox.js/bootbox.js',
                    './bower_components/cropper/dist/cropper.js',
                    './bower_components/summernote/dist/summernote.js',
                    './bower_components/datatables/media/js/jquery.dataTables.js',
                    './bower_components/datatables/media/js/dataTables.bootstrap.js',
                    './bower_components/remarkable-bootstrap-notify/dist/bootstrap-notify.js',
                    './bower_components/svgxuse/svgxuse.js',
                    './config/theme/js/jquery.menu-aim.js',
                    './config/theme/js/modernizer.js'
                ],
                dest: './public/javascript/libraries.js'
            },
            js_theme: {
                src: [
                    './config/theme/js/navigation.js',
                    './config/theme/js/preload.js',
                    './config/theme/js/cd-tabs.js',
                    './config/theme/js/alert.js',
                    './config/theme/js/password-check.js',
                    './config/dev-js/dev.js'
                ],
                dest: './public/javascript/theme.js'
            },
            js_backend: {
                src: [
                    './config/theme/js/lock.js',
                    './config/theme/js/pincode-check.js'
                    ],
                dest: './public/javascript/backend.js'
            }
        },
        uglify: {
                    options: {
                        mangle: false  // Use if you want the names of your functions and variables unchanged
                    },
                    libraries: { files: {'./public/javascript/libraries.js': './public/javascript/libraries.js'}},
                    theme: { files: {'./public/javascript/theme.js': './public/javascript/theme.js'}},
                    backend: { files: {'./public/javascript/backend.js': './public/javascript/backend.js'}},
                },
        copy: {
                  main: {
                    files: [
                            {expand: true,flatten: true, src: ['./bower_components/font-awesome/fonts/*'], dest: './public/fonts/', filter: 'isFile'},
                            {expand: true,flatten: true, src: ['./bower_components/bootstrap/fonts/*'], dest: './public/fonts/', filter: 'isFile'},
                            {expand: true,flatten: true, src: ['./bower_components/bootstrap-fileinput/img/*'], dest: './public/images/', filter: 'isFile'},
                            {expand: true, cwd:'./config/theme/fonts/fonts/', src: ['**'], dest: './public/fonts/'},
                            {expand: true, cwd:'./config/theme/fonts/svg-icons/', src: ['**'], dest: './public/fonts/'},
                            {expand: true,flatten: true, src: ['./config/theme/img/*'], dest: './public/images/', filter: 'isFile'},
                            {expand: true,flatten: true, src: ['./config/env/i18n/flags/*'], dest: './public/images/flags/', filter: 'isFile'},
                            {expand: true,flatten: true, src: ['./config/theme/favicons/*'], dest: './public/images/favicons/', filter: 'isFile'},
                            ],
                        },
                },
        stripCssComments: {
            dist: {
                options:{
                    preserve: false
                },
                files: {
                    './public/stylesheets/frontend.css': './public/stylesheets/frontend.css'
                }
            }
        },
    });

    // Plugin loading
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-strip-css-comments');

    // Task definition
    grunt.registerTask('default',['concat','less','uglify','copy','stripCssComments']);

};
