var LIVERELOAD_PORT = 35729; //Puerto que usaremos para escuchar que ha habido cambios de los js

var path = require('path');

var mountFolder = function (connect, dir) {
    return connect.static(path.resolve(dir));
};

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.initConfig({
    connect: { //para crear na conexion web
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      //esta configuración va asociada para juntar connect y watch de tal forma que al haber un cambio
      //nos volvemos a conectar con los ficheros modificados
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              require('connect-livereload')({port: LIVERELOAD_PORT}),
              mountFolder(connect, 'build')
            ];
          }
        }
      }
    },
    open: { //Para abrir una url
      dev: {
        path: 'http://localhost:<%= connect.options.port %>' //la direccion que abriremos
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: 'src',
        src: ['img/320x320/*'],
        dest: 'build/',
      },
      images: {
        expand: true,
        cwd: 'src',
        src: ['img/320x320/*', 'img/logo/*'],
        dest: 'build/'
      },
      'github-pages': {
        expand: true,
        cwd: 'src',
        src: 'index.html',
        dest: '',
        options: {
          process: function (content, srcpath) {
            return content.replace(/src="/g,'src="build/');
          },
        }
      },
      views: {
        expand: true,
        cwd: 'src',
        src: ['index.html', 'views/*'],
        dest: 'build/',
      },
      data: {
        expand: true,
        cwd: 'src',
        src: 'data/**/*.json',
        dest: 'build/',
      },
      fonts: {
        expand: true,
        cwd: 'src',
        src: 'fonts/*',
        dest: 'build/',
      }
    },
    stylus: {
      build: {
        options: {
          linenos: false,
          compress: false
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: [ 'styles/**/*.styl' ],
          dest: 'build/',
          ext: '.css'
        }]
      }
    },
    uglify: {
      my_target: {
        files: {
          'build/js/main.js': [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/handlebars/handlebars.min.js',
            'src/js/hb-times-helper.js',
            'src/js/Parser.js',
            'src/js/main.js'
          ]
        }
      }
    },
    watch: { //configuramos la escucha de cambios
      data: {
        files: ['src/data/**/*.json'],
        options: {
          spawn: false,
          livereload: LIVERELOAD_PORT //Puerto donde se enviará el evento
        },
        tasks: ['copy:data']
      },
      views: {
        files: ['src/index.html', 'src/views/**/*.html'],
        options: {
          spawn: false,
          livereload: LIVERELOAD_PORT //Puerto donde se enviará el evento
        },
        tasks: ['copy:views']
      },
      images: {
        files: ['img/320x320/*', 'img/logo/*'],
        options: {
          spawn: false,
          livereload: LIVERELOAD_PORT //Puerto donde se enviará el evento
        },
        tasks: ['copy:images']
      },
      scripts: {
        files: [
          'src/js/*.js' //Directorio donde estarán nuestros js
        ],
        options: {
          spawn: false,
          livereload: LIVERELOAD_PORT //Puerto donde se enviará el evento
        },
        tasks: ['uglify']
      },
      styles: {
        files: 'src/styles/**/*.styl',
        tasks: ['stylus'],
        options: {
          spawn: false,
          livereload: LIVERELOAD_PORT //Puerto donde se enviará el evento
        },
      }
    },
  });

  grunt.registerTask('build', ['copy:all', 'stylus', 'uglify']);
  grunt.registerTask('copy:all', [
    'copy:images', 'copy:views', 'copy:data', 'copy:fonts', 'copy:github-pages'
    ])
  grunt.registerTask('server', ['build', 'connect:livereload', 'open:dev', 'watch']); //Ejecutaremos todas las tareas indicadas.
};