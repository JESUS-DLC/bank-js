'use strict'

const account1 = {
    owner: 'Nick Tomas',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  
    movementsDates: [
      '2019-11-18T21:31:17.178Z',
      '2019-12-23T07:42:02.383Z',
      '2020-01-28T09:15:04.904Z',
      '2020-04-01T10:17:24.185Z',
      '2020-05-08T14:11:59.604Z',
      '2020-05-27T17:01:17.194Z',
      '2020-07-11T23:36:17.929Z',
      '2020-07-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
  };
  
  const account2 = {
    owner: 'Sofia Stone',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  
    movementsDates: [
      '2019-11-01T13:15:33.035Z',
      '2019-11-30T09:48:16.867Z',
      '2019-12-25T06:04:23.907Z',
      '2020-01-25T14:18:46.235Z',
      '2020-02-05T16:33:06.386Z',
      '2020-04-10T14:43:26.374Z',
      '2020-06-25T18:49:59.371Z',
      '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
  };
  

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.balance__date');
const labelBalance = document.querySelector('#balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.session__value');

const containerApp = document.querySelector('#containerApp');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.getElementById('login');
const btnTransfer = document.querySelector('#btn--transfer');
const btnLoan = document.querySelector('#btn--loan');
const btnClose = document.querySelector('#btn--close');
const btnSort = document.querySelector('#btn--sort');

const inputLoginUsername = document.getElementById('username');
const inputLoginPin = document.getElementById('pin');
const inputTransferTo = document.getElementById('input--to');
const inputTransferAmount = document.getElementById('input--amount');
const inputLoanAmount = document.getElementById('input--loan-amount');
const inputCloseUsername = document.getElementById('input--user');
const inputClosePin = document.getElementById('input--pin');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const createUsernames = function (accounts) {
    accounts.forEach(account => {
        account.username = account.owner.toLowerCase().split(' ').map(x => x[0]).join('');
    });
}

createUsernames(accounts);

const createMovements = function (movements, sortStatus) {
    while (containerMovements.firstChild) {
        containerMovements.removeChild(containerMovements.firstChild);
    };
    const movs = sortStatus ? movements.slice().sort((a, b) => a - b) : movements;
    movs.forEach((movement, i) => {
        const html = `
        <div class="movements__row">
            <div class="movements__type movements__type${movement > 0 ? '--deposit' : '--withdrawal'}">${i + 1} ${movement > 0 ? 'deposito' : 'retiro'} </div>
            <p class="movements__date">17/03/23</p>
            <p class="movements__value">$${Math.abs(movement)}</p>
        </div>
        `;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
}

const calcDisplayBalance = function (account) {
    const balance = account.movements.reduce((accum, mov) => {
        return accum + mov;
    }, 0);
    account.balance = balance;
    labelBalance.textContent = '$' + balance;
}


const calcDisplaySummary = function (movements, interestRate) {
    const incomes = movements.filter(mov => mov > 0).reduce((accum, value) => accum + value, 0);
    labelSumIn.textContent = incomes;
    const outcomes = movements.filter(mov => mov < 0).reduce((accum, value) => accum + value, 0);
    labelSumOut.textContent = Math.abs(outcomes);
    const interest = movements.filter(mov => mov > 0).map(mov => (mov * interestRate) / 100).filter(int => int >= 1).reduce((accum, value) => accum + value, 0);
    labelSumInterest.textContent = interest;
}

const updateUI = function (currentAccount) {
    createMovements(currentAccount.movements)
    calcDisplayBalance(currentAccount)
    calcDisplaySummary(currentAccount.movements, currentAccount.interestRate)
}

let currentAccount;


btnLogin.addEventListener('click', () => {
    currentAccount = accounts.find(acc => acc.username == inputLoginUsername.value);
    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        labelWelcome.textContent = `bienvenido ${currentAccount.owner.split(' ')[0]}`;
        containerApp.classList.add('active');
        inputLoginUsername.value = inputLoginPin.value = '';
        updateUI(currentAccount);
    }
})


btnTransfer.addEventListener('click', () => {
    const ammount = Number(inputTransferAmount.value);
    const transferAccount = accounts.find(account => account.username === inputTransferTo.value)
    if (ammount > 0 && transferAccount?.username !== currentAccount.username && ammount <= currentAccount.balance) {
        transferAccount.movements.push(ammount);
        currentAccount.movements.push(-ammount);
        inputTransferTo.value = inputTransferAmount.value = '';
        updateUI(currentAccount);
    }
})

btnLoan.addEventListener('click', () => {
    const amount = Number(inputLoanAmount.value);
    if (amount > 0 && currentAccount.movements.some(mov => mov >= (amount * .10))) {
        currentAccount.movements.push(amount);
        inputLoanAmount.value = '';
        updateUI(currentAccount);
    }
})

let sortStatus = false;
btnSort.addEventListener('click', () => {
    createMovements(currentAccount.movements, !sortStatus);
    sortStatus = !sortStatus;
})

btnClose.addEventListener('click', () => {
    if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
        let index = accounts.findIndex(account => account.username === currentAccount.username);
        accounts.splice(index, 1)
        containerApp.classList.remove('active');
    }
    inputCloseUsername.value = inputClosePin.value = '';
})
