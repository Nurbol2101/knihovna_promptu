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

// Reference na klíčové prvky v DOMu
const promptContainer = document.getElementById('prompt-container');
const searchInput = document.getElementById('search-input');
const categoryButton = document.getElementById('category-button');
const categoryList = document.getElementById('category-list');
const pageButtons = document.querySelectorAll('.page-button');
const libraryPage = document.getElementById('library-page');
const customPage = document.getElementById('custom-page');
const libraryControls = document.querySelector('.library-controls');
const builderCards = document.querySelectorAll('.builder-card');
const addButtons = document.querySelectorAll('.section-add-button');
const xmlOutput = document.getElementById('xml-output');
const copyXmlButton = document.getElementById('copy-xml');

// Vykreslí karty promptů podle zadaného filtru
function displayPrompts(filteredPrompts) {
    promptContainer.innerHTML = '';
    filteredPrompts.forEach(prompt => {
        const card = document.createElement('div');
        card.className = 'prompt-card';
        card.innerHTML = `
            <h2>${prompt.title}</h2>
            <div class="hashtag">${prompt.category}</div>
            <p>${prompt.content}</p>
            <button class="copy-button" data-content="${prompt.content.replace(/"/g, '&quot;')}">Kopírovat!</button>
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
}

// Po načtení stránky zobrazí všechny prompty
displayPrompts(prompts);

// Dynamicky generuje kategorie ze souboru prompts
function generateCategories() {
    // Získat všechny jedinečné kategorie
    const categories = [...new Set(prompts.map(prompt => prompt.category))].sort();
    
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
    const filteredPrompts = prompts.filter(prompt => 
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
        const filteredPrompts = selectedCategory === 'all' ? prompts : prompts.filter(prompt => prompt.category === selectedCategory);
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
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
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

// Přepne mezi stránkami Knihovna a Customní prompt
function setPage(page) {
    const isLibrary = page === 'library';
    if (libraryPage) {
        libraryPage.classList.toggle('hidden', !isLibrary);
    }
    if (customPage) {
        customPage.classList.toggle('hidden', isLibrary);
    }
    if (libraryControls) {
        libraryControls.classList.toggle('hidden', !isLibrary);
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

// Obsluha znovu-zobrazení skrytých sekcí
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
        card.dataset.active = 'true';
        card.classList.remove('hidden');
        setAddButtonState(section, true);
        const textarea = card.querySelector('textarea');
        if (textarea) {
            textarea.focus();
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

setPage('library');
updateXmlOutput();