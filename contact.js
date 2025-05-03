document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
  
      alert(`Your message has been sent successfully, ${name}!\nEmail: ${email}\nMessage: ${message}`);
      form.reset();
    });
  });
  