(() => {
  'use strict';

  const form = document.getElementById('contactForm');
  const inputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    message: document.getElementById('message'),
  };
  const errors = {
    name: document.getElementById('error-name'),
    email: document.getElementById('error-email'),
    phone: document.getElementById('error-phone'),
    message: document.getElementById('error-message'),
  };
  const successMessage = document.getElementById('successMessage');
  const submitBtn = form.querySelector('button[type="submit"]');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/;

  function debounce(fn, wait=200){
    let timeout;
    return function(...args){
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function showError(field, msg){
    errors[field].textContent = msg;
    errors[field].classList.add('active');
    inputs[field].setAttribute('aria-invalid', 'true');
  }

  function clearError(field){
    errors[field].textContent = '';
    errors[field].classList.remove('active');
    inputs[field].removeAttribute('aria-invalid');
  }

  function validateName(){
    const val = inputs.name.value.trim();
    if(val.length === 0) {
      showError('name', 'Name cannot be empty');
      return false;
    }
    if(val.length < 2){
      showError('name', 'Name must be at least 2 characters');
      return false;
    }
    clearError('name');
    return true;
  }

  function validateEmail(){
    const val = inputs.email.value.trim();
    if(val.length === 0) {
      showError('email', 'Email cannot be empty');
      return false;
    }
    if(!emailPattern.test(val)){
      showError('email', 'Enter a valid email address');
      return false;
    }
    clearError('email');
    return true;
  }

  function validatePhone(){
    const val = inputs.phone.value.trim();
    if(val.length === 0) {
      clearError('phone'); // optional field
      return true;
    }
    if(!phonePattern.test(val)){
      showError('phone', 'Enter a valid phone number');
      return false;
    }
    clearError('phone');
    return true;
  }

  function validateMessage(){
    const val = inputs.message.value.trim();
    if(val.length === 0){
      showError('message', 'Message cannot be empty');
      return false;
    }
    if(val.length < 10){
      showError('message', 'Message should be at least 10 characters');
      return false;
    }
    clearError('message');
    return true;
  }

  function validateAll(){
    const validName = validateName();
    const validEmail = validateEmail();
    const validPhone = validatePhone();
    const validMessage = validateMessage();
    return validName && validEmail && validPhone && validMessage;
  }

  // Real-time debounced validation for inputs
  inputs.name.addEventListener('input', debounce(validateName));
  inputs.email.addEventListener('input', debounce(validateEmail));
  inputs.phone.addEventListener('input', debounce(validatePhone));
  inputs.message.addEventListener('input', debounce(validateMessage));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    successMessage.classList.remove('active');
    successMessage.textContent = successMessage.innerHTML; // for animation reset

    if(!validateAll()){
      form.setAttribute('aria-busy', 'false');
      enableInputs(true);
      return;
    }

    // Disable inputs and show busy state
    form.setAttribute('aria-busy', 'true');
    enableInputs(false);
    submitBtn.disabled = true;
    submitBtn.classList.add('morphing');

    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Show success
    successMessage.classList.add('active');
    successMessage.textContent = '';
    successMessage.innerHTML = `
      <svg viewBox="0 0 24 24" >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Message sent successfully!
    `;

    form.reset();
    ['name', 'email', 'phone', 'message'].forEach(clearError);

    setTimeout(() => {
      form.setAttribute('aria-busy', 'false');
      enableInputs(true);
      submitBtn.disabled = false;
      submitBtn.classList.remove('morphing');
    }, 1200);
  });

  function enableInputs(enable){
    Object.values(inputs).forEach(input => {
      input.disabled = !enable;
    });
  }
})();
