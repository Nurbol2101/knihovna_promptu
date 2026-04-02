// Seznam všech promptů dostupných v aplikaci
let prompts = [
    {
        category: '#denní_přehled',
        title: 'Denní briefing z M365',
        content: 'Jsi můj asistent produktivity v Microsoft 365. Prohledej moje e‑maily, zprávy v Teams a kalendář za posledních 7 dní a vytvoř souhrn, co mám řešit dnes a zítra. Výstup rozděl do dvou sekcí: 1) Schůzky – čas, název, 1–2 věty shrnutí a co si mám připravit; 2) Akční položky – úkol, kdo jej zadal, termín, doporučený další krok. '
    },
    {
        category: '#proběhlá_schůzka',
        title: 'Okamžitý zápis a úkoly z proběhlé schůzky',
        content: 'Jako můj seniorní projektový manažer analyzuj transkript právě ukončené schůzky {DOPLŇ NÁZEV SCHŮZKY}. Ignoruj nezávaznou konverzaci (small talk). Výstup zformátuj do tabulky s následujícími sloupci: 1) Rozhodnutí (co bylo finálně schváleno), 2) Otevřené otázky (co se nevyřešilo), 3) Úkoly (konkrétní krok, jméno odpovědné osoby, termín splnění). Na závěr přidej sekci "Sentiment schůzky" – jaká byla nálada týmu.'
    },
    {
        category: '#1:1_schůzka',
        title: 'Příprava na 1:1 schůzku s kolegou',
        content: 'Připrav mě na schůzku s kolegou {DOPLŇ JMÉNO KOLEGY}. Prohledej naše společné e-maily, chaty v Teams a sdílené soubory za posledních 30 dní. Vypiš: 1) Hlavní témata, která jsme řešili, 2) Jakékoli nedořešené problémy nebo témata, 3) Úkoly, které mi měl dodat on, nebo já jemu. Vytvoř z toho stručnou agendu v odrážkách.'
    },
    {
        category: '#odmítnutí_pozvánky',
        title: 'Diplomatické odmítnutí pozvánky/projektu',
        content: 'Pomoz mi napsat e-mailovou odpověď na zprávu od {DOPLŇ JMÉNO OSOBY}, kde musím odmítnout jejich pozvánku/nabídku z důvodu plné kapacity. Zachovej velmi zdvořilý a profesionální tón, poděkuj za důvěru a navrhni, že se k tomu můžeme vrátit v {DOPLŇ DOBU}. Výstup by měl být empatický, ale zároveň pevný v odmítnutí.'
    },
    {
        category: '#hrubé_poznámky',
        title: 'Přeměna poznámek na profesionální návrh',
        content: 'Jsi seniorní konzultant. Mám zde hrubé poznámky z brainstormingu (viz soubor {DOPLŇ NÁZEV SOUBORU} nebo vložený text{DOPLŇ TEXT}).  Přepiš tyto poznámky do strukturovaného  návrhu ve Wordu struktury: 1) Manažerské shrnutí, 2) Analýza současného stavu, 3) Navrhované řešení, 4) Odhadované přínosy. Text ať je formální a přesvědčivý.'
    },
    {
        category: '#excel_agent_trendy',
        title: 'Hledání trendů v chaotické tabulce',
        content: ' Jsi datový analytik. Podívej se na data v tomto excelovém listu. Nechci vidět jen čísla, ale příběh za nimi. 1) Identifikuj 3 hlavní trendy za poslední období. 2) Najdi jakékoli anomálie nebo odlehlé hodnoty, které by měly upoutat mou pozornost. 3) Navrhni, jaký typ grafu by tato data nejlépe vizualizoval pro prezentaci vedení.'
    },
    {
        category: '#powerpoint_design',
        title: 'Vytvoření prezentace z Word dokumentu',
        content: 'Jsi expert na storytelling. Vytvoř v PowerPointu prezentaci o 10 slidech na základě připojeného dokumentu {DOPLŇ NÁZEV SOUBORU WORD}.  Každý slide musí obsahovat: Nadpis, maximálně 4 stručné odrážky obsahu a do poznámek pro přednášejícího (Speaker Notes) napiš detailní vysvětlení, co mám k danému slidu říkat. Rozvrhni prezentaci na Úvod, Problém, Řešení, Harmonogram a Závěr.'
    },
    {
        category: '#status_projektu',
        title: 'Status projektu napříč aplikacemi',
        content: 'Jsi projektový manažer. Potřebuji rychlý přehled o projektu {DOPLŇ NÁZEV PROJEKTU}. Prohledej mé e-maily, chaty v Teams a soubory na OneDrive za posledních 14 dní. Zjisti: Kdo naposledy reportoval nějaký pokrok? Zmínil někdo nějaké zdržení nebo "blocker"? Vytvoř souhrnný report o jedné stránce.'
    },
    {
        category: '#project_management',
        title: 'Analýza rizik projektu',
        content: 'Na základě přiloženého plánu projektu {DOPLŇ NÁZEV SOUBORU} identifikuj 5 potenciálních rizik, která by mohla ohrozit termín dodání nebo rozpočet. U každého rizika odhadni pravděpodobnost (Vysoká/Střední/Nízká) a navrhni konkrétní mitigační opatření (jak riziku předejít).'
    }
];

const DEFAULT_PROMPT_IDS = [
    'daily-briefing-m365',
    'meeting-wrapup-action-items',
    'one-to-one-prep',
    'polite-decline-proposal',
    'brainstorm-notes-proposal',
    'excel-trend-analysis',
    'word-to-powerpoint-storyboard',
    'project-status-overview',
    'project-risk-analysis'
]

prompts.forEach((prompt, index) => {
    if (!prompt.id) {
        prompt.id = DEFAULT_PROMPT_IDS[index] || `default-${index}`;
    }
});

// Reference na klíčové prvky v DOMu
const promptContainer = document.getElementById('prompt-container');
const searchInput = document.getElementById('search-input');
const categoryButton = document.getElementById('category-button');
const categoryList = document.getElementById('category-list');
const treeParentButtons = document.querySelectorAll('.tree-parent-button');
const treeGroups = document.querySelectorAll('.tree-group');
const pageButtons = document.querySelectorAll('.tree-leaf-button');
const libraryPage = document.getElementById('library-page');
const customPage = document.getElementById('custom-page');
const newPromptPage = document.getElementById('new-prompt-page');
const agentsPage = document.getElementById('agents-page');
const systemSettingsPage = document.getElementById('system-settings-page');
const presentationPage = document.getElementById('presentation-page');
const imagesPage = document.getElementById('images-page');
const videosPage = document.getElementById('videos-page');
const promptEngineeringTheoryPage = document.getElementById('prompt-engineering-theory-page');
const copilotFallbackPage = document.getElementById('copilot-fallback-page');
const libraryControls = document.querySelector('.library-controls');
const navElement = document.querySelector('nav');
const builderCards = document.querySelectorAll('.builder-card');
const addButtons = document.querySelectorAll('.section-add-button');
const xmlOutput = document.getElementById('xml-output');
const copyXmlButton = document.getElementById('copy-xml');
const builderToolbar = document.getElementById('builder-toolbar');
const builderSections = document.getElementById('builder-sections');
const fabContainer = document.querySelector('.fab-container');
const fabButton = document.getElementById('fab-button');
const fabMenu = document.getElementById('fab-menu');
const fabBackdrop = document.getElementById('fab-backdrop');
const fabNewPromptButton = document.getElementById('fab-new-prompt');
const fabImportUserDataButton = document.getElementById('fab-import-userdata');
const fabExportUserDataButton = document.getElementById('fab-export-userdata');
const importUserDataInput = document.getElementById('import-userdata-input');

// Reference pro novou stránku
const newPromptCategory = document.getElementById('new-prompt-category');
const newPromptTitle = document.getElementById('new-prompt-title');
const newPromptContent = document.getElementById('new-prompt-content');
const savePromptButton = document.getElementById('save-prompt');
const editPromptModal = document.getElementById('edit-prompt-modal');
const editPromptCategory = document.getElementById('edit-prompt-category');
const editPromptTitleInput = document.getElementById('edit-prompt-title-input');
const editPromptContent = document.getElementById('edit-prompt-content');
const saveEditedPromptButton = document.getElementById('save-edited-prompt');
const closeEditPromptButton = document.getElementById('close-edit-prompt');

// Reference pro delete modal
const deletePromptModal = document.getElementById('delete-prompt-modal');
const confirmDeletePromptButton = document.getElementById('confirm-delete-prompt');
const cancelDeletePromptButton = document.getElementById('cancel-delete-prompt');
const startupPageModal = document.getElementById('startup-page-modal');
const startupPageButtons = document.querySelectorAll('.startup-page-button');
const startupOpenDefaultButton = document.getElementById('startup-open-default');
const startupCloseButton = document.getElementById('startup-close');

const PAGE_HIERARCHY = {
    'library': { group: 'prompts' },
    'new-prompt': { group: 'prompts' },
    'custom': { group: 'prompts' },
    'presentation': { group: 'prompts' },
    'images': { group: 'prompts' },
    'videos': { group: 'prompts' },
    'agents': { group: 'tools' },
    'system-settings': { group: 'tools' },
    'prompt-engineering-theory': { group: 'outputs' },
    'copilot-fallback': { group: 'outputs' }
};

const GROUP_DEFAULT_PAGE = {
    'prompts': 'library',
    'tools': 'agents',
    'outputs': 'prompt-engineering-theory'
};

// localStorage klíč pro ukládání stavu promptů
const PROMPT_STATE_KEY = 'promptLibraryState';
const LEGACY_CUSTOM_PROMPTS_KEY = 'customPrompts';
let currentEditTarget = null;
let pendingDelete = null;

function createEmptyPromptState() {
    return {
        version: 1,
        customPrompts: [],
        hiddenDefaultIds: [],
        defaultOverrides: {}
    };
}

function normalizePromptState(promptState) {
    const safePromptState = promptState && typeof promptState === 'object' ? promptState : {};

    return {
        ...createEmptyPromptState(),
        ...safePromptState,
        customPrompts: Array.isArray(safePromptState.customPrompts) ? safePromptState.customPrompts : [],
        hiddenDefaultIds: Array.isArray(safePromptState.hiddenDefaultIds) ? safePromptState.hiddenDefaultIds : [],
        defaultOverrides: safePromptState.defaultOverrides && typeof safePromptState.defaultOverrides === 'object' ? safePromptState.defaultOverrides : {}
    };
}

function loadPromptState() {
    try {
        const stored = localStorage.getItem(PROMPT_STATE_KEY);
        if (stored) {
            return normalizePromptState(JSON.parse(stored));
        }

        const legacyStored = localStorage.getItem(LEGACY_CUSTOM_PROMPTS_KEY);
        if (legacyStored) {
            const customPrompts = JSON.parse(legacyStored);
            if (Array.isArray(customPrompts)) {
                const migratedState = normalizePromptState({ customPrompts });
                localStorage.setItem(PROMPT_STATE_KEY, JSON.stringify(migratedState));
                localStorage.removeItem(LEGACY_CUSTOM_PROMPTS_KEY);
                return migratedState;
            }
        }

        return createEmptyPromptState();
    } catch (error) {
        console.error('Chyba při načítání stavu promptů:', error);
        return createEmptyPromptState();
    }
}

function savePromptState(promptState) {
    try {
        const normalizedState = normalizePromptState(promptState);
        localStorage.setItem(PROMPT_STATE_KEY, JSON.stringify(normalizedState));
        return normalizedState;
    } catch (error) {
        console.error('Chyba při ukládání stavu promptů:', error);
        return null;
    }
}

function savePromptStateToStorage(promptState) {
    const savedState = savePromptState(promptState);
    return savedState !== null;
}

function loadCustomPrompts() {
    return loadPromptState().customPrompts;
}

function saveCustomPrompts(customPrompts) {
    const promptState = loadPromptState();
    promptState.customPrompts = customPrompts;
    return savePromptStateToStorage(promptState);
}

function loadJsonFile(filePath) {
    return fetch(filePath, { cache: 'no-store' })
        .then(response => (response.ok ? response.json() : null))
        .catch(error => {
            console.warn(`Nepodařilo se načíst ${filePath}:`, error);
            return null;
        });
}

function loadDefaultPrompts() {
    return loadJsonFile('defaults.json').then(jsonData => {
        if (!Array.isArray(jsonData)) {
            return prompts.map(prompt => ({ ...prompt }));
        }

        return jsonData
            .filter(prompt => prompt && typeof prompt === 'object')
            .map((prompt, index) => ({
                id: typeof prompt.id === 'string' ? prompt.id : (DEFAULT_PROMPT_IDS[index] || `default-${index}`),
                category: prompt.category || '',
                title: prompt.title || '',
                content: prompt.content || ''
            }));
    });
}

function downloadJsonFile(fileName, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const downloadLink = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    downloadLink.href = objectUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

function exportUserData() {
    downloadJsonFile('userdata.json', loadPromptState());
    showToast('userdata.json byl exportován');
}

function importUserData(file) {
    if (!file) {
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
        try {
            const parsed = JSON.parse(String(fileReader.result || '{}'));
            const normalizedState = normalizePromptState(parsed);
            savePromptStateToStorage(normalizedState);
            displayPrompts(getAllPrompts());
            generateCategories();
            showToast('userdata.json byl načten');
        } catch (error) {
            console.error('Chyba při importu userdata.json:', error);
            showToast('userdata.json se nepodařilo načíst');
        }
    };
    fileReader.readAsText(file, 'utf-8');
}

function getAllPrompts() {
    const customPrompts = loadCustomPrompts();
    const promptState = loadPromptState();
    const visibleDefaults = prompts
        .filter(prompt => !promptState.hiddenDefaultIds.includes(prompt.id))
        .map(prompt => ({
            ...prompt,
            ...((promptState.defaultOverrides || {})[prompt.id] || {}),
            sourceType: 'builtin'
        }));
    const customWithSource = customPrompts.map(prompt => ({
        ...prompt,
        sourceType: 'custom'
    }));

    return [...customWithSource, ...visibleDefaults];
}

// Vykreslí karty promptů podle zadaného filtru
function displayPrompts(filteredPrompts) {
    promptContainer.innerHTML = '';
    filteredPrompts.forEach((prompt, index) => {
        const card = document.createElement('div');
        card.className = 'prompt-card';
        
        // Kontrola, jestli je to vlastní prompt (má id)
        const isCustom = prompt.sourceType === 'custom';
        const promptKey = prompt.id;
        const deleteButton = `<button class="delete-button" data-source="${isCustom ? 'custom' : 'builtin'}" data-key="${promptKey}" data-label="Smazat" aria-label="Smazat" title="Smazat">❌</button>`;
        const editButton = `<button class="edit-button" data-source="${isCustom ? 'custom' : 'builtin'}" data-key="${promptKey}" data-label="Editovat" aria-label="Editovat" title="Editovat">🔧</button>`;
        
        card.innerHTML = `
            <h2>${prompt.title}</h2>
            <div class="hashtag">${prompt.category}</div>
            <p>${prompt.content}</p>
            <div class="card-actions">
                ${editButton}
                <button class="copy-button" data-content="${prompt.content.replace(/"/g, '&quot;')}" data-label="Kopírovat" aria-label="Kopírovat" title="Kopírovat">🗐</button>
                ${deleteButton}
            </div>
        `;
        promptContainer.appendChild(card);
    });
    
    // Přidání event listenerů na všechna tlačítka Kopírovat
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', function() {
            const content = this.getAttribute('data-content');
            copyToClipboard(content);
        });
    });
    
    // Přidání event listenerů na tlačítka Smazat
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function() {
            const source = this.getAttribute('data-source');
            const key = this.getAttribute('data-key');
            
            // Zobrazit potvrzovací dialog
            showDeleteConfirmDialog(source, key);
        });
    });

    // Přidání event listenerů na tlačítka Editovat
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function() {
            const source = this.getAttribute('data-source');
            const key = this.getAttribute('data-key');
            openEditPromptDialog(source, key);
        });
    });
}

// Po načtení stránky zobrazí všechny prompty
displayPrompts(getAllPrompts());

// Dynamicky generuje kategorie ze souboru prompts
function generateCategories() {
    // Získat všechny jedinečné kategorie
    const allPrompts = getAllPrompts();
    const categories = [...new Set(allPrompts.map(prompt => prompt.category))].sort();
    
    // Vyčistit stávající kategorie (kromě "Všechny kategorie")
    const categoryList = document.getElementById('category-list');
    const allCategoriesItem = categoryList.querySelector('[data-category="all"]');
    categoryList.innerHTML = '';
    
    // Přidat "Všechny kategorie" zpět
    categoryList.appendChild(allCategoriesItem);
    
    // Přidat všechny kategorie
    categories.forEach(category => {
        const li = document.createElement('li');
        li.setAttribute('data-category', category);
        li.textContent = category;
        categoryList.appendChild(li);
    });
}

// Vygenerovat kategorie při načtení stránky
generateCategories();

// Funkce pro normalizaci znaků s diakritikou
function normalizeString(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Vyhledávání v reálném čase podle názvu, kategorie i obsahu
searchInput.addEventListener('input', () => {
    const searchTerm = normalizeString(searchInput.value);
    const allPrompts = getAllPrompts();
    const filteredPrompts = allPrompts.filter(prompt => 
        normalizeString(prompt.title).includes(searchTerm) || 
        normalizeString(prompt.category).includes(searchTerm) || 
        normalizeString(prompt.content).includes(searchTerm)
    );
    displayPrompts(filteredPrompts);
});



// Filtrování promptů podle vybrané kategorie
categoryList.addEventListener('click', (event) => {
    const selectedCategory = event.target.dataset.category;
    if (selectedCategory) {
        const allPrompts = getAllPrompts();
        const filteredPrompts = selectedCategory === 'all' ? allPrompts : allPrompts.filter(prompt => prompt.category === selectedCategory);
        displayPrompts(filteredPrompts);
        categoryList.classList.add('hidden');
        // Aktualizace textu tlačítka, aby ukazoval vybranou kategorii
        categoryButton.textContent = selectedCategory === 'all' ? 'Všechny kategorie' : selectedCategory;
    }
});

// Zobrazí toast notifikaci s potvrzením
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 150);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Zkopíruje text do schránky a zobrazí potvrzení
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('✓ Zkopírováno do schránky!');
    }).catch(() => {
        showToast('Chyba při kopírování');
    });
}

// Klávesová zkratka: stisknutím H aktivuje vyhledávání
document.addEventListener('keydown', (event) => {
    // Zkontroluj, zda je stisknuta klávesa 'H' a není zaměřeno na žádné vstupní pole
    if (event.key === 'h' || event.key === 'H') {
        // Neaktivuj, pokud uživatel již píše do vstupního pole
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            event.preventDefault();
            searchInput.focus();
        }
    }
});

// Pořadí sekcí pro generování XML
const sectionOrder = [
    'role',
    'action',
    'context',
    'format',
    'restrictions',
    'sources',
    'questions',
    'examples'
];

// Ošetří text pro bezpečné vložení do XML
function escapeXml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Vytvoří XML výstup podle aktivních sekcí
function updateXmlOutput() {
    if (!xmlOutput) {
        return;
    }

    const lines = [''];
    sectionOrder.forEach(section => {
        const card = document.querySelector(`.builder-card[data-section="${section}"]`);
        if (!card || card.dataset.active !== 'true') {
            return;
        }
        const textarea = card.querySelector('textarea');
        const value = textarea ? textarea.value.trim() : '';
        lines.push(`  <${section}>${escapeXml(value)}</${section}>`);
    });
    lines.push('');
    xmlOutput.value = lines.join('\n');
}

// Nastaví stav tlačítka pro přidání sekce
function setAddButtonState(section, isActive) {
    const button = document.querySelector(`.section-add-button[data-section="${section}"]`);
    if (!button) {
        return;
    }
    button.classList.toggle('disabled', isActive);
    button.disabled = isActive;
}

// Obsluha skrytí/zobrazení a disable všech sekcí po kliknutí na toolbar
function toggleBuilderCards(shouldHide) {
    if (builderSections) {
        let willBeHidden;
        if (shouldHide !== undefined) {
            willBeHidden = shouldHide;
            builderSections.classList.toggle('hidden', shouldHide);
        } else {
            willBeHidden = !builderSections.classList.contains('hidden');
            builderSections.classList.toggle('hidden');
        }
        // Disable/enable všechny textarea a tlačítka v sekcích
        const textareas = builderSections.querySelectorAll('textarea');
        const buttons = builderSections.querySelectorAll('.remove-section');
        
        textareas.forEach(textarea => {
            textarea.disabled = willBeHidden;
        });
        buttons.forEach(button => {
            button.disabled = willBeHidden;
        });
    }
}

function setActiveGroup(group) {
    treeGroups.forEach(treeGroup => {
        const isActiveGroup = treeGroup.dataset.group === group;
        if (isActiveGroup) {
            treeGroup.dataset.open = 'true';
        }
    });

    treeParentButtons.forEach(button => {
        const isActiveGroup = button.dataset.group === group;
        button.classList.toggle('active', isActiveGroup);
    });
}

// Přepne mezi stránkami Knihovna, Customní prompt a Nový prompt
function setPage(page) {
    const resolvedPage = PAGE_HIERARCHY[page] ? page : 'library';
    const metadata = PAGE_HIERARCHY[resolvedPage];

    setActiveGroup(metadata.group);

    const pageMap = {
        'library': libraryPage,
        'custom': customPage,
        'new-prompt': newPromptPage,
        'agents': agentsPage,
        'system-settings': systemSettingsPage,
        'presentation': presentationPage,
        'images': imagesPage,
        'videos': videosPage,
        'prompt-engineering-theory': promptEngineeringTheoryPage,
        'copilot-fallback': copilotFallbackPage
    };

    Object.entries(pageMap).forEach(([key, element]) => {
        if (element) {
            element.classList.toggle('hidden', key !== resolvedPage);
        }
    });

    if (navElement) {
        navElement.classList.toggle('hidden', resolvedPage !== 'library');
    }
    if (fabContainer) {
        const shouldShowFab = resolvedPage === 'library';
        fabContainer.classList.toggle('hidden', !shouldShowFab);
        if (!shouldShowFab) {
            closeFabMenu();
        }
    }
    pageButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.page === resolvedPage);
    });
}

// Obsluha přepínání stránek přes horní tlačítka
pageButtons.forEach(button => {
    button.addEventListener('click', () => {
        setPage(button.dataset.page);
    });
});

treeParentButtons.forEach(button => {
    button.addEventListener('click', () => {
        const group = button.dataset.group;
        if (!group) {
            return;
        }
        const groupElement = document.querySelector(`.tree-group[data-group="${group}"]`);
        if (!groupElement) {
            return;
        }

        const isOpen = groupElement.dataset.open === 'true';
        groupElement.dataset.open = isOpen ? 'false' : 'true';
    });
});

// Obsluha skrytí sekcí a změn obsahu v builderu
builderCards.forEach(card => {
    const section = card.dataset.section;
    const removeButton = card.querySelector('.remove-section');
    const textarea = card.querySelector('textarea');
    const isActive = card.dataset.active === 'true';

    if (removeButton) {
        removeButton.addEventListener('click', () => {
            card.dataset.active = 'false';
            card.classList.add('hidden');
            setAddButtonState(section, false);
            updateXmlOutput();
        });
    }

    if (textarea) {
        textarea.addEventListener('input', () => {
            updateXmlOutput();
        });
    }

    setAddButtonState(section, isActive);
});

// Obsluha togglování sekcí - skrytí/zobrazení po kliknutí na tlačítko
addButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.disabled) {
            return;
        }
        const section = button.dataset.section;
        const card = document.querySelector(`.builder-card[data-section="${section}"]`);
        if (!card) {
            return;
        }
        
        // Toggle visibility
        const isCurrentlyHidden = card.classList.contains('hidden');
        if (isCurrentlyHidden) {
            // Show the section
            card.dataset.active = 'true';
            card.classList.remove('hidden');
            setAddButtonState(section, true);
            const textarea = card.querySelector('textarea');
            if (textarea) {
                textarea.focus();
            }
        } else {
            // Hide the section
            card.dataset.active = 'false';
            card.classList.add('hidden');
            setAddButtonState(section, false);
        }
        updateXmlOutput();
    });
});

// Kopírování XML do schránky
if (copyXmlButton) {
    copyXmlButton.addEventListener('click', () => {
        copyToClipboard(xmlOutput.value);
    });
}

// Obsluha skrytí/zobrazení sekcí po kliknutí na toolbar
if (builderToolbar) {
    builderToolbar.addEventListener('click', (event) => {
        // Neaplikuj toggle, pokud byl kliknut na tlačítko sekce nebo jej obsah
        const clickedButton = event.target.closest('.section-add-button');
        if (clickedButton) {
            return;
        }
        toggleBuilderCards();
    });
}

// === FUNKCE PRO NOVOU STRÁNKU (Nový prompt do knihovny) ===

// Vyčistí formulář
function clearForm() {
    if (newPromptCategory) newPromptCategory.value = '';
    if (newPromptTitle) newPromptTitle.value = '';
    if (newPromptContent) newPromptContent.value = '';
}

function getPromptByTarget(source, key) {
    return getAllPrompts().find(prompt => prompt.id === key && prompt.sourceType === source) || null;
}

function openEditPromptDialog(source, key) {
    if (!editPromptModal || !editPromptCategory || !editPromptTitleInput || !editPromptContent) {
        return;
    }
    const prompt = getPromptByTarget(source, key);
    if (!prompt) {
        showToast('Prompt nebyl nalezen');
        return;
    }

    currentEditTarget = { source, key };
    editPromptCategory.value = prompt.category || '';
    editPromptTitleInput.value = prompt.title || '';
    editPromptContent.value = prompt.content || '';
    editPromptModal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    editPromptTitleInput.focus();
}

function closeEditPromptDialog() {
    if (!editPromptModal) {
        return;
    }
    editPromptModal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    currentEditTarget = null;
}

function showDeleteConfirmDialog(source, key) {
    if (!deletePromptModal) {
        return;
    }
    pendingDelete = { source, key };
    deletePromptModal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    confirmDeletePromptButton.focus();
}

function closeDeleteConfirmDialog() {
    if (!deletePromptModal) {
        return;
    }
    deletePromptModal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    pendingDelete = null;
}

function openStartupPageDialog() {
    if (!startupPageModal) {
        return;
    }
    startupPageModal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.body.classList.add('startup-open');
    if (startupPageButtons.length > 0) {
        startupPageButtons[0].focus();
    }
}

function closeStartupPageDialog() {
    if (!startupPageModal) {
        return;
    }
    startupPageModal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.body.classList.remove('startup-open');
}

function confirmDeletePrompt() {
    if (!pendingDelete) {
        return;
    }
    const { source, key } = pendingDelete;
    closeDeleteConfirmDialog();
    deletePrompt(source, key);
}

function saveEditedPrompt() {
    if (!currentEditTarget || !editPromptCategory || !editPromptTitleInput || !editPromptContent) {
        return;
    }

    const categoryRaw = editPromptCategory.value.trim();
    const title = editPromptTitleInput.value.trim();
    const content = editPromptContent.value.trim();

    if (!categoryRaw || !title || !content) {
        showToast('⚠ Vyplň všechny pole!');
        return;
    }

    const category = categoryRaw.startsWith('#') ? categoryRaw : `#${categoryRaw}`;

    if (currentEditTarget.source === 'custom') {
        const customPrompts = loadCustomPrompts();
        const targetIndex = customPrompts.findIndex(prompt => prompt.id === currentEditTarget.key);

        if (targetIndex === -1) {
            showToast('Prompt nebyl nalezen');
            return;
        }

        customPrompts[targetIndex] = {
            ...customPrompts[targetIndex],
            category,
            title,
            content
        };
        if (!saveCustomPrompts(customPrompts)) {
            showToast('✗ Chyba při ukládání promptu');
            return;
        }
    } else {
        const promptState = loadPromptState();
        const builtinPrompt = prompts.find(prompt => prompt.id === currentEditTarget.key);
        if (!builtinPrompt) {
            showToast('Prompt nebyl nalezen');
            return;
        }
        promptState.defaultOverrides[currentEditTarget.key] = {
            category,
            title,
            content
        };

        if (!savePromptStateToStorage(promptState)) {
            showToast('✗ Chyba při ukládání promptu');
            return;
        }
    }

    closeEditPromptDialog();
    generateCategories();
    displayPrompts(getAllPrompts());
    showToast('✓ Prompt byl upraven');
}

// Uloží nový prompt
function saveNewPrompt() {
    if (!newPromptCategory || !newPromptTitle || !newPromptContent) return;
    
    const category = newPromptCategory.value.trim();
    const title = newPromptTitle.value.trim();
    const content = newPromptContent.value.trim();
    
    // Validace
    if (!category || !title || !content) {
        showToast('⚠ Vyplň všechny pole!');
        return;
    }
    
    // Ujisti se, že kategorie začíná #
    const formattedCategory = category.startsWith('#') ? category : '#' + category;
    
    // Načti stávající prompty
    const customPrompts = loadCustomPrompts();
    
    // Vytvoř nový prompt s jedinečným ID
    const newPrompt = {
        id: `custom-${Date.now().toString()}`,
        category: formattedCategory,
        title: title,
        content: content
    };
    
    // Přidej na začátek pole (nejnovější první)
    customPrompts.unshift(newPrompt);
    
    // Ulož
    if (saveCustomPrompts(customPrompts)) {
        showToast('✓ Prompt úspěšně uložen!');
        clearForm();
        generateCategories();
        // Přepni na knihovnu a zobraz všechny prompty včetně nově přidaného
        displayPrompts(getAllPrompts());
        setPage('library');
    } else {
        showToast('✗ Chyba při ukládání promptu');
    }
}

// Smaže prompt (vlastní i vestavěný)
function deletePrompt(source, key) {
    if (source === 'custom') {
        const customPrompts = loadCustomPrompts();
        const filtered = customPrompts.filter(prompt => prompt.id !== key);

        if (!saveCustomPrompts(filtered)) {
            showToast('✗ Chyba při mazání promptu');
            return;
        }
    } else {
        const promptState = loadPromptState();
        const targetPrompt = prompts.find(prompt => prompt.id === key);
        if (!targetPrompt) {
            showToast('Prompt nebyl nalezen');
            return;
        }
        if (!promptState.hiddenDefaultIds.includes(key)) {
            promptState.hiddenDefaultIds.push(key);
        }
        if (promptState.defaultOverrides[key]) {
            delete promptState.defaultOverrides[key];
        }

        if (!savePromptStateToStorage(promptState)) {
            showToast('✗ Chyba při mazání promptu');
            return;
        }
    }

    showToast('✓ Prompt smazán');
    displayPrompts(getAllPrompts());
    generateCategories();
}

// Event listenery pro novou stránku
if (savePromptButton) {
    savePromptButton.addEventListener('click', saveNewPrompt);
}

if (saveEditedPromptButton) {
    saveEditedPromptButton.addEventListener('click', saveEditedPrompt);
}

if (closeEditPromptButton) {
    closeEditPromptButton.addEventListener('click', closeEditPromptDialog);
}

if (editPromptModal) {
    editPromptModal.addEventListener('click', (event) => {
        if (event.target === editPromptModal) {
            closeEditPromptDialog();
        }
    });
}

if (confirmDeletePromptButton) {
    confirmDeletePromptButton.addEventListener('click', confirmDeletePrompt);
}

if (cancelDeletePromptButton) {
    cancelDeletePromptButton.addEventListener('click', closeDeleteConfirmDialog);
}

if (deletePromptModal) {
    deletePromptModal.addEventListener('click', (event) => {
        if (event.target === deletePromptModal) {
            closeDeleteConfirmDialog();
        }
    });
}

startupPageButtons.forEach(button => {
    button.addEventListener('click', () => {
        const group = button.dataset.group;
        const page = group ? GROUP_DEFAULT_PAGE[group] : null;
        if (!page) {
            return;
        }
        setPage(page);
        closeStartupPageDialog();
    });
});

if (startupOpenDefaultButton) {
    startupOpenDefaultButton.addEventListener('click', () => {
        setPage('library');
        closeStartupPageDialog();
    });
}

if (startupCloseButton) {
    startupCloseButton.addEventListener('click', closeStartupPageDialog);
}

if (startupPageModal) {
    startupPageModal.addEventListener('click', (event) => {
        if (event.target === startupPageModal) {
            closeStartupPageDialog();
        }
    });
}

function closeFabMenu() {
    if (!fabMenu || !fabButton) {
        return;
    }
    fabMenu.classList.add('hidden');
    if (fabBackdrop) {
        fabBackdrop.classList.add('hidden');
    }
    fabButton.setAttribute('aria-expanded', 'false');
    fabButton.textContent = '＋';
}

function toggleFabMenu() {
    if (!fabMenu || !fabButton) {
        return;
    }
    const isHidden = fabMenu.classList.contains('hidden');
    fabMenu.classList.toggle('hidden', !isHidden);
    if (fabBackdrop) {
        fabBackdrop.classList.toggle('hidden', !isHidden ? true : false);
    }
    fabButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    fabButton.textContent = isHidden ? '×' : '＋';
}

if (fabButton) {
    fabButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleFabMenu();
    });
}

if (fabBackdrop) {
    fabBackdrop.addEventListener('click', closeFabMenu);
}

if (fabNewPromptButton) {
    fabNewPromptButton.addEventListener('click', () => {
        setPage('new-prompt');
        closeFabMenu();
    });
}

if (fabImportUserDataButton && importUserDataInput) {
    fabImportUserDataButton.addEventListener('click', () => {
        closeFabMenu();
        importUserDataInput.click();
    });

    importUserDataInput.addEventListener('change', (event) => {
        const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
        importUserData(file);
        importUserDataInput.value = '';
    });
}

if (fabExportUserDataButton) {
    fabExportUserDataButton.addEventListener('click', () => {
        exportUserData();
        closeFabMenu();
    });
}

document.addEventListener('click', (event) => {
    if (!fabMenu || !fabButton) {
        return;
    }
    if (fabMenu.classList.contains('hidden')) {
        return;
    }
    if (fabMenu.contains(event.target) || fabButton.contains(event.target)) {
        return;
    }
    closeFabMenu();
});

// === KONEC FUNKCÍ PRO NOVOU STRÁNKU ===

function initializeAppData() {
    return loadDefaultPrompts().then(defaultPromptList => {
        prompts = defaultPromptList;
        const promptState = loadPromptState();
        savePromptStateToStorage(promptState);
        displayPrompts(getAllPrompts());
        generateCategories();
        setPage('library');
        updateXmlOutput();
    });
}

initializeAppData().catch(error => {
    console.error('Chyba při inicializaci aplikace:', error);
    setPage('library');
    updateXmlOutput();
}).finally(() => {
    openStartupPageDialog();
});