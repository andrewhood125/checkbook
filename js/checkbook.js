angular.module('checkbook', ['angularMoment'])
  .controller('CheckbookController', function($filter, $scope) {

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
  });
