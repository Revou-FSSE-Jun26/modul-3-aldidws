const form = document.querySelector(".contact-form");
const status = document.createElement("p");
status.setAttribute("role", "status");
form.append(status);

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
        status.textContent = "Please fill every field with a valid email.";
        return;
    }
    status.textContent = "Thanks! Your message was received.";
    form.reset();
});
