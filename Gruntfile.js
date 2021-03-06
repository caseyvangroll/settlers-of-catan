/* eslint-disable global-require, import/no-extraneous-dependencies */
// ==================== CONFIG ==========================
const prod = {
  dir: 'production/',
  html: ['public/**/*.html'],
  js: ['*.js', 'models/**/*.js', 'game/**/*.js', 'public/js/client.js', '!**/test/**', '!**/node_modules/**', '!**/production/**', '!Gruntfile.js'],
  misc: ['package.json', 'public/**/*', '!.*', '!**/*.js', '!**/*.html', '!public/js/**', '!**/?(logs|node_modules|production|test)/**'],
  watch: ['public/css/**/*.css', 'public/js/**/*.js', 'public//**/*.html'],
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
      restart_dev: 'pm2 restart dev_server -- test', // force a happy exit code even if warned
      start_dev: 'pm2 start server.js --name dev_server -- test', // force a happy exit code even if warned
      start_prod: 'pm2 start production/server.js --name prod_server -- test',
      stop: 'pm2 stop all || true',
    },

    mochaTest: {
      options: {
        clearRequireCache: true,
        reporter: 'spec',
        timeout: 4000,
      },
      all: 'test/**/*.js',
      db: 'test/database/**/*.js',
      server: 'test/server/**/*.js',
      socket: 'test/socket/**/*.js',
    },

    watch: {
      options: {
        event: ['all'],
        spawn: false,
      },
      files: prod.watch,
      tasks: ['browserify', 'shell:restart_dev'],
    },


// ==================== BUILD ==========================

    babel: {
      options: {
        presets: ['env'],
      },
      client: {
        src: 'public/js/client.js',
        dest: 'public/js/client.js',
      },
    },

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

    concat: {
      options: {
        // Place all client code inside document.ready to avoid global variables
        banner: '$(() => {',
        footer: '});',
        gruntLogHeader: false,
        separator: ';\n',
        stripBanners: true,
      },
      client: {
        src: [
          'public/js/common.js',
          'public/js/chat/*.js',
          'public/js/game/extenders/*.js',
          'public/js/game/game.js',
          'public/js/game/helpers.js',
          'public/js/game/events.js',
          'public/js/game/render.js',
        ],
        dest: 'public/js/client.js',
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
      prod_client: ['production/public/js/*', '!production/public/js/client.js'],
    },
  });


// ==================== TASKS ==========================
  require('grunt-log-headers')(grunt);
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
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

  grunt.registerTask('test', (env = 'dev', suite = 'all') => {
    grunt.task.run('force:on',
                   `browserify:${env}`,
                   'shell:stop',
                   `shell:start_${env}`,
                   `mochaTest:${suite}`,
                   'force:off',
                   'shell:stop',
                   `exitWithTestStatus:${suite}`);
  });

  grunt.registerTask('exitWithTestStatus', (suite) => {
    grunt.task.requires([`mochaTest:${suite}`]);
    return true;
  });

  // Merge all js files in public/js into one client.js file, then transpile to es5
  grunt.registerTask('browserify', (env = 'dev') => {
    if (env === 'dev') {
      grunt.task.run('concat:client', 'babel:client');
    }
  });

  grunt.registerTask('make', () => {
    grunt.task.requires('test:dev');
    grunt.task.run('clean:all', 'uglify', 'htmlmin', 'copy');
  });
};
