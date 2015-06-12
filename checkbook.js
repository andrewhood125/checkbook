angular.module('checkbook', ['ngCookies'])
  .controller('CheckbookController', function($filter, $cookies) {
    var self = this;

    self.startingBalance = 0;
    self.runningAmount = 0;
    self.transactions = [];

    self.saveTransaction = function() {
      // balance of last transaction or starting balance
      var _balance = self.transactions.length ? self.transactions[self.transactions.length - 1].balance : self.startingBalance;
      _balance += self.amount;

      self.transactions.push({
        date: self.date,
        description: self.description,
        amount: self.amount,
        editing: false,
        balance: _balance
      });

      self.description = "";
      self.amount = "";
    }

    self.toggleEditTransaction = function(transaction) {
      transaction.editing = !transaction.editing;
    };

    self.getBalance = function(index) {
      var orderedTransactions = $filter('orderBy')(self.transactions, '-date', true);
      var sum = self.startingBalance;
      for (var i = 0; i <= index; i++) {
        sum += orderedTransactions[i].amount;
      }
      return sum;
    };

    self.repeatTransaction = function(transaction) {
      var explodedDate = transaction.date.split("/");
      var month = parseInt(explodedDate[0]);
      var buffer = "";
      if(++month < 10) {
        buffer = "0";
      }
      self.date = buffer + month + "/" + explodedDate[1] + "/" + explodedDate[2];
      self.description = transaction.description;
      self.amount = transaction.amount;
    };

    self.removeTransaction = function(transaction) {
      var index = self.transactions.indexOf(transaction);
      if (index > -1) {
        self.transactions.splice(index, 1);
      }
    };

    self.save = function() {
      var expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 30);

      var options = {
        'expires': expireDate
      };

      $cookies.putObject('startingBalance', self.startingBalance, options);
      $cookies.putObject('transactions', self.transactions, options);
    };

    self.load = function() {
      self.startingBalance = $cookies.getObject('startingBalance');
      self.transactions = $cookies.getObject('transactions');
    };
  });
