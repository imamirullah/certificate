let counter = 451;

document.getElementById("generateButton").addEventListener("click", async function () {
  const name = document.getElementById("nameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();

  // Clear previous error messages
  document.querySelectorAll(".error").forEach((error) => (error.textContent = ""));

  // Validation
  let isValid = true;
  if (!name) {
    document.getElementById("nameError").textContent = "Name is required.";
    isValid = false;
  }
  if (!email) {
    document.getElementById("emailError").textContent = "Email is required.";
    isValid = false;
  }
  if (!phone) {
    document.getElementById("phoneError").textContent = "Phone number is required.";
    isValid = false;
  }

  if (!isValid) return;

  // Send data to the server
  // let cerficateno = `UC / 2025 / 01 / ${counter}`
  try {
    const response = await fetch('http://localhost:5000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone })
    });
    
    const data = await response.json();
    
    console.log("certificate number =",response,data)
    if (response.ok) {
      // Update the certificate details
      document.getElementById("userName").textContent = data.data.name;
    
      document.getElementById("Uc").textContent = data.data.cerficateno;
      

      // Show the certificate and download button
      document.getElementById("certificate").style.display = "block";
      document.getElementById("downloadButton").style.display = "inline-block";

      // Hide the form
      document.getElementById("certificateForm").style.display = "none";
    } else {
      console.log("else is running",response,data)
      alert(data.message || 'Error generating certificate');
      document.getElementById("userName").textContent = data.data.name;
    
      document.getElementById("Uc").textContent = data.data.cerficateno;
      

      // Show the certificate and download button
      document.getElementById("certificate").style.display = "block";
      document.getElementById("downloadButton").style.display = "inline-block";

      // Hide the form
      document.getElementById("certificateForm").style.display = "none";
    }
  } catch (error) {

    console.error('Error sending data:', error);
    alert('An error occurred while generating the certificate.');
  }
});

document.getElementById("downloadButton").addEventListener("click", function () {
  const certificate = document.getElementById("certificate");

  // Use html2pdf.js to download the certificate as a PDF
  html2pdf()
    .from(certificate)
    .save('certificate.pdf')
    .then(() => {
      // Show the form again after download
      document.getElementById("certificateForm").style.display = "block";
      document.getElementById("certificate").style.display = "none";
      document.getElementById("downloadButton").style.display = "none";
    });
});
