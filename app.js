/**
 * Genshin Impact Account Manager & Reroll Assistant
 * Core Logic & State Management (v1.3.0)
 */

// --- State Management ---
let accounts = [];
let currentEditingAccountId = null;
let currentFilter = 'all';

// --- DOM Elements ---
const tableBody = document.getElementById('account-table-body');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');

// Sliders and settings
const usernameLengthSlider = document.getElementById('username-length');
const usernameLengthVal = document.getElementById('range-val');
const includeSymbolsCheck = document.getElementById('include-symbols');
const outlookDomainSelect = document.getElementById('outlook-domain');
const passwordLengthSlider = document.getElementById('password-length');
const passwordLengthVal = document.getElementById('pass-range-val');

// Action Buttons
const btnGenerateOne = document.getElementById('btn-generate-one');
const btnGenerateBulk = document.getElementById('btn-generate-bulk');
const btnOutlookSignup = document.getElementById('btn-outlook-signup');
const btnExportJson = document.getElementById('btn-export-json');
const btnExportCsv = document.getElementById('btn-export-csv');
const btnTriggerImport = document.getElementById('btn-trigger-import');
const importFileInput = document.getElementById('import-file');
const btnClearDb = document.getElementById('btn-clear-db');

// Manual Account Modal Elements
const btnOpenManualModal = document.getElementById('btn-open-manual-modal');
const manualModal = document.getElementById('manual-modal');
const manualModalOverlay = document.getElementById('manual-modal-overlay');
const btnCloseManualModal = document.getElementById('btn-close-manual-modal');
const btnCancelManual = document.getElementById('btn-cancel-manual');
const manualAccountForm = document.getElementById('manual-account-form');

// Stats
const statTotal = document.getElementById('stat-total');
const statLinked = document.getElementById('stat-linked');
const statPrimos = document.getElementById('stat-primos');

// Drawer & Modal Elements
const workflowDrawer = document.getElementById('workflow-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const btnCloseDrawer = document.getElementById('btn-close-drawer');
const confirmModal = document.getElementById('confirm-modal');
const btnCancelClear = document.getElementById('btn-cancel-clear');
const btnConfirmClear = document.getElementById('btn-confirm-clear');

// Mobile Sidebar Elements
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const btnSidebarToggle = document.getElementById('btn-sidebar-toggle');

// Drawer Field Elements
const drawerAccEmail = document.getElementById('drawer-acc-email');
const stepOutlookEmail = document.getElementById('step-outlook-email');
const stepOutlookPass = document.getElementById('step-outlook-pass');
const stepOutlookFirstName = document.getElementById('step-outlook-firstname');
const stepOutlookLastName = document.getElementById('step-outlook-lastname');
const stepOutlookDob = document.getElementById('step-outlook-dob');
const stepGenshinEmail = document.getElementById('step-genshin-email');
const stepGenshinPass = document.getElementById('step-genshin-pass');
const stepArInput = document.getElementById('step-ar');
const stepPrimosInput = document.getElementById('step-primos-input');
const stepCharacters = document.getElementById('step-characters');

// Drawer Steps Cards
const stepOutlookCard = document.getElementById('step-outlook-card');
const stepGenshinCard = document.getElementById('step-genshin-card');
const stepResultCard = document.getElementById('step-result-card');

// Drawer Steps Badges
const badgeStep1 = document.getElementById('step1-status');
const badgeStep2 = document.getElementById('step2-status');
const badgeStep3 = document.getElementById('step3-status');

// Drawer Action Buttons
const btnCompleteStep1 = document.getElementById('btn-complete-step1');
const btnCompleteStep2 = document.getElementById('btn-complete-step2');
const btnSaveWorkflow = document.getElementById('btn-save-workflow');

// Toast Notification
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// --- Helper Functions ---

// Generate Random Name
function generateRandomName() {
    const westernFirstNames = [
        'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
        'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
        'Kenneth', 'Kevin', 'Brian', 'George', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan',
        'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon',
        'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Frank', 'Patrick', 'Raymond', 'Jack', 'Dennis', 'Jerry',
        'Tyler', 'Aaron', 'Jose', 'Adam', 'Nathan', 'Henry', 'Douglas', 'Zachary', 'Peter', 'Kyle', 'Walter',
        'Harold', 'Jeremy', 'Ethan', 'Carl', 'Keith', 'Roger', 'Gerald', 'Christian', 'Terry', 'Sean', 'Arthur',
        'Austin', 'Noah', 'Lawrence', 'Jesse', 'Joe', 'Bryan', 'Billy', 'Jordan', 'Albert', 'Dylan', 'Bruce',
        'Willie', 'Alan', 'Ralph', 'Gabriel', 'Roy', 'Juan', 'Wayne', 'Eugene', 'Logan', 'Randy', 'Louis',
        'Russell', 'Vincent', 'Philip', 'Bobby', 'Johnny', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth',
        'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra',
        'Ashley', 'Dorothy', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Carol', 'Amanda', 'Melissa', 'Deborah',
        'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia', 'Kathleen', 'Amy', 'Shirley', 'Angela', 'Helen',
        'Anna', 'Brenda', 'Pamela', 'Nicole', 'Emma', 'Samantha', 'Katherine', 'Christine', 'Debra', 'Rachel',
        'Carolyn', 'Janet', 'Catherine', 'Maria', 'Heather'
    ];
    const westernLastNames = [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson',
        'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White',
        'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall', 'Young',
        'Allen', 'Sanchez', 'Wright', 'King', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Hill', 'Ramirez',
        'Campbell', 'Mitchell', 'Roberts', 'Carter', 'Phillips', 'Evans', 'Turner', 'Torres', 'Parker', 'Collins',
        'Edwards', 'Stewart', 'Flores', 'Morris', 'Nguyen', 'Murphy', 'Rivera', 'Cook', 'Rogers', 'Morgan',
        'Peterson', 'Cooper', 'Reed', 'Bailey', 'Bell', 'Gomez', 'Kelly', 'Howard', 'Ward', 'Cox', 'Diaz',
        'Richardson', 'Wood', 'Watson', 'Brooks', 'Bennett', 'Gray', 'James', 'Reyes', 'Cruz', 'Hughes', 'Price',
        'Myers', 'Long', 'Foster', 'Sanders', 'Ross', 'Morales', 'Powell', 'Sullivan', 'Russell', 'Ortiz',
        'Jenkins', 'Gutierrez', 'Perry', 'Butler', 'Barnes', 'Fisher'
    ];
    
    const indonesianFirstNames = [
        'Budi', 'Agus', 'Hendra', 'Aditya', 'Rian', 'Denny', 'Surya', 'Rahmat', 'Dwi', 'Ari', 'Fajar', 'Eko',
        'Roni', 'Andi', 'Rudi', 'Yanto', 'Heri', 'Dimas', 'Reza', 'Bayu', 'Aris', 'Agung', 'Angga', 'Dedi',
        'Taufik', 'Dewi', 'Sari', 'Indah', 'Fitri', 'Rini', 'Dian', 'Siti', 'Sri', 'Wulan', 'Mega', 'Putri'
    ];
    const indonesianLastNames = [
        'Prasetya', 'Wibowo', 'Kurniawan', 'Saputra', 'Santoso', 'Hidayat', 'Setiawan', 'Nugroho', 'Gunawan', 'Wahyudi',
        'Sutrisno', 'Wijaya', 'Budiman', 'Siregar', 'Ginting', 'Simanjuntak', 'Tanjung', 'Lubis', 'Kusuma', 'Lestari'
    ];

    const isWestern = Math.random() > 0.3;
    let firstName = '';
    let lastName = '';
    
    if (isWestern) {
        firstName = westernFirstNames[Math.floor(Math.random() * westernFirstNames.length)];
        lastName = westernLastNames[Math.floor(Math.random() * westernLastNames.length)];
    } else {
        firstName = indonesianFirstNames[Math.floor(Math.random() * indonesianFirstNames.length)];
        lastName = indonesianLastNames[Math.floor(Math.random() * indonesianLastNames.length)];
    }
    
    return { firstName, lastName };
}

// Generate Random Date of Birth (Age: 21 to 40)
function generateRandomDOB() {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const day = Math.floor(Math.random() * 28) + 1;
    const month = months[Math.floor(Math.random() * months.length)];
    const year = Math.floor(Math.random() * 20) + 1986; // 1986-2005
    
    return `${day} ${month} ${year}`;
}

// Generate Random Email Username (Outlook Rules)
function generateEmailUsername(length, includeSymbols) {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '._';
    
    let username = '';
    // 1st char must be a letter
    username += letters.charAt(Math.floor(Math.random() * letters.length));
    
    let symbolPos = -1;
    let selectedSymbol = '';
    if (includeSymbols && length >= 6 && Math.random() > 0.3) {
        // Insert exactly one symbol in the middle
        symbolPos = Math.floor(Math.random() * (length - 4)) + 2; 
        selectedSymbol = symbols.charAt(Math.floor(Math.random() * symbols.length));
    }
    
    for (let i = 1; i < length; i++) {
        if (i === symbolPos) {
            username += selectedSymbol;
        } else {
            const pool = Math.random() > 0.35 ? letters : numbers;
            username += pool.charAt(Math.floor(Math.random() * pool.length));
        }
    }
    return username;
}

// Generate Secure Password
function generateSecurePassword(length) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '@#$*!?%&';
    
    // Ensure at least one of each type
    let password = '';
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = 4; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Shuffle password array
    return password.split('').sort(() => 0.5 - Math.random()).join('');
}

// Show Toast Alert
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 2000);
}

// Save & Load Database
function saveToLocalStorage() {
    localStorage.setItem('genshin_accounts', JSON.stringify(accounts));
    updateStats();
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem('genshin_accounts');
    if (stored) {
        try {
            accounts = JSON.parse(stored);
        } catch (e) {
            accounts = [];
        }
    } else {
        accounts = [];
    }
    updateStats();
    renderAccountsTable();
}

// Update Stats Banner
function updateStats() {
    statTotal.textContent = accounts.length;
    
    const linked = accounts.filter(acc => acc.status === 'genshin').length;
    statLinked.textContent = linked;
    
    const totalPrimos = accounts.reduce((sum, acc) => sum + (parseInt(acc.primos) || 0), 0);
    statPrimos.textContent = totalPrimos.toLocaleString('id-ID');
}

// Generate Single Draft
function createAccountDraft() {
    const userLength = parseInt(usernameLengthSlider.value);
    const passLength = parseInt(passwordLengthSlider.value);
    const includeSym = includeSymbolsCheck.checked;
    const domain = outlookDomainSelect.value;
    
    const username = generateEmailUsername(userLength, includeSym);
    const email = username + domain;
    const emailPassword = generateSecurePassword(passLength);
    const gamePassword = generateSecurePassword(passLength);
    
    // Generate Name & DOB details
    const { firstName, lastName } = generateRandomName();
    const dob = generateRandomDOB();
    
    const newAccount = {
        id: 'acc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        email: email,
        emailPassword: emailPassword,
        gamePassword: gamePassword,
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        status: 'draft', // draft -> outlook -> genshin
        ar: 5,
        primos: 0,
        characters: '',
        createdAt: new Date().toISOString()
    };
    
    accounts.unshift(newAccount);
    saveToLocalStorage();
    renderAccountsTable();
    showToast('Draft akun berhasil dibuat!');
}

// Delete Account
function deleteAccount(id) {
    accounts = accounts.filter(acc => acc.id !== id);
    saveToLocalStorage();
    renderAccountsTable();
    showToast('Akun berhasil dihapus');
}

// Render Table
function renderAccountsTable() {
    const query = searchInput.value.toLowerCase().trim();
    
    // Filter
    let filtered = accounts;
    if (currentFilter !== 'all') {
        filtered = accounts.filter(acc => acc.status === currentFilter);
    }
    
    // Search query
    if (query) {
        filtered = filtered.filter(acc => {
            const gamePass = acc.gamePassword || '';
            return acc.email.toLowerCase().includes(query) || 
                   acc.emailPassword.toLowerCase().includes(query) ||
                   gamePass.toLowerCase().includes(query) ||
                   acc.characters.toLowerCase().includes(query);
        });
    }
    
    tableBody.innerHTML = '';
    
    if (filtered.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="8">
                    <div class="empty-state">
                        <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="9" y1="15" x2="15" y2="15"></line>
                            <line x1="9" y1="19" x2="15" y2="19"></line>
                        </svg>
                        <p>Tidak ada akun yang sesuai kriteria.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    filtered.forEach(acc => {
        const tr = document.createElement('tr');
        
        // Fallback for game password if legacy account
        const gamePass = acc.gamePassword || acc.emailPassword || 'GenshinPass123!';

        // Highlight character if contains 5-star character
        const hasFiveStar = acc.characters && acc.characters.trim().length > 0;
        const charCellClass = hasFiveStar ? 'characters-note-cell has-five-star' : 'characters-note-cell';
        const charCellVal = acc.characters || '<span class="text-muted">-</span>';
        
        tr.innerHTML = `
            <td>
                <div class="credential-cell">
                    <span class="credential-value" id="email-${acc.id}">${acc.email}</span>
                    <button class="btn-icon-small btn-copy" data-target="email-${acc.id}" title="Copy Email">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                </div>
            </td>
            <td>
                <div class="credential-cell">
                    <span class="credential-value" id="pass-${acc.id}">${acc.emailPassword}</span>
                    <button class="btn-icon-small btn-copy" data-target="pass-${acc.id}" title="Copy Password Email">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                </div>
            </td>
            <td>
                <div class="credential-cell">
                    <span class="credential-value" id="gamepass-${acc.id}">${gamePass}</span>
                    <button class="btn-icon-small btn-copy" data-target="gamepass-${acc.id}" title="Copy Password Game">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                </div>
            </td>
            <td>
                <select class="status-select-badge ${acc.status}" data-id="${acc.id}">
                    <option value="draft" ${acc.status === 'draft' ? 'selected' : ''}>Draft</option>
                    <option value="outlook" ${acc.status === 'outlook' ? 'selected' : ''}>Outlook OK</option>
                    <option value="genshin" ${acc.status === 'genshin' ? 'selected' : ''}>Genshin Linked</option>
                </select>
            </td>
            <td class="text-ar">AR ${acc.ar}</td>
            <td class="text-primos">${parseInt(acc.primos || 0).toLocaleString('id-ID')}</td>
            <td class="${charCellClass}" title="${acc.characters}">${charCellVal}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-copy-all" data-id="${acc.id}" title="Copy format: Email | PassEmail | PassGame">
                        <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Copy All
                    </button>
                    <button class="btn btn-primary btn-sm btn-workflow" data-id="${acc.id}" title="Buka Workflow Drawer">
                        Detail
                    </button>
                    <button class="btn btn-secondary btn-sm btn-delete-row" data-id="${acc.id}" title="Hapus">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="text-danger"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    // Reattach Copy Button Handlers
    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', handleCopyAction);
    });

    // Reattach Copy All Button Handlers
    document.querySelectorAll('.btn-copy-all').forEach(btn => {
        btn.addEventListener('click', handleCopyAllAction);
    });

    // Reattach Fast Status Switcher Handlers
    document.querySelectorAll('.status-select-badge').forEach(select => {
        select.addEventListener('change', handleFastStatusChange);
    });

    // Reattach Delete Row Button Handlers
    document.querySelectorAll('.btn-delete-row').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            if (confirm('Hapus akun ini?')) {
                deleteAccount(id);
            }
        });
    });

    // Reattach Workflow Drawer Button Handlers
    document.querySelectorAll('.btn-workflow').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            openWorkflowDrawer(id);
        });
    });
}

// Copy Action Logic for Single Field
function handleCopyAction(e) {
    const targetId = e.currentTarget.getAttribute('data-target');
    let copyText = '';
    
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    if (targetEl.tagName === 'INPUT' || targetEl.tagName === 'TEXTAREA') {
        copyText = targetEl.value;
    } else {
        copyText = targetEl.textContent;
    }

    navigator.clipboard.writeText(copyText).then(() => {
        showToast('Berhasil disalin ke clipboard!');
        
        const originalHtml = e.currentTarget.innerHTML;
        e.currentTarget.innerHTML = `
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#42b883" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        `;
        e.currentTarget.style.color = '#42b883';
        
        setTimeout(() => {
            e.currentTarget.innerHTML = originalHtml;
            e.currentTarget.style.color = '';
        }, 1000);
    }).catch(err => {
        console.error('Copy failed', err);
    });
}

// Copy All Credentials Logic (Email | EmailPass | GamePass)
function handleCopyAllAction(e) {
    const id = e.currentTarget.getAttribute('data-id');
    const acc = accounts.find(a => a.id === id);
    if (!acc) return;

    const gamePass = acc.gamePassword || acc.emailPassword || 'GenshinPass123!';
    const formatted = `${acc.email} | ${acc.emailPassword} | ${gamePass}`;

    navigator.clipboard.writeText(formatted).then(() => {
        showToast('Semua kredensial disalin! (Email | PassEmail | PassGame)');
        
        const btn = e.currentTarget;
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" width="13" height="13" stroke="#42b883" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Done!
        `;
        btn.style.borderColor = '#42b883';
        btn.style.color = '#42b883';
        
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 1200);
    }).catch(err => {
        console.error('Copy all failed', err);
    });
}

// Fast Status Change Handler
function handleFastStatusChange(e) {
    const select = e.target;
    const id = select.getAttribute('data-id');
    const newStatus = select.value;

    const accIdx = accounts.findIndex(a => a.id === id);
    if (accIdx !== -1) {
        accounts[accIdx].status = newStatus;
        saveToLocalStorage();
        
        select.className = `status-select-badge ${newStatus}`;
        
        let label = 'Draft';
        if (newStatus === 'outlook') label = 'Outlook OK';
        if (newStatus === 'genshin') label = 'Genshin Linked';
        
        showToast(`Status diperbarui ke: ${label}`);
    }
}

// --- Manual Account Modal Handlers ---

function openManualModal() {
    if (manualModal) {
        manualModal.classList.add('active');
    }
}

function closeManualModal() {
    if (manualModal) {
        manualModal.classList.remove('active');
        manualAccountForm.reset();
    }
}

function handleManualFormSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('manual-email').value.trim();
    const emailPassword = document.getElementById('manual-email-pass').value.trim();
    const gamePassword = document.getElementById('manual-game-pass').value.trim();
    const ar = parseInt(document.getElementById('manual-ar').value) || 5;
    const primos = parseInt(document.getElementById('manual-primos').value) || 0;
    const status = document.getElementById('manual-status').value || 'genshin';
    const notes = document.getElementById('manual-notes').value.trim();

    if (!email || !emailPassword) {
        alert('Email dan Password Email wajib diisi!');
        return;
    }

    const { firstName, lastName } = generateRandomName();
    const dob = generateRandomDOB();

    const newAccount = {
        id: 'acc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        email: email,
        emailPassword: emailPassword,
        gamePassword: gamePassword || emailPassword,
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        status: status,
        ar: ar,
        primos: primos,
        characters: notes,
        createdAt: new Date().toISOString()
    };

    accounts.unshift(newAccount);
    saveToLocalStorage();
    renderAccountsTable();
    closeManualModal();
    showToast('Akun manual berhasil ditambahkan!');
}

// --- Workflow Drawer Handlers ---

function openWorkflowDrawer(id) {
    const acc = accounts.find(a => a.id === id);
    if (!acc) return;

    currentEditingAccountId = id;

    if (!acc.firstName || !acc.lastName) {
        const { firstName, lastName } = generateRandomName();
        acc.firstName = firstName;
        acc.lastName = lastName;
        saveToLocalStorage();
    }
    if (!acc.dob) {
        acc.dob = generateRandomDOB();
        saveToLocalStorage();
    }
    if (!acc.gamePassword) {
        acc.gamePassword = generateSecurePassword(14);
        saveToLocalStorage();
    }

    drawerAccEmail.textContent = acc.email;
    stepOutlookEmail.value = acc.email;
    stepOutlookPass.value = acc.emailPassword;
    
    stepOutlookFirstName.value = acc.firstName;
    stepOutlookLastName.value = acc.lastName;
    stepOutlookDob.value = acc.dob;
    
    const outlookBaseUrl = "https://signup.live.com/";
    const prefix = acc.email.split('@')[0];
    const domain = '@' + acc.email.split('@').slice(1).join('@');
    
    const dobParts = acc.dob.split(' ');
    const dobDay = dobParts[0] || '1';
    const dobMonthStr = dobParts[1] || 'Januari';
    const dobYear = dobParts[2] || '1995';
    
    const monthsMap = {
        'Januari': '0', 'Februari': '1', 'Maret': '2', 'April': '3', 'Mei': '4', 'Juni': '5',
        'Juli': '6', 'Agustus': '7', 'September': '8', 'Oktober': '9', 'November': '10', 'Desember': '11'
    };
    const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
    const dobMonth = parseInt(monthsMap[dobMonthStr] || '0', 10);
    
    // Kirim email lengkap + domain: form Microsoft terbaru meminta alamat email utuh,
    // bukan cuma prefix. Userscript memakai data ini untuk mengisi field "Email".
    const hashParams = new URLSearchParams({
        email: acc.email,
        prefix: prefix,
        domain: domain,
        pass: acc.emailPassword,
        first: acc.firstName,
        last: acc.lastName,
        dobDay: String(dobDay),
        dobMonth: String(dobMonth),
        dobMonthName: monthNamesEn[dobMonth],
        dobYear: String(dobYear)
    });
    
    btnOutlookSignup.href = `${outlookBaseUrl}#${hashParams.toString()}`;
    
    stepGenshinEmail.value = acc.email;
    stepGenshinPass.value = acc.gamePassword;

    stepArInput.value = acc.ar || 5;
    stepPrimosInput.value = acc.primos || 0;
    stepCharacters.value = acc.characters || '';

    updateWorkflowUI(acc.status);

    workflowDrawer.classList.add('active');
}

function closeWorkflowDrawer() {
    workflowDrawer.classList.remove('active');
    currentEditingAccountId = null;
}

// Set visual progress markers based on status
function updateWorkflowUI(status) {
    const cards = [stepOutlookCard, stepGenshinCard, stepResultCard];
    cards.forEach(card => card.classList.remove('active'));
    
    const badges = [badgeStep1, badgeStep2, badgeStep3];
    badges.forEach(b => {
        b.textContent = 'Pending';
        b.className = 'badge badge-step';
    });

    if (status === 'draft') {
        stepOutlookCard.classList.add('active');
        badgeStep1.textContent = 'In Progress';
        badgeStep1.classList.add('badge-status', 'outlook');
    } else if (status === 'outlook') {
        badgeStep1.textContent = 'Completed';
        badgeStep1.classList.add('badge-status', 'genshin');
        
        stepGenshinCard.classList.add('active');
        badgeStep2.textContent = 'In Progress';
        badgeStep2.classList.add('badge-status', 'outlook');
    } else if (status === 'genshin') {
        badgeStep1.textContent = 'Completed';
        badgeStep1.classList.add('badge-status', 'genshin');
        badgeStep2.textContent = 'Completed';
        badgeStep2.classList.add('badge-status', 'genshin');

        stepResultCard.classList.add('active');
        badgeStep3.textContent = 'Active';
        badgeStep3.classList.add('badge-status', 'genshin');
    }
}

// Save progress helper
function updateAccountStatus(newStatus) {
    if (!currentEditingAccountId) return;
    const accIdx = accounts.findIndex(a => a.id === currentEditingAccountId);
    if (accIdx === -1) return;

    accounts[accIdx].status = newStatus;
    
    saveToLocalStorage();
    renderAccountsTable();
    updateWorkflowUI(newStatus);
    showToast('Langkah berhasil dicatat!');
}

// --- Import & Export Scripts ---

// Export to JSON Backup
function exportJSONBackup() {
    if (accounts.length === 0) {
        showToast('Tidak ada data untuk diekspor!');
        return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(accounts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `genshin_accounts_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('JSON cadangan berhasil diunduh!');
}

// Export to CSV
function exportCSV() {
    if (accounts.length === 0) {
        showToast('Tidak ada data untuk diekspor!');
        return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Email Outlook,Password Email,Password Game,Status,AR,Primogems,Karakter Bintang 5 / Catatan,Tanggal Dibuat\n";
    
    accounts.forEach(acc => {
        const email = `"${acc.email.replace(/"/g, '""')}"`;
        const emailPass = `"${acc.emailPassword.replace(/"/g, '""')}"`;
        const gamePass = `"${(acc.gamePassword || acc.emailPassword).replace(/"/g, '""')}"`;
        const status = `"${acc.status}"`;
        const ar = `"${acc.ar}"`;
        const primos = `"${acc.primos}"`;
        const notes = `"${(acc.characters || '').replace(/"/g, '""')}"`;
        const date = `"${acc.createdAt}"`;
        
        csvContent += `${email},${emailPass},${gamePass},${status},${ar},${primos},${notes},${date}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `genshin_accounts_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('CSV (Excel) berhasil diunduh!');
}

// Import File Handler
function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        const content = evt.target.result;
        try {
            if (file.name.endsWith('.json')) {
                const parsed = JSON.parse(content);
                if (Array.isArray(parsed)) {
                    const valid = parsed.every(item => item.email && item.emailPassword);
                    if (!valid) {
                        alert('Format file JSON tidak valid!');
                        return;
                    }
                    accounts = parsed.concat(accounts);
                    const seen = new Set();
                    accounts = accounts.filter(acc => {
                        const duplicate = seen.has(acc.email);
                        seen.add(acc.email);
                        return !duplicate;
                    });
                    
                    saveToLocalStorage();
                    renderAccountsTable();
                    showToast('Data JSON berhasil diimpor!');
                } else {
                    alert('Format file JSON harus berupa array akun.');
                }
            } else if (file.name.endsWith('.csv')) {
                const lines = content.split('\n');
                if (lines.length <= 1) return;
                
                let importCount = 0;
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    
                    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                    if (matches && matches.length >= 2) {
                        const cleanVal = (val) => val ? val.replace(/^"|"$/g, '').trim() : '';
                        const email = cleanVal(matches[0]);
                        const emailPass = cleanVal(matches[1]);
                        const gamePass = cleanVal(matches[2]) || emailPass;
                        const status = cleanVal(matches[3]) || 'draft';
                        const ar = parseInt(cleanVal(matches[4])) || 5;
                        const primos = parseInt(cleanVal(matches[5])) || 0;
                        const notes = cleanVal(matches[6]) || '';
                        
                        if (!accounts.some(a => a.email === email)) {
                            accounts.push({
                                id: 'acc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                                email: email,
                                emailPassword: emailPass,
                                gamePassword: gamePass,
                                status: status,
                                ar: ar,
                                primos: primos,
                                characters: notes,
                                createdAt: new Date().toISOString()
                            });
                            importCount++;
                        }
                    }
                }
                if (importCount > 0) {
                    saveToLocalStorage();
                    renderAccountsTable();
                    showToast(`${importCount} Akun berhasil diimpor dari CSV!`);
                } else {
                    showToast(`Tidak ada akun baru yang diimpor.`);
                }
            }
        } catch (err) {
            console.error(err);
            alert('Gagal membaca file backup. Pastikan format file benar.');
        }
        importFileInput.value = '';
    };
    reader.readAsText(file);
}

// --- Event Listeners Setup ---

function setupEventListeners() {
    // Generate one draft
    btnGenerateOne.addEventListener('click', createAccountDraft);

    // Generate 5 drafts
    btnGenerateBulk.addEventListener('click', () => {
        for (let i = 0; i < 5; i++) {
            createAccountDraft();
        }
    });

    // Manual Account Modal open/close listeners
    if (btnOpenManualModal) btnOpenManualModal.addEventListener('click', openManualModal);
    if (btnCloseManualModal) btnCloseManualModal.addEventListener('click', closeManualModal);
    if (btnCancelManual) btnCancelManual.addEventListener('click', closeManualModal);
    if (manualModalOverlay) manualModalOverlay.addEventListener('click', closeManualModal);
    if (manualAccountForm) manualAccountForm.addEventListener('submit', handleManualFormSubmit);

    // Username range display update
    usernameLengthSlider.addEventListener('input', (e) => {
        usernameLengthVal.textContent = `${e.target.value} Karakter`;
    });

    // Password range display update
    passwordLengthSlider.addEventListener('input', (e) => {
        passwordLengthVal.textContent = `${e.target.value} Karakter`;
    });

    // Filters selection
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            renderAccountsTable();
        });
    });

    // Search bar
    searchInput.addEventListener('input', renderAccountsTable);

    // Clear database confirm handlers
    btnClearDb.addEventListener('click', () => {
        confirmModal.classList.add('active');
    });

    btnCancelClear.addEventListener('click', () => {
        confirmModal.classList.remove('active');
    });

    btnConfirmClear.addEventListener('click', () => {
        localStorage.removeItem('genshin_accounts');
        accounts = [];
        updateStats();
        renderAccountsTable();
        confirmModal.classList.remove('active');
        showToast('Seluruh database berhasil dihapus');
    });

    // Drawer overlay & close button
    drawerOverlay.addEventListener('click', closeWorkflowDrawer);
    btnCloseDrawer.addEventListener('click', closeWorkflowDrawer);

    // Mobile Sidebar actions
    function openSidebar() {
        if (sidebar && sidebarOverlay) {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        }
    }
    function closeSidebar() {
        if (sidebar && sidebarOverlay) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    }
    if (btnSidebarToggle) btnSidebarToggle.addEventListener('click', openSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

    // Auto-close sidebar on mobile when action is taken
    [btnGenerateOne, btnGenerateBulk, btnOpenManualModal, btnExportJson, btnExportCsv, btnTriggerImport].forEach(b => {
        if (b) b.addEventListener('click', () => {
            if (window.innerWidth <= 1024) closeSidebar();
        });
    });

    // Step Complete actions
    btnCompleteStep1.addEventListener('click', () => {
        updateAccountStatus('outlook');
    });

    btnCompleteStep2.addEventListener('click', () => {
        updateAccountStatus('genshin');
    });

    // Save final stats (Step 3)
    btnSaveWorkflow.addEventListener('click', () => {
        if (!currentEditingAccountId) return;
        const accIdx = accounts.findIndex(a => a.id === currentEditingAccountId);
        if (accIdx === -1) return;

        accounts[accIdx].ar = parseInt(stepArInput.value) || 5;
        accounts[accIdx].primos = parseInt(stepPrimosInput.value) || 0;
        accounts[accIdx].characters = stepCharacters.value.trim();

        if (accounts[accIdx].status !== 'genshin') {
            accounts[accIdx].status = 'genshin';
        }

        saveToLocalStorage();
        renderAccountsTable();
        closeWorkflowDrawer();
        showToast('Hasil tabungan & data akun berhasil disimpan!');
    });

    // Import / Export listeners
    btnExportJson.addEventListener('click', exportJSONBackup);
    btnExportCsv.addEventListener('click', exportCSV);
    btnTriggerImport.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', handleImportFile);
}

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadFromLocalStorage();
});
