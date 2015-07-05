angular.module('checkbook', [])
  .controller('CheckbookController', function($filter) {
    var self = this;

    self.startingBalance = 0;
    self.date = moment().format('MM/DD/YYYY');
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

    self.repeatTransaction = function(transaction, days) {
      var unit = days > 0 ? 'days' : 'months';
      var amount = days || 1;
      var date = moment(new Date(transaction.date)).add(amount, unit);
      self.date = date.format('MM/DD/YYYY');
      self.amount = transaction.amount;
      self.description = transaction.description;
    };

    self.removeTransaction = function(transaction) {
      var index = self.transactions.indexOf(transaction);
      if (index > -1) {
        self.transactions.splice(index, 1);
      }
    };

    self.save = function() {
      localStorage.setItem('startingBalance', JSON.stringify(self.startingBalance));
      localStorage.setItem('transactions', JSON.stringify(self.transactions));
    };

    self.load = function() {
      self.startingBalance = JSON.parse(localStorage.getItem('startingBalance'));
      self.transactions = JSON.parse(localStorage.getItem('transactions'));
    };

    // on load
    self.load();
  });
