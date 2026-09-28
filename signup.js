// Dynamic Sign Up Form Logic & Faction Theme Customizer

const watermarks = {
    marine: `
        <svg class="watermark-svg marine-svg" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <path d="M50 85 V20 M30 35 L50 20 L70 35 M20 50 C20 75 80 75 80 50" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="50" cy="18" r="6" stroke-width="2.5"/>
            <path d="M15 35 C25 25 35 45 50 30 C65 45 75 25 85 35" stroke-width="2.2" stroke-linecap="round"/>
            <text x="50" y="96" text-anchor="middle" font-size="8" font-family="'Outfit', sans-serif" font-weight="bold" fill="currentColor" stroke="none">正 義 • ABSOLUTE JUSTICE</text>
        </svg>
    `,
    pirate: `
        <svg class="watermark-svg pirate-svg" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <!-- Crossed Bones -->
            <line x1="20" y1="20" x2="80" y2="80" stroke-width="5" stroke-linecap="round"/>
            <line x1="80" y1="20" x2="20" y2="80" stroke-width="5" stroke-linecap="round"/>
            <!-- Skull -->
            <circle cx="50" cy="45" r="22" stroke-width="3" fill="none"/>
            <!-- Eye sockets -->
            <circle cx="42" cy="42" r="5" fill="currentColor"/>
            <circle cx="58" cy="42" r="5" fill="currentColor"/>
            <!-- Teeth -->
            <rect x="42" y="60" width="16" height="10" rx="2" stroke-width="2"/>
            <line x1="47" y1="60" x2="47" y2="70" stroke-width="2"/>
            <line x1="53" y1="60" x2="53" y2="70" stroke-width="2"/>
            <text x="50" y="96" text-anchor="middle" font-size="8" font-family="'Outfit', sans-serif" font-weight="bold" fill="currentColor" stroke="none">GRAND LINE • JOLLY ROGER</text>
        </svg>
    `,
    merchant: `
        <svg class="watermark-svg merchant-svg" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <!-- Scale of Trade -->
            <circle cx="50" cy="50" r="42" stroke-width="2.5" stroke-dasharray="4 2"/>
            <line x1="50" y1="22" x2="50" y2="78" stroke-width="3"/>
            <line x1="25" y1="35" x2="75" y2="35" stroke-width="3" stroke-linecap="round"/>
            <!-- Left Pan -->
            <path d="M18 52 C18 60 32 60 32 52 Z" stroke-width="2" fill="none"/>
            <line x1="25" y1="35" x2="18" y2="52" stroke-width="1.5"/>
            <line x1="25" y1="35" x2="32" y2="52" stroke-width="1.5"/>
            <!-- Right Pan -->
            <path d="M68 52 C68 60 82 60 82 52 Z" stroke-width="2" fill="none"/>
            <line x1="75" y1="35" x2="68" y2="52" stroke-width="1.5"/>
            <line x1="75" y1="35" x2="82" y2="52" stroke-width="1.5"/>
            <!-- Berry Symbol -->
            <text x="50" y="58" text-anchor="middle" font-size="20" font-family="'Outfit', sans-serif" font-weight="bold" fill="currentColor" stroke="none">฿</text>
            <text x="50" y="96" text-anchor="middle" font-size="8" font-family="'Outfit', sans-serif" font-weight="bold" fill="currentColor" stroke="none">WORLD TRADE GUILD • WATER 7</text>
        </svg>
    `
};

function selectFaction(faction) {
    const body = document.getElementById('signupBody');
    const watermarkContainer = document.getElementById('factionWatermark');
    const selectedFactionInput = document.getElementById('selectedFaction');
    const shipLabelPrefix = document.getElementById('shipLabelPrefix');
    
    // Cards
    const cards = {
        marine: document.getElementById('factionMarineCard'),
        pirate: document.getElementById('factionPirateCard'),
        merchant: document.getElementById('factionMerchantCard')
    };

    // Sections
    const sections = {
        marine: document.getElementById('marineSection'),
        pirate: document.getElementById('pirateSection'),
        merchant: document.getElementById('merchantSection')
    };

    // Update Card UI
    Object.keys(cards).forEach(key => {
        if (cards[key]) cards[key].classList.toggle('active', key === faction);
    });

    // Update Sections visibility
    Object.keys(sections).forEach(key => {
        if (sections[key]) {
            if (key === faction) {
                sections[key].classList.remove('hidden');
            } else {
                sections[key].classList.add('hidden');
            }
        }
    });

    // Update Body theme class
    body.classList.remove('signup-theme-marine', 'signup-theme-pirate', 'signup-theme-merchant');
    body.classList.add(`signup-theme-${faction}`);

    // Update Watermark SVG
    if (watermarkContainer && watermarks[faction]) {
        watermarkContainer.innerHTML = watermarks[faction];
    }

    // Update ship label prefix
    if (shipLabelPrefix) {
        if (faction === 'marine') shipLabelPrefix.textContent = 'Marine Warship / Patrol';
        else if (faction === 'pirate') shipLabelPrefix.textContent = 'Pirate Flagship / Vessel';
        else shipLabelPrefix.textContent = 'Merchant Cargo / Trade Vessel';
    }

    if (selectedFactionInput) {
        selectedFactionInput.value = faction;
    }

    showToast(`Faction updated to ${faction.toUpperCase()}. Dossier requirements refreshed.`);
}

// Sample Auto-Fill Presets for Quick Demo
function autoFillSample(type) {
    if (type === 'smoker') {
        selectFaction('marine');
        document.getElementById('firstName').value = 'Smoker';
        document.getElementById('lastName').value = 'None';
        document.getElementById('epithet').value = 'White Hunter';
        document.getElementById('age').value = '36';
        document.getElementById('gender').value = 'Male';
        document.getElementById('species').value = 'Human';
        document.getElementById('homeIsland').value = 'Grand Line G-5 Base';
        document.getElementById('seaOfOrigin').value = 'Grand Line (Paradise)';
        document.getElementById('shipName').value = 'Great Eirik (Marine Cruiser 07)';
        document.getElementById('shipType').value = 'Heavy Warship / Flagship';
        document.getElementById('marineRank').value = 'Vice Admiral';
        document.getElementById('marineBase').value = 'G-5 01 Branch / Loguetown';
        document.getElementById('marineId').value = 'M-G5-0044-WHITE';
        document.getElementById('justiceType').value = 'Moral Justice';
        document.getElementById('marineShipClass').value = 'Standard Battleship';
        document.getElementById('signupEmail').value = 'smoker@g5.marines.gov';
        document.getElementById('signupPasskey').value = 'WhiteHunterSmokeBlow';
        showToast('Auto-filled Marine Vice Admiral Smoker dossier!');
    } else if (type === 'luffy') {
        selectFaction('pirate');
        document.getElementById('firstName').value = 'Monkey D.';
        document.getElementById('lastName').value = 'Luffy';
        document.getElementById('epithet').value = 'Straw Hat';
        document.getElementById('age').value = '19';
        document.getElementById('gender').value = 'Male';
        document.getElementById('species').value = 'Human';
        document.getElementById('homeIsland').value = 'Foosha Village (Dawn Island)';
        document.getElementById('seaOfOrigin').value = 'East Blue';
        document.getElementById('shipName').value = 'Thousand Sunny';
        document.getElementById('shipType').value = 'Adam Wood Sloop';
        document.getElementById('crewName').value = 'Straw Hat Pirates';
        document.getElementById('bountyAmount').value = '฿ 3,000,000,000';
        document.getElementById('crewRole').value = 'Captain';
        document.getElementById('jollyRoger').value = 'Classic skull wearing a straw hat with crossed bones';
        document.getElementById('devilFruit').value = 'Hito Hito no Mi, Model: Nika';
        document.getElementById('signupEmail').value = 'luffy@strawhat.sea';
        document.getElementById('signupPasskey').value = 'GomuGomuKingMeat3000';
        showToast('Auto-filled Pirate Captain Luffy dossier!');
    } else if (type === 'tom') {
        selectFaction('merchant');
        document.getElementById('firstName').value = 'Master';
        document.getElementById('lastName').value = 'Tom';
        document.getElementById('epithet').value = 'Legendary Shipwright of Water 7';
        document.getElementById('age').value = '67';
        document.getElementById('gender').value = 'Male';
        document.getElementById('species').value = 'Fish-man';
        document.getElementById('homeIsland').value = 'Water 7';
        document.getElementById('seaOfOrigin').value = 'Grand Line (Paradise)';
        document.getElementById('shipName').value = 'Puffing Tom (Sea Train) & Tom Workers #1';
        document.getElementById('shipType').value = 'Steam Paddle / Sea Train';
        document.getElementById('legalOccupation').value = 'Shipwright / Carpenter';
        document.getElementById('companyName').value = "Tom's Workers Shipyard";
        document.getElementById('tradeGoods').value = 'Timber & Adam Wood';
        document.getElementById('travelPermit').value = 'WG-PASS-W7-SEATRAIN-01';
        document.getElementById('protectionAffiliation').value = 'Independent Kingdom';
        document.getElementById('tributeTaxStatus').value = 'Paid';
        document.getElementById('signupEmail').value = 'tom@tomsworkers.water7';
        document.getElementById('signupPasskey').value = 'DoItWithADON100';
        showToast("Auto-filled Master Tom's Shipwright registry!");
    }
}

// Form Submission & Clearance Generation
function handleSignupSubmit(event) {
    event.preventDefault();

    const faction = document.getElementById('selectedFaction').value;
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const epithet = document.getElementById('epithet').value.trim();
    const shipName = document.getElementById('shipName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const submitBtn = document.getElementById('submitSignupBtn');
    const alertBox = document.getElementById('signupAlert');

    if (!firstName || !shipName || !email) {
        alertBox.className = 'auth-alert alert-error';
        alertBox.textContent = 'Please fill out all required identification and ship registration fields.';
        alertBox.classList.remove('hidden');
        return;
    }

    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    const btnArrow = submitBtn.querySelector('.btn-arrow');

    // UI Loading State
    submitBtn.disabled = true;
    btnText.textContent = 'Transmitting Registry to Galley-La...';
    btnSpinner.classList.remove('hidden');
    btnArrow.classList.add('hidden');
    alertBox.classList.add('hidden');

    setTimeout(() => {
        btnText.textContent = 'Allocating Water 7 Berth Space...';

        setTimeout(() => {
            btnText.textContent = 'Vessel Cleared!';
            submitBtn.style.backgroundColor = '#10b981';
            btnSpinner.classList.add('hidden');

            const fullName = `${firstName} ${lastName !== 'None' ? lastName : ''}`.trim();
            const displayName = epithet ? `"${epithet}" ${fullName}` : fullName;

            // Save user session
            localStorage.setItem('dockseven_user', JSON.stringify({
                identifier: email,
                name: displayName,
                faction: faction,
                ship: shipName,
                registeredAt: new Date().toISOString(),
                status: 'Cleared for Docking'
            }));

            // Show Certificate Modal
            showClearanceCertificate(displayName, shipName, faction);

        }, 800);
    }, 900);
}

function showClearanceCertificate(name, ship, faction) {
    const modal = document.getElementById('clearanceModal');
    const modalBadgeIcon = document.getElementById('modalBadgeIcon');
    const modalStamp = document.getElementById('modalStamp');
    const modalDetails = document.getElementById('modalDetails');

    let badge = '⚓';
    let factionName = 'World Government Marine';
    let berth = 'Dock 1 - Military Berth A';
    let stampColor = '#0b4b8a';

    if (faction === 'pirate') {
        badge = '🏴‍☠️';
        factionName = 'Grand Line Pirate Crew';
        berth = 'Dock 5 - Independent Cove #3';
        stampColor = '#dc2626';
    } else if (faction === 'merchant') {
        badge = '⚖️';
        factionName = 'Licensed Trade Guild';
        berth = 'Dock 2 - Commercial Basin B';
        stampColor = '#d97706';
    }

    modalBadgeIcon.textContent = badge;
    modalStamp.style.color = stampColor;
    modalStamp.style.borderColor = stampColor;

    modalDetails.innerHTML = `
        <div class="cert-row">
            <span class="cert-label">Master / Commander:</span>
            <span class="cert-val">${name}</span>
        </div>
        <div class="cert-row">
            <span class="cert-label">Registered Vessel:</span>
            <span class="cert-val">⛵ ${ship}</span>
        </div>
        <div class="cert-row">
            <span class="cert-label">Grand Line Allegiance:</span>
            <span class="cert-val">${badge} ${factionName}</span>
        </div>
        <div class="cert-row">
            <span class="cert-label">Assigned Water 7 Berth:</span>
            <span class="cert-val" style="color: #059669; font-weight: 700;">${berth}</span>
        </div>
    `;

    modal.classList.remove('hidden');
}

function proceedToHarbor() {
    if (window.smoothNavigate) {
        window.smoothNavigate('index.html');
    } else {
        window.location.href = 'index.html';
    }
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
