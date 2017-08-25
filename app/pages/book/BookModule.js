'use strict';

angular.module('bookModule', ['ngRoute', 'bookFactoryModule', 'pageContentModule', 'readingListServiceModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/book/:id', {
    templateUrl: 'pages/book/book.html',
    controller: 'BookController'
  })
  .when('/book/read/:id', {
    templateUrl: 'pages/book/readBook.html',
    controller: 'ReadController'
  })
  .when('/books/:genre/:id', {
    templateUrl: 'pages/book/bookByGenre.html',
    controller: 'BookByGenreController'
  })
  .when('/book/author/:id', {
    templateUrl: 'pages/book/bookByAuthor.html',
    controller: 'BookByAuthorController'
  });
}])

.controller('BookController', ['$scope','$routeParams', 'Book', function($scope, $routeParams, Book) {
var period = sessionStorage.getItem('period');

 if(period == 'null' || period == null || period == 1){
    $scope.disableButton = true;
    $scope.subscription = "Your subscription is over.";
 }
 else
 {
    $scope.disableButton = false;
    $scope.subscription = "";
} 

  var bookId = $routeParams.id;
  Book.getBook(bookId).then(function(response) {
    $scope.book = response.data;
  });
}])
.controller('ReadController', ['$scope','$routeParams', '$location', 'Book', 'ReadingList', function($scope, $routeParams, $location, Book, ReadingList) {
  var bookId = $routeParams.id;

  $scope.bookId = bookId;
  $scope.page = 1;
  $scope.newPage = 1;

  Book.getGeneralInfo(bookId).then(function(response){
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
        $scope.message = reason.data.message;
      } else if (reason.status == 401) {
        $location.path('/users/sign-in');
      }
    });
  }, function(reason) {
    // rejection
    if (reason.status == 500) {
      $scope.message = reason.data.message;
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
        $scope.message = reason.data.message;
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
        $scope.message = reason.data.message;
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
        $scope.message = reason.data.message;
      } else if (reason.status == 401) {
        $location.path('/users/sign-in');
      }
    });
  };


}])

.controller('BookByGenreController', ['$scope','$routeParams','Book', function($scope, $routeParams, Book) {
  var genreId =  $routeParams.id;
  $scope.genreName = $routeParams.genre;
  
  Book.getBooksByGenre(genreId).then(function(response) {
    $scope.books = response.data;
    if ($scope.books == "")
      $scope.messageNoResults = "No books in " + $scope.genreName + " genre.";
  });
}])

.controller('BookByAuthorController', ['$scope','$routeParams','Book', function($scope, $routeParams, Book) {
  var authorID =  $routeParams.id;
  
  Book.getBooksByAuthor(authorID).then(function(response) {
    $scope.author = response.data.author;
    $scope.books = response.data.books;
  });
}]);