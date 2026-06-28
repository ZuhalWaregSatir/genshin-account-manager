/**
 * Genshin Impact Account Manager & Reroll Assistant
 * Core Logic & State Management
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
const stepXEmail = document.getElementById('step-x-email');
const stepXUsername = document.getElementById('step-x-username');
const stepXPass = document.getElementById('step-x-pass');
const stepArInput = document.getElementById('step-ar');
const stepPrimosInput = document.getElementById('step-primos-input');
const stepCharacters = document.getElementById('step-characters');

// Drawer Steps Cards
const stepOutlookCard = document.getElementById('step-outlook-card');
const stepXCard = document.getElementById('step-x-card');
const stepGenshinCard = document.getElementById('step-genshin-card');
const stepResultCard = document.getElementById('step-result-card');

// Drawer Steps Badges
const badgeStep1 = document.getElementById('step1-status');
const badgeStep2 = document.getElementById('step2-status');
const badgeStep3 = document.getElementById('step3-status');
const badgeStep4 = document.getElementById('step4-status');

// Drawer Action Buttons
const btnCompleteStep1 = document.getElementById('btn-complete-step1');
const btnCompleteStep2 = document.getElementById('btn-complete-step2');
const btnCompleteStep3 = document.getElementById('btn-complete-step3');
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
    const year = Math.floor(Math.random() * 20) + 1986; // 1986-2005 (At least 21 years old as of 2026)
    
    return `${day} ${month} ${year}`;
}

// Generate Readable X Username (Adjective + Noun + Number)
function generateReadableXUsername() {
    const adjectives = [
        'Swift', 'Frost', 'Blaze', 'Storm', 'Dark', 'Light', 'Star', 'Luna', 
        'Void', 'Wild', 'Iron', 'Neon', 'Ghost', 'Epic', 'Nova', 'Zesty', 
        'Crimson', 'Azure', 'Golden', 'Silver', 'Shadow', 'Silent', 'Hyper', 'Apex'
    ];
    const nouns = [
        'Gamer', 'Knight', 'Archon', 'Hunter', 'Slime', 'Rex', 'Bard', 'Wolf', 
        'Blade', 'Shield', 'Soul', 'Fang', 'Claw', 'Crown', 'Rider', 'Sage', 
        'Monk', 'Beast', 'Nova', 'Slayer', 'Seeker', 'Ghost', 'King', 'Hero'
    ];
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    // Combine and limit length to 15 chars max (Twitter/X limit)
    let base = adj + noun;
    const number = Math.floor(Math.random() * 90) + 10; // 10-99
    
    let username = base + number;
    if (username.length > 15) {
        username = username.slice(0, 15);
    }
    return username;
}

// Generate Random Email Username (Outlook Rules)
// Must start with letter, end with letter/number, symbols cannot be consecutive.
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
    const xPassword = generateSecurePassword(passLength);
    const xUsername = generateReadableXUsername();
    
    // Generate Name & DOB details
    const { firstName, lastName } = generateRandomName();
    const dob = generateRandomDOB();
    
    const newAccount = {
        id: 'acc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        email: email,
        emailPassword: emailPassword,
        xUsername: xUsername,
        xPassword: xPassword,
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        status: 'draft', // draft -> outlook -> x -> genshin
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
            return acc.email.toLowerCase().includes(query) || 
                   acc.xUsername.toLowerCase().includes(query) || 
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
        
        // Status Badge details
        let badgeHtml = '';
        if (acc.status === 'draft') {
            badgeHtml = '<span class="badge-status draft">Draft</span>';
        } else if (acc.status === 'outlook') {
            badgeHtml = '<span class="badge-status outlook">Outlook OK</span>';
        } else if (acc.status === 'x') {
            badgeHtml = '<span class="badge-status x">X Registered</span>';
        } else if (acc.status === 'genshin') {
            badgeHtml = '<span class="badge-status genshin">Genshin Linked</span>';
        }

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
                    <button class="btn-icon-small btn-copy" data-target="pass-${acc.id}" title="Copy Password">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                </div>
            </td>
            <td>
                <div class="credential-cell">
                    <span class="credential-value" id="x-${acc.id}">${acc.xUsername}:${acc.xPassword}</span>
                    <button class="btn-icon-small btn-copy" data-target="x-${acc.id}" title="Copy X Credentials">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                </div>
            </td>
            <td>${badgeHtml}</td>
            <td class="text-ar">AR ${acc.ar}</td>
            <td class="text-primos">${parseInt(acc.primos || 0).toLocaleString('id-ID')}</td>
            <td class="${charCellClass}" title="${acc.characters}">${charCellVal}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-primary btn-sm btn-workflow" data-id="${acc.id}">
                        Proses Reroll
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

// Copy Action Logic
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
        
        // Add a temporary visual glow effect to copy button
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

// --- Workflow Drawer Handlers ---

function openWorkflowDrawer(id) {
    const acc = accounts.find(a => a.id === id);
    if (!acc) return;

    currentEditingAccountId = id;

    // Fallback generation for older/imported accounts without names
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

    // Fill inputs
    drawerAccEmail.textContent = acc.email;
    stepOutlookEmail.value = acc.email.split('@')[0]; // Only copy the prefix/username (without domain)
    stepOutlookPass.value = acc.emailPassword;
    
    // Set Name & DOB inputs
    stepOutlookFirstName.value = acc.firstName;
    stepOutlookLastName.value = acc.lastName;
    stepOutlookDob.value = acc.dob;
    
    // Update Outlook SignUp Link with hash values for AutoFill userscript
    const outlookBaseUrl = "https://signup.live.com/signup?cobrandid=ab0455a0-8d03-46b9-b18b-df2f57b9e44c&contextid=2F1573481CB5BAF0&opid=BF2DF86E1896DD4D&bk=1782652896&sru=https://login.live.com/oauth20_authorize.srf%3fclient_id%3d9199bf20-a13f-4107-85dc-02114787ef48%26cobrandid%3dab0455a0-8d03-46b9-b18b-df2f57b9e44c%26client_id%3d9199bf20-a13f-4107-85dc-02114787ef48%26cobrandid%3dab0455a0-8d03-46b9-b18b-df2f57b9e44c%26contextid%3d2F1573481CB5BAF0%26opid%3dBF2DF86E1896DD4D%26login_hint%3dM%2524EjZ4nOM4uGzq7B0LHm5MEBIvzE-2zLEoqCi0NHDILy3Jyc_P1kvOz5W4fWvC6b__gYARAO0RFtE%26mkt%3dEN-US%26lc%3d1033%26bk%3d1782652896%26uaid%3df9ce5cdf48f8118072039ce42f0c8869&lw=dob,flname,wld&uiflavor=web&fluent=2&client_id=00000000487A244A&lic=1&mkt=EN-US&lc=1033&uaid=f9ce5cdf48f8118072039ce42f0c8869";
    const prefix = acc.email.split('@')[0];
    const pass = encodeURIComponent(acc.emailPassword);
    const first = encodeURIComponent(acc.firstName);
    const last = encodeURIComponent(acc.lastName);
    
    // Parse Date of Birth into Day, Month, Year
    const dobParts = acc.dob.split(' ');
    const dobDay = dobParts[0] || '1';
    const dobMonthStr = dobParts[1] || 'Januari';
    const dobYear = dobParts[2] || '1995';
    
    // Convert Indonesian Month name to English/Number index (0-11) for Outlook select dropdown
    const monthsMap = {
        'Januari': '0', 'Februari': '1', 'Maret': '2', 'April': '3', 'Mei': '4', 'Juni': '5',
        'Juli': '6', 'Agustus': '7', 'September': '8', 'Oktober': '9', 'November': '10', 'Desember': '11'
    };
    const dobMonth = monthsMap[dobMonthStr] || '0';
    
    btnOutlookSignup.href = `${outlookBaseUrl}#prefix=${prefix}&pass=${pass}&first=${first}&last=${last}&dobDay=${dobDay}&dobMonth=${dobMonth}&dobYear=${dobYear}`;
    
    stepXEmail.value = acc.email;
    stepXUsername.value = acc.xUsername || '';
    stepXPass.value = acc.xPassword;

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
    // Reset classes
    const cards = [stepOutlookCard, stepXCard, stepGenshinCard, stepResultCard];
    cards.forEach(card => card.classList.remove('active'));
    
    const badges = [badgeStep1, badgeStep2, badgeStep3, badgeStep4];
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
        
        stepXCard.classList.add('active');
        badgeStep2.textContent = 'In Progress';
        badgeStep2.classList.add('badge-status', 'outlook');
    } else if (status === 'x') {
        badgeStep1.textContent = 'Completed';
        badgeStep1.classList.add('badge-status', 'genshin');
        badgeStep2.textContent = 'Completed';
        badgeStep2.classList.add('badge-status', 'genshin');

        stepGenshinCard.classList.add('active');
        badgeStep3.textContent = 'In Progress';
        badgeStep3.classList.add('badge-status', 'outlook');
    } else if (status === 'genshin') {
        badgeStep1.textContent = 'Completed';
        badgeStep1.classList.add('badge-status', 'genshin');
        badgeStep2.textContent = 'Completed';
        badgeStep2.classList.add('badge-status', 'genshin');
        badgeStep3.textContent = 'Completed';
        badgeStep3.classList.add('badge-status', 'genshin');

        stepResultCard.classList.add('active');
        badgeStep4.textContent = 'Active';
        badgeStep4.classList.add('badge-status', 'genshin');
    }
}

// Save progress helper
function updateAccountStatus(newStatus) {
    if (!currentEditingAccountId) return;
    const accIdx = accounts.findIndex(a => a.id === currentEditingAccountId);
    if (accIdx === -1) return;

    accounts[accIdx].status = newStatus;
    
    // Save X Username value if updated in Step 2
    if (newStatus === 'x' || newStatus === 'genshin') {
        const xUserVal = stepXUsername.value.trim();
        if (xUserVal) {
            accounts[accIdx].xUsername = xUserVal;
        }
    }

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
    // Header
    csvContent += "Email Outlook,Password Outlook,X Username,X Password,Status,AR,Primogems,Karakter Bintang 5 / Catatan,Tanggal Dibuat\n";
    
    accounts.forEach(acc => {
        // Escape quotes
        const email = `"${acc.email.replace(/"/g, '""')}"`;
        const emailPass = `"${acc.emailPassword.replace(/"/g, '""')}"`;
        const xUser = `"${(acc.xUsername || '').replace(/"/g, '""')}"`;
        const xPass = `"${acc.xPassword.replace(/"/g, '""')}"`;
        const status = `"${acc.status}"`;
        const ar = `"${acc.ar}"`;
        const primos = `"${acc.primos}"`;
        const notes = `"${(acc.characters || '').replace(/"/g, '""')}"`;
        const date = `"${acc.createdAt}"`;
        
        csvContent += `${email},${emailPass},${xUser},${xPass},${status},${ar},${primos},${notes},${date}\n`;
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
                    // Simple validation: must have email and emailPassword
                    const valid = parsed.every(item => item.email && item.emailPassword);
                    if (!valid) {
                        alert('Format file JSON tidak valid!');
                        return;
                    }
                    accounts = parsed.concat(accounts); // Prepends imported data
                    // De-duplicate by id or email
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
                // Parse simple CSV
                const lines = content.split('\n');
                if (lines.length <= 1) return;
                
                let importCount = 0;
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    
                    // Simple CSV split (handling commas inside quotes)
                    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                    if (matches && matches.length >= 2) {
                        const cleanVal = (val) => val ? val.replace(/^"|"$/g, '').trim() : '';
                        const email = cleanVal(matches[0]);
                        const emailPass = cleanVal(matches[1]);
                        const xUser = cleanVal(matches[2]) || email.split('@')[0];
                        const xPass = cleanVal(matches[3]) || emailPass;
                        const status = cleanVal(matches[4]) || 'draft';
                        const ar = parseInt(cleanVal(matches[5])) || 5;
                        const primos = parseInt(cleanVal(matches[6])) || 0;
                        const notes = cleanVal(matches[7]) || '';
                        
                        // Check duplicate
                        if (!accounts.some(a => a.email === email)) {
                            accounts.push({
                                id: 'acc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                                email: email,
                                emailPassword: emailPass,
                                xUsername: xUser,
                                xPassword: xPass,
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
        // Reset file input
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
    [btnGenerateOne, btnGenerateBulk, btnExportJson, btnExportCsv, btnTriggerImport].forEach(b => {
        if (b) b.addEventListener('click', () => {
            if (window.innerWidth <= 1024) closeSidebar();
        });
    });


    // Step Complete actions
    btnCompleteStep1.addEventListener('click', () => {
        updateAccountStatus('outlook');
    });

    btnCompleteStep2.addEventListener('click', () => {
        updateAccountStatus('x');
    });

    btnCompleteStep3.addEventListener('click', () => {
        updateAccountStatus('genshin');
    });

    // Save final stats (Step 4)
    btnSaveWorkflow.addEventListener('click', () => {
        if (!currentEditingAccountId) return;
        const accIdx = accounts.findIndex(a => a.id === currentEditingAccountId);
        if (accIdx === -1) return;

        accounts[accIdx].ar = parseInt(stepArInput.value) || 5;
        accounts[accIdx].primos = parseInt(stepPrimosInput.value) || 0;
        accounts[accIdx].characters = stepCharacters.value.trim();

        // Ensure status marks as linked (genshin) if saving results
        if (accounts[accIdx].status !== 'genshin') {
            accounts[accIdx].status = 'genshin';
        }

        saveToLocalStorage();
        renderAccountsTable();
        closeWorkflowDrawer();
        showToast('Hasil gacha & data akun berhasil disimpan!');
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
