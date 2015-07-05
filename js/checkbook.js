angular.module('checkbook', [])
  .controller('CheckbookController', function($filter) {
    var self = this;

    self.date = moment().format('MM/DD/YYYY');
    self.transactions = [];
    self.accounts = [];

    self.newAccount = {};
    self.newTransaction = {};

    self.addAccount = function() {
      self.accounts.push(self.newAccount);
      self.newAccount = {};
      self.save();
    };

    self.addTransaction = function() {
      self.transactions.push(self.newTransaction);
      self.newTransaction = {};
      self.save();
    }

    self.toggleEdit = function(obj) {
      obj.editing = !obj.editing;
    };

    self.getBalance = function(account, index) {
      var orderedTransactions = $filter('orderBy')(self.transactions, '-date', true);
      var sum = account.balance
      for (var i = 0; i <= index; i++) {
        if (orderedTransactions[i].account == account) {
          sum += orderedTransactions[i].amount;
        }
      }
      return sum;
    };

    self.repeatTransaction = function(transaction, days) {
      var unit = days > 0 ? 'days' : 'months';
      var amount = days || 1;
      var date = moment(new Date(transaction.date)).add(amount, unit);
      self.newTransaction = {
        date: date.format('MM/DD/YYYY'),
        amount: transaction.amount,
        description: transaction.description,
        account: transaction.account
      };
    };

    self.removeAccount = function(account) {
      var index = self.accounts.indexOf(account);
      if (index > -1) {
        self.accounts.splice(index, 1);
      }
      self.save();
    };

    self.removeTransaction = function(transaction) {
      var index = self.transactions.indexOf(transaction);
      if (index > -1) {
        self.transactions.splice(index, 1);
      }
      self.save();
    };

    self.clearTransaction = function(transaction) {
      var account = self.accounts.find(function(element, index, array) {
        if (element.name == transaction.account.name)
          return element;
      });
      account.balance += transaction.amount;
      self.removeTransaction(transaction);
    }

    self.save = function() {
      localStorage.setItem('transactions', JSON.stringify(self.transactions));
      localStorage.setItem('accounts', JSON.stringify(self.accounts));
    };

    self.load = function() {
      self.transactions = JSON.parse(localStorage.getItem('transactions'));
      self.accounts = JSON.parse(localStorage.getItem('accounts'));
    };

    // on load
    self.load();
  });
