// Hamburger Menu Functions
function openMenu() {
    document.getElementById("menuOverlay").classList.add("active");
    document.body.classList.add("menu-open");
}

function closeMenu() {
    document.getElementById("menuOverlay").classList.remove("active");
    document.body.classList.remove("menu-open");
}

// Toggle Profile Dropdown
function toggleProfile() {
    const dropdown = document.getElementById("profileDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Seller Login Modal
function showLoginForm() {
    closeMenu();
    document.getElementById("loginModal").style.display = "flex";
}

function closeLoginForm() {
    document.getElementById("loginModal").style.display = "none";
}

// WhatsApp Purchase
function buyOnWhatsApp(productName, price) {
    const message = `Hi, I want to buy:\nProduct: ${productName}\nPrice: ${price}\nLink: ${window.location.href}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/YOUR_WHATSAPP_NUMBER?text=${encodedMessage}`, '_blank');
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    // Hamburger menu
    document.querySelector(".hamburger-icon")?.addEventListener("click", openMenu);
    
    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
        const menu = document.getElementById("menuOverlay");
        const hamburgerIcon = document.querySelector(".hamburger-icon");
        
        if (!menu?.contains(event.target) && event.target !== hamburgerIcon) {
            closeMenu();
        }
    });

    // Menu links
    document.querySelectorAll(".menu-items a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    // Login modal
    window.onclick = (event) => {
        const modal = document.getElementById("loginModal");
        if (event.target === modal) modal.style.display = "none";
    };

    // Seller login form
    document.getElementById('sellerLoginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('sellerUsername').value;
        const password = document.getElementById('sellerPassword').value;

        try {
            const response = await fetch('/api/sellers/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('sellerToken', data.token);
                window.location.href = '/seller.html';
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Server error');
        }
    });
});