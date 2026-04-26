
document.getElementById("contactForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = {
    name: this.name.value,
    email: this.email.value,
    message: this.message.value
  };

  const response = await fetch("https://formspree.io/f/xyzbjpbq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

  if (response.ok) {
    alert("Message sent successfully!");
    this.reset();
  } else {
    alert("Error sending message. Try again.");
  }
});
