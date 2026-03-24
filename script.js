// Seznam všech promptů dostupných v aplikaci
const prompts = [
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

// Přidá interní klíče vestavěným promptům pro editaci
prompts.forEach((prompt, index) => {
    prompt.builtinId = `builtin-${index}`;
});

// Reference na klíčové prvky v DOMu
const promptContainer = document.getElementById('prompt-container');
const searchInput = document.getElementById('search-input');
const categoryButton = document.getElementById('category-button');
const categoryList = document.getElementById('category-list');
const pageButtons = document.querySelectorAll('.page-button');
const libraryPage = document.getElementById('library-page');
const customPage = document.getElementById('custom-page');
const newPromptPage = document.getElementById('new-prompt-page');
const libraryControls = document.querySelector('.library-controls');
const navElement = document.querySelector('nav');
const builderCards = document.querySelectorAll('.builder-card');
const addButtons = document.querySelectorAll('.section-add-button');
const xmlOutput = document.getElementById('xml-output');
const copyXmlButton = document.getElementById('copy-xml');
const builderToolbar = document.getElementById('builder-toolbar');
const builderSections = document.getElementById('builder-sections');

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

// localStorage klíč pro ukládání promptů
const STORAGE_KEY = 'customPrompts';
let currentEditTarget = null;

// Načte vlastní prompty z localStorage
function loadCustomPrompts() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Chyba při načítání promptů:', error);
        return [];
    }
}

// Uloží vlastní prompty do localStorage
function saveCustomPrompts(customPrompts) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customPrompts));
        return true;
    } catch (error) {
        console.error('Chyba při ukládání promptů:', error);
        return false;
    }
}

// Spojí vestavěné a vlastní prompty
function getAllPrompts() {
    const customPrompts = loadCustomPrompts();
    return [...customPrompts, ...prompts];
}

// Vykreslí karty promptů podle zadaného filtru
function displayPrompts(filteredPrompts) {
    promptContainer.innerHTML = '';
    filteredPrompts.forEach((prompt, index) => {
        const card = document.createElement('div');
        card.className = 'prompt-card';
        
        // Kontrola, jestli je to vlastní prompt (má id)
        const isCustom = prompt.id !== undefined;
        const promptKey = isCustom ? prompt.id : prompt.builtinId;
        const deleteButton = `<button class="delete-button" data-source="${isCustom ? 'custom' : 'builtin'}" data-key="${promptKey}">Smazat</button>`;
        const editButton = `<button class="edit-button" data-source="${isCustom ? 'custom' : 'builtin'}" data-key="${promptKey}">Editovat</button>`;
        
        card.innerHTML = `
            <h2>${prompt.title}</h2>
            <div class="hashtag">${prompt.category}</div>
            <p>${prompt.content}</p>
            <div class="card-actions">
                ${editButton}
                <button class="copy-button" data-content="${prompt.content.replace(/"/g, '&quot;')}">Kopírovat!</button>
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
            deletePrompt(source, key);
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

// Přepne mezi stránkami Knihovna, Customní prompt a Nový prompt
function setPage(page) {
    const isLibrary = page === 'library';
    const isCustom = page === 'custom';
    const isNewPrompt = page === 'new-prompt';
    
    if (libraryPage) {
        libraryPage.classList.toggle('hidden', !isLibrary);
    }
    if (customPage) {
        customPage.classList.toggle('hidden', !isCustom);
    }
    if (newPromptPage) {
        newPromptPage.classList.toggle('hidden', !isNewPrompt);
    }
    if (navElement) {
        navElement.classList.toggle('hidden', !isLibrary);
    }
    pageButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.page === page);
    });
}

// Obsluha přepínání stránek přes horní tlačítka
pageButtons.forEach(button => {
    button.addEventListener('click', () => {
        setPage(button.dataset.page);
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
    if (source === 'custom') {
        const customPrompts = loadCustomPrompts();
        return customPrompts.find(prompt => prompt.id === key) || null;
    }
    return prompts.find(prompt => prompt.builtinId === key) || null;
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
        const builtinPrompt = prompts.find(prompt => prompt.builtinId === currentEditTarget.key);
        if (!builtinPrompt) {
            showToast('Prompt nebyl nalezen');
            return;
        }
        builtinPrompt.category = category;
        builtinPrompt.title = title;
        builtinPrompt.content = content;
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
        id: Date.now().toString(),
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
        const targetIndex = prompts.findIndex(prompt => prompt.builtinId === key);
        if (targetIndex === -1) {
            showToast('Prompt nebyl nalezen');
            return;
        }
        prompts.splice(targetIndex, 1);
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

// === KONEC FUNKCÍ PRO NOVOU STRÁNKU ===

setPage('library');
updateXmlOutput();