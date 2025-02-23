// registration section
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const first_name = document.getElementById("register-firstname").value;
            const last_name = document.getElementById("register-lastname").value;
            const email = document.getElementById("register-email").value;
            const password = document.getElementById("register-password").value;

            const res = await fetch("http://localhost:5000/registration", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ first_name, last_name, email, password })
            });

            const data = await res.json();
            alert(data.message);
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            alert(data.message);
        });
    }
}); 

// Function to generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

let tempOTP = ""; // Store OTP temporarily
let resetEmail = ""; // Store email temporarily

// Send OTP
document.getElementById("send-otp-btn")?.addEventListener("click", function() {
    resetEmail = document.getElementById("forgot-email").value;
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.email === resetEmail);

    if (!user) {
        alert("No account found with this email.");
        return;
    }

    tempOTP = generateOTP();
    localStorage.setItem("resetOTP", tempOTP);
    alert(`Your OTP is: ${tempOTP}`); // In real-world applications, this would be emailed.

    document.getElementById("otp-section").style.display = "block";
});

// Verify OTP
document.getElementById("verify-otp-btn")?.addEventListener("click", function() {
    let enteredOTP = document.getElementById("otp-input").value;
    let storedOTP = localStorage.getItem("resetOTP");

    if (enteredOTP === storedOTP) {
        alert("OTP Verified! Set a new password.");
        document.getElementById("otp-section").style.display = "none";
        document.getElementById("new-password-section").style.display = "block";
    } else {
        alert("Invalid OTP. Try again.");
    }
});

// Update Password
document.getElementById("forgot-password-form")?.addEventListener("submit", function(event) {
    event.preventDefault();

    let newPassword = document.getElementById("new-password").value;
    let confirmPassword = document.getElementById("confirm-password").value;
    
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.email === resetEmail);

    if (user) {
        user.password = newPassword;
        localStorage.setItem("users", JSON.stringify(users));
        alert("Password updated successfully! Please login.");
        localStorage.removeItem("resetOTP");
        window.location.href = "login.html";
    }
});


// Register User
document.getElementById("register-form")?.addEventListener("submit", function(event) {
    event.preventDefault();
    const firstName = document.getElementById("register-firstname").value;
    const lastName = document.getElementById("register-lastname").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user already exists
    if (users.some(user => user.email === email)) {
        alert("Email already registered! Please log in.");
        return;
    }

    users.push({ firstName, lastName, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration Successful!");
    window.location.href = "login.html";
});

// Login User
document.getElementById("login-form")?.addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert("Login Successful! Redirecting...");
        localStorage.setItem("loggedInUser", JSON.stringify(user)); // Store logged-in user
        window.location.href = "index.html";
    } else {
        alert("Invalid Credentials");
    }
});


////////////

  document.addEventListener("DOMContentLoaded", function () {
        // Check login status (Replace with actual authentication logic)
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        // Dashboard Click Event
        document.getElementById("dashboard-link").addEventListener("click", function (event) {
            if (!isLoggedIn) {
                event.preventDefault(); // Prevent navigation
                showNotification("⚠️ You must be logged in to access the Dashboard!");
            } else {
                window.location.href = "index.html"; // Redirect if logged in
            }
        });

        // Logout Button
        document.getElementById("logout-btn").addEventListener("click", function () {
            localStorage.removeItem("isLoggedIn"); // Remove session
            window.location.href = "login.html"; // Redirect to login page
        });
    });

    // Function to Show Notification
    function showNotification(message) {
        const notification = document.getElementById("notification");
        notification.textContent = message;
        notification.classList.remove("hidden");
        setTimeout(() => {
            notification.classList.add("hidden");
        }, 3000); // Hide after 3 seconds
    }

    document.addEventListener("DOMContentLoaded", function () {
        // Now safely add event listeners after the DOM has loaded
        const dashboardLink = document.getElementById("dashboard-link");
        if (dashboardLink) {
            dashboardLink.addEventListener("click", function (event) {
                // Your event handling code
            });
        } else {
            console.log('Dashboard link not found!');
        }
    });
    

    document.addEventListener("DOMContentLoaded", function () {
        fetch("navbar.html")
            .then(response => response.text())
            .then(data => {
                document.getElementById("navbar-container").innerHTML = data;
    
                // Highlight Active Link
                document.querySelectorAll('.nav-links a').forEach(link => {
                    if (link.href === window.location.href) {
                        link.classList.add('active');
                    }
                });
    
                // Add Dropdown Toggle Functionality
                document.getElementById('user-btn').addEventListener('click', () => {
                    document.getElementById('dropdown').classList.toggle('show');
                });
    
                // Close dropdown when clicking outside
                window.addEventListener('click', (e) => {
                    if (!e.target.matches('#user-btn')) {
                        document.getElementById('dropdown').classList.remove('show');
                    }
                });
            });
    });

  
   





   
    