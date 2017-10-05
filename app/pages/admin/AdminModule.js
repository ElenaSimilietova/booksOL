'use strict';

angular.module('adminModule', ['ngRoute', 'bookFactoryModule', 'authorFactoryModule', 'genreFactoryModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: 'pages/admin/admin.html',
    controller: 'AdminController'
  })
  .when('/dashboard/books', {
    templateUrl: 'pages/admin/books.html',
    controller: 'AdminBooksController'
  })
  .when('/dashboard/book/edit', {
    templateUrl: 'pages/admin/editBook.html',
    controller: 'AdminBooksEditController'
  })
  .when('/dashboard/book/add', {
    templateUrl: 'pages/admin/addBook.html',
    controller: 'AdminBooksAddController'
  })
  .when('/dashboard/book/add/result/:res', {
    templateUrl: 'pages/admin/addBookResult.html',
    controller: 'AdminBooksAddResultController'
  })
  .when('/dashboard/users', {
    templateUrl: 'pages/admin/users.html',
    controller: 'AdminUsersController'
  });
}])

.directive('fileModel', ['$parse', function ($parse) {
  return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;
        
        element.bind('change', function(){
            scope.$apply(function(){
              modelSetter(scope, element[0].files[0]);
            });
        });
      }
  };
}])
.service('bookUpload', ['$http', function ($http) {
    this.upload = function(title, author, genre, description, bigImage, smallImage, pdf){
        var fd = new FormData();
        fd.append('title', title);
        fd.append('author', author);
        fd.append('genre', genre);
        fd.append('description', description);
        fd.append('bigImage', bigImage);
        fd.append('smallImage', smallImage);
        fd.append('pdf', pdf);

        $http.defaults.headers.common['access-token'] = sessionStorage.getItem('token');
        return $http.post('/books/upload', fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        });

    }
}])

.controller('AdminController', ['$location', function($location) {
  //TODO: put this as function of autorization service
  var token = sessionStorage.getItem('token');
  var expiresIn = sessionStorage.getItem('expiresIn');

  if (!token || !expiresIn || expiresIn < Date.now()) {
    $location.path('/sign-in');
  };

  var tokenArr = token.split('.');
  var payload = JSON.parse(atob(tokenArr[1]));
  
  if((payload.role != 'administrator')) {
     $location.path('#/');
  }
  
  //TODO END

}])

.controller('AdminBooksController', ['$scope', '$location', 'Book', function($scope, $location, Book) {
  var token = sessionStorage.getItem('token');
  var expiresIn = sessionStorage.getItem('expiresIn');
  $scope.selectedLetter = null;
  $scope.books = {};

  if (!token || !expiresIn || expiresIn < Date.now()) {
    $location.path('/sign-in');
  };

  var tokenArr = token.split('.');
  var payload = JSON.parse(atob(tokenArr[1]));
  
  if((payload.role != 'administrator')) {
     $location.path('#/');
  }

  Book.getBooksMappingByLetter().then(function(response) {
    $scope.alphabet = response.data;
  }, function(reason) {
    // rejection
    if (reason.status == 500) {
      $scope.message = 'Sorry, but something went wrong.';
    } else 
    if (reason.status == 401) {
      $location.path('/sign-in');
    }
  });

  $scope.showBooksList = function(letter) {
    $scope.selectedLetter = letter;
    $scope.messageDeleteResult = null;
    Book.getBooksByLetter(letter).then(function(response) {

      $scope.books = response.data;

    }, function(reason) {
      // rejection
      if (reason.status == 500) {
        $scope.message = 'Sorry, but something went wrong.';
      } else 
      if (reason.status == 401) {
        $location.path('/sign-in');
      }
    });
    
  }

  $scope.deleteBook = function(bookID) {
    Book.delete(bookID).then(function(response) {
      $scope.messageDeleteResult = 'The book was successfully deleted.';

      Book.getBooksByLetter($scope.selectedLetter).then(function(response) {

        $scope.books = response.data;

      }, function(reason) {
        // rejection
        if (reason.status == 500) {
          $scope.message = 'Sorry, but something went wrong.';
        } else 
        if (reason.status == 401) {
          $location.path('/sign-in');
        }
      });

    }, function() {
      $scope.messageDeleteResult = 'The book wasn\'t deleted.';
    });
  }
}])

.controller('AdminUsersController', [function() {
  var token = sessionStorage.getItem('token');
  var expiresIn = sessionStorage.getItem('expiresIn');

  if (!token || !expiresIn || expiresIn < Date.now()) {
    $location.path('/sign-in');
  };

  var tokenArr = token.split('.');
  var payload = JSON.parse(atob(tokenArr[1]));
  
  if((payload.role != 'administrator')) {
     $location.path('#/');
  }

}])

.controller('AdminBooksEditController', [function() {
  var token = sessionStorage.getItem('token');
  var expiresIn = sessionStorage.getItem('expiresIn');

  if (!token || !expiresIn || expiresIn < Date.now()) {
    $location.path('/sign-in');
  };

  var tokenArr = token.split('.');
  var payload = JSON.parse(atob(tokenArr[1]));
  
  if((payload.role != 'administrator')) {
     $location.path('#/');
  }

}])

.controller('AdminBooksAddResultController', ['$scope', '$location', '$routeParams', function ($scope, $location, $routeParams) {
  var token = sessionStorage.getItem('token');
  var expiresIn = sessionStorage.getItem('expiresIn');

  if (!token || !expiresIn || expiresIn < Date.now()) {
    $location.path('/sign-in');
  };

  var tokenArr = token.split('.');
  var payload = JSON.parse(atob(tokenArr[1]));
  
  if((payload.role != 'administrator')) {
     $location.path('#/');
  }

  $scope.result = $routeParams.res;

}])

.controller('AdminBooksAddController', ['$scope', '$location', '$http', 'bookUpload', 'Author', 'Genre', function($scope, $location, $http, bookUpload, Author, Genre) {
  var token = sessionStorage.getItem('token');
  var expiresIn = sessionStorage.getItem('expiresIn');

  if (!token || !expiresIn || expiresIn < Date.now()) {
    $location.path('/sign-in');
  };

  var tokenArr = token.split('.');
  var payload = JSON.parse(atob(tokenArr[1]));
  
  if((payload.role != 'administrator')) {
     $location.path('#/');
  }

  $scope.title = {'value': '',
                  'pattern': /([^\s])/,
                  'message': 'Invalid title name'
  };

  $scope.author2 = {'value': '',
                  'pattern': /([^\s])/,
                  'message': 'Invalid author name'
  };

  $scope.genre2 = {'value': '',
                  'pattern': /([^\s])/,
                  'message': 'Invalid genre'
  };

  $scope.description = {'value': '',
                        'pattern': /([^\s])/,
                        'message': 'Description should not be empty'
  };

  $scope.bigImage = {'value': '',
                     'pattern': /\.(gif|jpg|jpeg|png)$/i,
                     'message': 'Invalid image'
  };

  $scope.smallImage = {'value': '',
                       'pattern': /\.(gif|jpg|jpeg|png)$/i,
                       'message': 'Invalid image'
  };

  $scope.pdf = {'value': '',
                'pattern': /\.(pdf)$/i,
                'message': 'Invalid pdf file'
  };


  Author.getAll().then(function(response) {
    $scope.authors = response.data;
    $scope.author = "";
  });

  Genre.getAll().then(function(response) {
    $scope.genres = response.data;
    $scope.genre = "";
  });

  $scope.uploadFile = function() {
      
  };

  $scope.submitAuthor = function(author) {
    Author.saveAuthor(author).then(function(response) {
      if ((response.status == 200) && (Number.isInteger(response.data.id)) && (parseInt(response.data.id) > 0)) {
        $scope.authors.push({ id: response.data.id, name: author });
        $scope.author = response.data.id;
      } else {
        
      } 
    }, function(reason) {

    });
  }

  $scope.submitGenre = function(genre) {
    Genre.saveGenre(genre).then(function(response) {
      if ((response.status == 200) && (Number.isInteger(response.data.id)) && (parseInt(response.data.id) > 0)) {
        $scope.genres.push({ id: response.data.id, name: genre });
        $scope.genre = response.data.id;
      } else {
        
      } 
    }, function(reason) {
      
    });
  }

  $scope.submitForm = function(form, isFormValid) {

    var title = $scope.title.value,
        bigImage = $scope.bigImage,
        smallImage = $scope.smallImage,
        author = $scope.author,
        genre = $scope.genre,
        description = $scope.description.value,
        pdf = $scope.pdf;
  
    if (isFormValid) {
      bookUpload.upload(title, author, genre, description, bigImage, smallImage, pdf).then(function(response) {

        $location.path('/dashboard/book/add/result/success');

      }, function(reason) {
        $location.path('/dashboard/book/add/result/fail');
      });
      
    } 
    
  }

  $(document).on('change', ':file', function() {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
  });

  // We can watch for our custom `fileselect` event like this
  
  $(document).ready( function() {
      $(':file').on('fileselect', function(event, numFiles, label) {

          var input = $(this).parents('.input-group').find(':text'),
              log = numFiles > 1 ? numFiles + ' files selected' : label;

          if( input.length ) {
              input.val(log);
          } 

      });
  });

 

}]);