// Seznam všech promptů dostupných v aplikaci
const prompts = [
    {
        category: '#briefing',
        title: 'Denní briefing z M365',
        content: 'Jsi můj asistent produktivity v Microsoft 365. Prohledej moje e‑maily, zprávy v Teams a kalendář za posledních [X] dní a vytvoř souhrn, co mám řešit dnes a zítra. Výstup rozděl do dvou sekcí: 1) Schůzky – čas, název, 1–2 věty shrnutí a co si mám připravit; 2) Akční položky – úkol, kdo jej zadal, termín, doporučený další krok. '
    },
    {
        category: '#meeting_management',
        title: 'Okamžitý zápis a úkoly z proběhlé schůzky',
        content: 'Jako můj projektový manažer analyzuj transkript právě ukončené schůzky [NÁZEV SCHŮZKY / "této schůzky"]. Ignoruj nezávaznou konverzaci (small talk). Výstup zformátuj do tabulky s následujícími sloupci: 1) Rozhodnutí (co bylo finálně schváleno), 2) Otevřené otázky (co se nevyřešilo), 3) Úkoly (konkrétní krok, jméno odpovědné osoby, termín splnění). Na závěr přidej sekci "Sentiment schůzky" – jaká byla nálada týmu.'
    },
    {
        category: '#meeting_management',
        title: 'Příprava na 1:1 schůzku s kolegou',
        content: 'Připrav mě na hodnotící schůzku s kolegou [JMÉNO KOLEGY]. Prohledej naše společné e-maily, chaty v Teams a sdílené soubory za posledních [30 dní]. Vypiš: 1) Hlavní témata, která jsme řešili, 2) Jakékoli nedořešené problémy nebo konflikty, 3) Úkoly, které mi měl dodat on, nebo já jemu. Vytvoř z toho stručnou agendu v odrážkách.'
    },
    {
        category: '#email_productivity',
        title: 'Diplomatické odmítnutí pozvánky/projektu',
        content: 'Pomoz mi napsat e-mailovou odpověď na zprávu od [Jméno/Vložit text], kde musím odmítnout jejich pozvánku/nabídku z důvodu plné kapacity. Zachovej velmi zdvořilý a profesionální tón, poděkuj za důvěru a navrhni, že se k tomu můžeme vrátit v [MĚSÍC/KVARTÁL]. Výstup by měl být empatický, ale zároveň pevný v odmítnutí.'
    },
    {
        category: '#document_creation',
        title: 'Přeměna poznámek na profesionální návrh',
        content: 'Mám zde hrubé poznámky z brainstormingu (viz soubor [NÁZEV SOUBORU] nebo vložený text). Jsi seniorní konzultant. Přepiš tyto poznámky do strukturovaného obchodního návrhu ve Wordu. Použij tuto strukturu: 1) Manažerské shrnutí (Executive Summary), 2) Analýza současného stavu, 3) Navrhované řešení, 4) Odhadované přínosy. Text ať je formální, přesvědčivý a bez gramatických chyb.'
    },
    {
        category: '#document_creation',
        title: 'Změna tónu komunikace směrnice',
        content: 'Vezmi tento odstavec/dokument o firemních pravidlech [VLOŽIT TEXT/SOUBOR]. Aktuální znění je příliš byrokratické a přísné. Přeformuluj text tak, aby zněl moderně, lidsky a motivačně, ale zároveň zachoval věcný význam a závaznost pravidel. Výsledný text by měl být srozumitelný pro nové zaměstnance (Generace Z).'
    },
    {
        category: '#excel_analysis',
        title: 'Hledání trendů v chaotické tabulce',
        content: 'Podívej se na data v tomto excelovém listu. Jsi datový analytik. Nechci vidět jen čísla, ale příběh za nimi. 1) Identifikuj 3 hlavní trendy za poslední období. 2) Najdi jakékoli anomálie nebo odlehlé hodnoty, které by měly upoutat mou pozornost. 3) Navrhni, jaký typ grafu by tato data nejlépe vizualizoval pro prezentaci vedení.'
    },
    {
        category: '#excel_analysis',
        title: 'Tvorba komplexního vzorce s vysvětlením',
        content: 'Potřebuji v Excelu vytvořit vzorec pro sloupec C. Pokud je hodnota ve sloupci A větší než 1000 a zároveň hodnota ve sloupci B obsahuje text "Skladem", vypiš "Priorita", jinak "Běžné". Zároveň pokud je sloupec A prázdný, nepiš nic. Napiš mi tento vzorec a vysvětli krok za krokem, jak funguje, abych se to naučil.'
    },
    {
        category: '#powerpoint_design',
        title: 'Vytvoření prezentace z Word dokumentu',
        content: 'Vytvoř v PowerPointu prezentaci o 10 slidech na základě připojeného dokumentu [NÁZEV SOUBORU WORD]. Jsi expert na storytelling. Každý slide musí obsahovat: Nadpis, maximálně 4 stručné odrážky obsahu a do poznámek pro přednášejícího (Speaker Notes) napiš detailní vysvětlení, co mám k danému slidu říkat. Rozvrhni prezentaci na Úvod, Problém, Řešení, Harmonogram a Závěr.'
    },
    {
        category: '#powerpoint_design',
        title: 'Vylepšení a restrukturalizace slidu',
        content: 'Analyzuj text na aktuálním slidu. Je tam příliš mnoho textu a působí to nepřehledně. 1) Zkrať text o 50 %, aniž by se ztratila klíčová sdělení. 2) Navrhni rozdělení obsahu do vizuálních bloků nebo procesního diagramu. 3) Navrhni vhodný nadpis, který vystihuje hlavní myšlenku.'
    },
    {
        category: '#project_management',
        title: 'Status projektu napříč aplikacemi',
        content: 'Jsi projektový manažer. Potřebuji rychlý přehled o projektu [NÁZEV PROJEKTU]. Prohledej mé e-maily, chaty v Teams a soubory na OneDrive za posledních 14 dní. Zjisti: Kdo naposledy reportoval nějaký pokrok? Zmínil někdo nějaké zdržení nebo "blocker"? Vytvoř souhrnný report o jedné stránce.'
    },
    {
        category: '#project_management',
        title: 'Analýza rizik projektu',
        content: 'Na základě přiloženého plánu projektu [SOUBOR/TEXT] identifikuj 5 potenciálních rizik, která by mohla ohrozit termín dodání nebo rozpočet. U každého rizika odhadni pravděpodobnost (Vysoká/Střední/Nízká) a navrhni konkrétní mitigační opatření (jak riziku předejít).'
    }
];

// Reference na klíčové prvky v DOMu
const promptContainer = document.getElementById('prompt-container');
const searchInput = document.getElementById('search-input');
const categoryButton = document.getElementById('category-button');
const categoryList = document.getElementById('category-list');

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
            <button class="copy-button" data-content="${prompt.content.replace(/"/g, '&quot;')}">Kopírovat</button>
        `;
        promptContainer.appendChild(card);
    });
    
    // Add event listeners to all copy buttons
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

// Vyhledávání v reálném čase podle názvu, kategorie i obsahu
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPrompts = prompts.filter(prompt => 
        prompt.title.toLowerCase().includes(searchTerm) || 
        prompt.category.toLowerCase().includes(searchTerm) || 
        prompt.content.toLowerCase().includes(searchTerm)
    );
    displayPrompts(filteredPrompts);
});

// Otevře nebo zavře rozbalovací seznam kategorií
// Disabled - hover is used instead
// categoryButton.addEventListener('click', () => {
//     categoryList.classList.toggle('hidden');
// });

// Filtrování promptů podle vybrané kategorie
categoryList.addEventListener('click', (event) => {
    const selectedCategory = event.target.dataset.category;
    if (selectedCategory) {
        const filteredPrompts = selectedCategory === 'all' ? prompts : prompts.filter(prompt => prompt.category === selectedCategory);
        displayPrompts(filteredPrompts);
        categoryList.classList.add('hidden');
    }
});

// Zobrazí toast notifikaci s potvrzením
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
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