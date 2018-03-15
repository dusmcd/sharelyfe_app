/*global $ */

console.log('scripts are running on client side');
// console.log(document.querySelector('#terms-conditions'));

function validateForm() {
    let checkBox = document.querySelector('#terms-conditions');
    let formErrors = document.querySelector('.form-errors');
    let isValid = true;
    let htmlString = '';
    
    if (!checkBox.checked) {
        alert('Must agree to the terms and conditions!');
        isValid = false;
    }
    if (document.querySelector('#first-name').value === '') {
        htmlString += '<li>First name is a required field</li>';
        isValid = false;
    }
    if (document.querySelector('#last-name').value === '') {
        htmlString += '<li>Last name is a required field</li>';
        isValid = false;
    }
    if (document.querySelector('#email').value === '') {
        htmlString += '<li>Email is a required field</li>';
        isValid = false;
    }
    if (document.querySelector('#username').value === '') {
        htmlString += '<li>Username is a required field</li>';
        isValid = false;
    }
    if (document.querySelector('#password').value === '') {
        htmlString += '<li>Password is a required field</li>';
        isValid = false;
    }
    
    formErrors.innerHTML = htmlString;
    return isValid;
}