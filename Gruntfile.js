/* eslint-disable global-require, import/no-extraneous-dependencies */
// ==================== CONFIG ==========================
const prod = {
  dir: 'production/',
  html: ['public/**/*.html'],
  js: ['**/*.js', '!**/test/**', '!**/node_modules/**', '!**/production/**', '!Gruntfile.js'],
  misc: ['*', 'public/**/*', '!.*', '!**/*.js', '!**/*.html', '!README.md', '!**/?(logs|node_modules|production|test)/**'],
  watch: ['**/*.js', 'public/**/*.html', '!**/node_modules/**', '!**/production/**', '!Gruntfile.js'],
};

module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


// ==================== TEST ==========================

    force: {
      options: {
        gruntLogHeader: false,
      },
    },

    shell: {
      options: {
        gruntLogHeader: false,
        stderr: false,
      },
      start_dev: 'pm2 start server.js --name dev_server -- test > NUL',
      start_prod: 'pm2 start production/server.js --name prod_server -- test > NUL',
      stop: 'pm2 stop all > NUL',
    },

    mochaTest: {
      options: {
        gruntLogHeader: false,
        reporter: 'spec',
        clearRequireCache: true,
      },
      all: 'test/**/*.js',
      db: 'test/database/**/*.js',
      server: 'test/server/**/*.js',
    },

    watch: {
      options: {
        event: ['all'],
        spawn: false,
      },
      files: prod.watch,
      tasks: ['default'],
    },


// ==================== BUILD ==========================

    uglify: {
      options: {
        mangle: false,
      },
      dev: {
        expand: true,
        cwd: '.',
        src: prod.js,
        dest: prod.dir,
        ext: '.js',
        extDot: 'last',
      },
    },

    htmlmin: {
      dev: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
        },
        expand: true,
        cwd: '.',
        src: prod.html,
        dest: prod.dir,
      },
    },

    copy: {
      dev: {
        expand: true,
        cwd: '.',
        src: prod.misc,
        dest: prod.dir,
        extDot: 'last',
      },
    },

    clean: {
      all: ['production/*', 'production/?(logs|public|test)/**/*'],
    },
  });


// ==================== TASKS ==========================
  require('grunt-log-headers')(grunt);
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-force');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  
  grunt.registerTask('default', 'test:dev');

  grunt.registerTask('build', () => {
    grunt.task.run('test:dev', 'make', 'test:prod');
  });

  grunt.registerTask('test', (env, suite) => {
    grunt.task.run('force:on',
                   'shell:stop',
                   `shell:start_${env || 'dev'}`,
                   `mochaTest:${suite || 'all'}`,
                   'force:off',
                   'shell:stop',
                   `exitWithTestStatus:${suite || 'all'}`);
  });

  grunt.registerTask('exitWithTestStatus', (suite) => {
    grunt.task.requires([`mochaTest:${suite}`]);
    return true;
  });

  grunt.registerTask('make', () => {
    grunt.task.requires('test:dev');
    grunt.task.run('clean:all', 'uglify', 'htmlmin', 'copy');
  });
};
