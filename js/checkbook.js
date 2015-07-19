angular.module('checkbook', ['angularMoment', 'chart.js'])
  .controller('CheckbookController', function($filter, $scope) {

    $scope.labels = [];

    $scope.generateLabels = function(days) {
      var days = days || 7;
      for(var i = 0; i < days; i+=2) {
        $scope.labels.push(moment().add(i, 'days').format('ll'));
      }
    }


    $scope.series = [];

    $scope.generateSeries = function() {
      for(var i = 0; i < $scope.accounts.length; i++) {
        $scope.series.push($scope.accounts[i].name);
      }
    };


    $scope.generateData = function() {
      $scope.data = new Array($scope.accounts.length);
      for(var i = 0; i < $scope.accounts.length; i++) {
        $scope.data[i] = new Array();
      }

      for(var i = 0; i < $scope.labels.length; i++) {
        for(var j = 0; j < $scope.accounts.length; j++) {
          var account = $scope.accounts[j];
          $scope.data[j].push($scope.getBalanceOn($scope.labels[i], account));
        }
      }
    };


    $scope.getBalanceOn = function(string_date, account) {
      date = moment(string_date).add(1, 'day');
      var balance = account.balance;
      var orderedTransactions = $filter('orderBy')($scope.transactions, '-date', true);

      for(var i = 0; moment(orderedTransactions[i].date).isBefore(date); i++) {
        var transaction = orderedTransactions[i];
        if(transaction.account.name === account.name) {
          balance += transaction.amount;
        }
      }

      return balance.toFixed(2);
    };

    $scope.transactions = [];
    $scope.accounts = [];

    $scope.lastSavedAt = "Never";

    $scope.newAccount = {};

    $scope.resetNewTransaction = function() {
      $scope.newTransaction = {
        date: moment().format('MM/DD/YYYY')
      };
    };

    $scope.addAccount = function() {
      $scope.accounts.push($scope.newAccount);
      $scope.newAccount = {};
      $scope.save();
    };

    $scope.addTransaction = function() {
      $scope.transactions.push($scope.newTransaction);
      $scope.resetNewTransaction();
      $scope.save();
    }

    $scope.toggleEdit = function(obj) {
      obj.editing = !obj.editing;
    };

    $scope.getBalance = function(account, index) {
      var orderedTransactions = $filter('orderBy')($scope.transactions, '-date', true);
      var _account = $scope.accounts.find(function(element, index, array) {
        if (element.name == account.name) {
          return element;
        }
      });
      var sum = _account.balance;
      for (var i = 0; i <= index; i++) {
        if (orderedTransactions[i].account.name == _account.name) {
          sum += orderedTransactions[i].amount;
        }
      }
      return sum;
    };

    $scope.repeatTransaction = function(transaction, days) {
      var unit = days > 0 ? 'days' : 'months';
      var amount = days || 1;
      var date = moment(new Date(transaction.date)).add(amount, unit);
      $scope.newTransaction = {
        date: date.format('MM/DD/YYYY'),
        amount: transaction.amount,
        description: transaction.description,
        account: transaction.account
      };
      $scope.addTransaction();
    };

    $scope.removeAccount = function(account) {
      var index = $scope.accounts.indexOf(account);
      if (index > -1) {
        $scope.accounts.splice(index, 1);
      }
      $scope.save();
    };

    $scope.removeTransaction = function(transaction) {
      var index = $scope.transactions.indexOf(transaction);
      if (index > -1) {
        $scope.transactions.splice(index, 1);
      }
      $scope.save();
    };

    $scope.clearTransaction = function(transaction) {
      var account = $scope.accounts.find(function(element, index, array) {
        if (element.name == transaction.account.name)
          return element;
      });
      account.balance += transaction.amount;
      $scope.removeTransaction(transaction);
    }

    $scope.save = function() {
      localStorage.setItem('transactions', JSON.stringify($scope.transactions));
      localStorage.setItem('accounts', JSON.stringify($scope.accounts));
      $scope.lastSavedAt = moment();
      $scope.saved = true;
    };

    $scope.export = function() {
      $scope.save();
      $scope.rawTransactions = localStorage.getItem('transactions');
      $scope.rawAccounts = localStorage.getItem('accounts');
    };

    $scope.import = function() {
      localStorage.setItem('transactions', $scope.rawTransactions);
      localStorage.setItem('accounts', $scope.rawAccounts);
      $scope.load();
    };

    $scope.load = function() {
      $scope.transactions = JSON.parse(localStorage.getItem('transactions'));
      $scope.accounts = JSON.parse(localStorage.getItem('accounts'));
    };

    // on load
    $scope.load();
    $scope.resetNewTransaction();
    $scope.generateSeries();
    $scope.generateLabels(120);
    $scope.generateData();
  });
