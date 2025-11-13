const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const totalAmountElement = document.getElementById('totalAmount');


const activeUserEmail = localStorage.getItem('activeUserEmail');

if (!activeUserEmail) {

    alert('You must be logged in to use the app.');
    window.location.href = 'login.html';
}

const expensesKey = 'expenses_' + activeUserEmail;

let expenses = JSON.parse(localStorage.getItem(expensesKey)) || [];


function init() {
   
    
    
    renderExpenses();
    updateTotal();
}


function addExpense(description, amount, category, date) {
    const expense = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        category,
        date: date || new Date().toISOString().split('T')[0]
    };
    
    expenses.push(expense);
    saveExpenses();
    renderExpenses();
    updateTotal();
}


function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveExpenses();
    renderExpenses();
    updateTotal();
}


function saveExpenses() {
   
    localStorage.setItem(expensesKey, JSON.stringify(expenses));
}


function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmountElement.textContent = total.toFixed(2);
}


function renderExpenses() {
    if (expenses.length === 0) {
        expenseList.innerHTML = `
            <div class="empty-state">
                <p>No expenses added yet.</p>
                <p>Click "Add Expense" to get started!</p>
            </div>
        `;
        return;
    }

    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    expenseList.innerHTML = sortedExpenses.map(expense => `
        <div class="expense-item">
            <div class="expense-info">
                <div class="expense-description">${expense.description}</div>
                <div class="expense-meta">
                    <span class="expense-category category-${expense.category}">${expense.category}</span>
                    <span>${new Date(expense.date).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
        </div>
    `).join('');
}


expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const description = document.getElementById('description').value.trim();
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    
    if (!description || !amount || !category || !date) {
        alert('Please fill in all fields');
        return;
    }
    
    addExpense(description, amount, category, date);

    expenseForm.reset();
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('description').focus();
});

document.addEventListener('DOMContentLoaded', init);


document.getElementById('logoutButton').addEventListener('click', function() {
    
    localStorage.removeItem('activeUserEmail');
    
    alert('You have been logged out.');
    
    window.location.href = 'login.html';
});