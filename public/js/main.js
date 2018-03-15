console.log('scripts are running on client side');
// console.log(document.querySelector('#terms-conditions'));

function validateForm() {
    let checkBox = document.querySelector('#terms-conditions');
    
    if (!checkBox.checked) {
        alert('Must agree to the terms and conditions!');
        return false;
    }
}