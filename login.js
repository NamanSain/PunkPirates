// Login Page Interactive Logic & Clearance Simulation

const demoAccounts = {
    pirate: {
        id: 'luffy@strawhat.sea',
        pass: 'GomuGomu3000M',
        role: 'Straw Hat Luffy (Captain)',
        ship: 'Thousand Sunny'
    },
    shipwright: {
        id: 'iceburg@galley-la.water7',
        pass: 'MayorWater7Dock1',
        role: 'Iceburg (Galley-La Mayor & Master Shipwright)',
        ship: 'Water 7 Port Master'
    },
    marine: {
        id: 'smoker@g5.marines.gov',
        pass: 'WhiteHunterG5Marine',
        role: 'Smoker (G-5 Vice Admiral)',
        ship: 'Marine Warship 07'
    }
};

function selectDemoUser(type) {
    // Update active chip UI
    document.querySelectorAll('.demo-chip').forEach(chip => chip.classList.remove('active'));
    const activeChip = document.getElementById(
        type === 'pirate' ? 'demoPirate' : (type === 'shipwright' ? 'demoShipwright' : 'demoMarine')
    );
    if (activeChip) activeChip.classList.add('active');

    const account = demoAccounts[type];
    if (account) {
        const idInput = document.getElementById('userIdentifier');
        const passInput = document.getElementById('userPasskey');
        
        // Add subtle focus glow animation
        idInput.value = account.id;
        passInput.value = account.pass;
        
        showToast(`Loaded ${account.role} credentials!`);
    }
}

function togglePasswordVisibility() {
    const passInput = document.getElementById('userPasskey');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passInput.type === 'password') {
        passInput.type = 'text';
        eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
    } else {
        passInput.type = 'password';
        eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
}

function handleLoginSubmit(event) {
    event.preventDefault();
    
    const idInput = document.getElementById('userIdentifier').value.trim();
    const passInput = document.getElementById('userPasskey').value.trim();
    const alertBox = document.getElementById('authAlert');
    const submitBtn = document.getElementById('submitLoginBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    const btnArrow = submitBtn.querySelector('.btn-arrow');
    
    if (!idInput || !passInput) {
        alertBox.className = 'auth-alert alert-error';
        alertBox.textContent = 'Please provide both your Transponder ID and Secret Passkey.';
        alertBox.classList.remove('hidden');
        return;
    }

    // UI Loading State
    submitBtn.disabled = true;
    btnText.textContent = 'Contacting Den Den Mushi...';
    btnSpinner.classList.remove('hidden');
    btnArrow.classList.add('hidden');
    alertBox.classList.add('hidden');

    // Simulate Network Request with Den Den Mushi Security Clearance
    setTimeout(() => {
        btnText.textContent = 'Verifying Dock Clearance...';
        
        setTimeout(() => {
            // Success state
            btnText.textContent = 'Port Clearance Granted!';
            submitBtn.style.backgroundColor = '#10b981';
            btnSpinner.classList.add('hidden');
            
            alertBox.className = 'auth-alert alert-success';
            alertBox.innerHTML = `<strong>Clearance Approved!</strong> Welcome to Water 7. Redirecting to harbor dashboard...`;
            alertBox.classList.remove('hidden');

            // Save user session
            localStorage.setItem('dockseven_user', JSON.stringify({
                identifier: idInput,
                loggedInAt: new Date().toISOString(),
                status: 'Verified Fleet Master'
            }));

            // Smooth redirect back to home page
            setTimeout(() => {
                if (window.smoothNavigate) {
                    window.smoothNavigate('index.html');
                } else {
                    window.location.href = 'index.html';
                }
            }, 1200);

        }, 800);
    }, 900);
}

function handleForgotPass(event) {
    event.preventDefault();
    showToast('A secure carrier Den Den Mushi has been dispatched to your fleet.');
}

function handleDemoSignup(event) {
    event.preventDefault();
    showToast('New vessel registry is open! Use the quick demo credentials above to test clearance.');
}

function showToast(message) {
    const toast = document.getElementById('authToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}
