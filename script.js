const form = document.getElementById("waitlist-form");
const message = document.getElementById("message");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();

  if (email && email.includes("@")) {
    message.style.color = "#00bcd4";
    message.textContent = "✅ Thank you! You’ve been added to the waitlist.";
    form.reset();
  } else {
    message.style.color = "red";
    message.textContent = "Please enter a valid email address.";
  }

  setTimeout(() => {
    message.textContent = "";
  }, 4000);
});

// Floating Contact Widget Toggle
const contactToggle = document.getElementById("contactToggle");
const contactOptions = document.getElementById("contactOptions");

if (contactToggle && contactOptions) {
  contactToggle.addEventListener("click", () => {
    contactOptions.classList.toggle("show");
  });
}
// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});
const form = document.getElementById("waitlist-form");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();

  if (!email || !email.includes("@")) {
    message.style.color = "red";
    message.textContent = "Please enter a valid email address.";
    return;
  }

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      message.style.color = "#00bcd4";
      message.textContent = "✅ Thank you! You’re now on the waitlist.";
      form.reset();
    } else {
      message.style.color = "red";
      message.textContent = "Something went wrong. Please try again.";
    }
  } catch (err) {
    message.style.color = "red";
    message.textContent = "Network error. Please try again.";
  }

  setTimeout(() => (message.textContent = ""), 5000);
});

