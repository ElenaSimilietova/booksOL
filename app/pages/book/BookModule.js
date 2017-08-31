'use strict';


angular.module('bookModule', ['ngRoute', 'bookFactoryModule', 'pageContentModule', 'readingListServiceModule', 'subscriptionServiceModule', 'booksRatingServiceModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/book/:id', {
    templateUrl: 'pages/book/book.html',
    controller: 'BookController'
  })
  .when('/book/read/:id', {
    templateUrl: 'pages/book/readBook.html',
    controller: 'ReadController'
  })
  .when('/books/genre/:id', {
    templateUrl: 'pages/book/bookByGenre.html',
    controller: 'BookByGenreController'
  })
  .when('/book/author/:id', {
    templateUrl: 'pages/book/bookByAuthor.html',
    controller: 'BookByAuthorController'
  });
}])


.controller('BookController', ['$scope','$routeParams', 'Book', 'BooksRating', 'SubscriptionService', function($scope, $routeParams, Book, BooksRating, SubscriptionService) {

  var bookId = $routeParams.id;
  var token = sessionStorage.getItem('token');
  var expiresIn = sessionStorage.getItem('expiresIn'); 
  $scope.ratingReadonlyState = (token && expiresIn && expiresIn > Date.now()) ? false : true;
  $scope.message = null;
  $(function() {
    $('#booksRating').barrating({
      theme: 'fontawesome-stars',
      allowEmpty: true,
      deselectable: false,
      onSelect: function(value, text, event) {
        if (typeof(event) !== 'undefined') {

          // Saving points and receiving general rating for this book
          BooksRating.savePoints(bookId, value).then(function(response) {
            $('select').barrating('set', Math.round(response.data.rating));
          }, function(reason) {});
        }
      }
    });
  });

  Book.getBook(bookId).then(function(response) {
    $scope.book = response.data;

    $('select').barrating('readonly', $scope.ratingReadonlyState);
    $('select').barrating('set', Math.round(response.data.rating));

    $scope.isSubscriptionValid = false;

    if (sessionStorage.getItem('token')) {
      SubscriptionService.getDueDate().then(function(dateResponse) {
        $scope.dueDate = dateResponse.data.dueDate;
        $scope.isSubscriptionValid = (Date.parse($scope.dueDate) > Date.now()) ? true : false;
      }, function(reason) {

      });
    }

  }, function(reason) {
    $scope.message = 'Sorry, but something went wrong.';
  });
}])

.controller('ReadController', ['$scope','$routeParams', '$location', 'Book', 'ReadingList', function($scope, $routeParams, $location, Book, ReadingList) {
  var bookId = $routeParams.id;
  $scope.bookId = bookId;
  $scope.page = 1;
  $scope.newPage = 1;
  $scope.message = null;

  Book.getGeneralInfo(bookId).then(function(response) {
    $scope.bookName = response.data.name;
    $scope.bookPagesNumber = response.data.pages_number;

    if (response.data.currentPage) {
      $scope.bookInReadingList = true;
      $scope.page = response.data.currentPage;
      
    } else {
      $scope.bookInReadingList = false;
      $scope.page = 1;
    }

    $scope.newPage = ($scope.newPage < $scope.bookPagesNumber)? $scope.page + 1 : $scope.bookPagesNumber;
    
    Book.getPageContent(bookId, $scope.page).then(function(response) {
      $scope.content = decodeURIComponent(response.data.content);
    }, function(reason) {
      // rejection
      if (reason.status == 500) {
        $scope.message = 'Sorry, but something went wrong.';
      } else if (reason.status == 401) {
        $location.path('/users/sign-in');
      }
    });
  }, function(reason) {
    // rejection
    if (reason.status == 500) {
      $scope.message = 'Sorry, but something went wrong.';
    } else if (reason.status == 401) {
      $location.path('/users/sign-in');
    }
  });

  $scope.showPage = function() {

    if ($scope.newPage < 1) {
      $scope.newPage = 1;
    } else if ($scope.newPage > $scope.bookPagesNumber){
       $scope.newPage = $scope.bookPagesNumber;
    }
  
    Book.getPageContent(bookId, $scope.newPage).then(function(response) {
      $scope.content = decodeURIComponent(response.data.content);
    }, function(reason) {
      // rejection
      if (reason.status == 500) {
        $scope.message = 'Sorry, but something went wrong.';
      } else if (reason.status == 401) {
        $location.path('/users/sign-in');
      }
    });
    
    $scope.page = $scope.newPage;
    $scope.newPage = ($scope.newPage < $scope.bookPagesNumber)? $scope.page + 1 : $scope.bookPagesNumber;
  };

  $scope.addBookToReadingList = function(currentPage) {
    ReadingList.saveBookPage(bookId, currentPage).then(function(response) {
      if (response.status == 200) {
        if($scope.bookInReadingList == false) {
          $scope.bookInReadingList = true;
        }
      }
    }, function(reason) {
      // rejection
      if (reason.status == 500) {
        $scope.message = 'Sorry, but something went wrong.';
      } else if (reason.status == 401) {
        $location.path('/users/sign-in');
      }
    });
  }

  $scope.removeBookFromReadingList = function() {
    ReadingList.removeBookFromReadingList(bookId).then(function(response) {
      if (response.status == 200) {
        if($scope.bookInReadingList == true) {
          $scope.bookInReadingList = false;
        }
      }
    }, function(reason) {
      // rejection
      if (reason.status == 500) {
        $scope.message = 'Sorry, but something went wrong.';
      } else if (reason.status == 401) {
        $location.path('/users/sign-in');
      }
    });
  };


}])

.controller('BookByGenreController', ['$scope','$routeParams','Book', function($scope, $routeParams, Book) {
  var genreID =  $routeParams.id;

  Book.getBooksByGenre(genreID).then(function(response) {
    $scope.genre = response.data.genre;
    $scope.books = response.data.books;

    if (Object.keys($scope.books).length == 0) {
      $scope.message = 'Sorry, no results fot this genre.';
    }
  }, function(reason) {
      $scope.message = 'Sorry, but something went wrong.';
  });
  /*
  var genreId =  $routeParams.id;
  $scope.message = null;
  
  Book.getBooksByGenre(genreId).then(function(response) {
    $scope.books = response.data;

    if (response.data[0].name == null)
      $scope.message = 'There are no books in ' + response.data[0].genre + ' genre.';
    else
      $scope.message = '';     
    }, function(reason) {
      $scope.message = 'Sorry, but something went wrong.';
  });
  */
}])

.controller('BookByAuthorController', ['$scope','$routeParams','Book', function($scope, $routeParams, Book) {
  var authorID =  $routeParams.id;
  
  Book.getBooksByAuthor(authorID).then(function(response) {
    $scope.author = response.data.author;
    $scope.books = response.data.books;

    if (Object.keys($scope.books).length == 0) {
      $scope.message = 'Sorry, no results fot this author.';
    }
  }, function(reason) {
      $scope.message = 'Sorry, but something went wrong.';
  });
}]);
