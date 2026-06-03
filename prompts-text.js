window.PROMPT_LIBRARY_SECTIONS = window.PROMPT_LIBRARY_SECTIONS || {};
window.PROMPT_LIBRARY_SECTIONS.text = [
  {
    "id": "text-daily-briefing-m365",
    "category": "#denní_přehled",
    "title": "Denní briefing z M365",
    "content": "Jsi můj asistent produktivity v Microsoft 365. Prohledej moje e-maily, zprávy v Teams a kalendář za posledních 7 dní a vytvoř souhrn, co mám řešit dnes a zítra. Výstup rozděl do dvou sekcí: 1) Schůzky – čas, název, 1–2 věty shrnutí a co si mám připravit; 2) Akční položky – úkol, kdo jej zadal, termín, doporučený další krok."
  },
  {
    "id": "text-meeting-wrapup-action-items",
    "category": "#proběhlá_schůzka",
    "title": "Okamžitý zápis a úkoly z proběhlé schůzky",
    "content": "Jako můj seniorní projektový manažer analyzuj transkript právě ukončené schůzky {DOPLŇ NÁZEV SCHŮZKY}. Ignoruj nezávaznou konverzaci (small talk). Výstup zformátuj do tabulky se sloupci: 1) Rozhodnutí, 2) Otevřené otázky, 3) Úkoly s odpovědnou osobou a termínem. Na závěr přidej krátký odhad nálady týmu."
  },
  {
    "id": "text-one-to-one-prep",
    "category": "#1:1_schůzka",
    "title": "Příprava na 1:1 schůzku s kolegou",
    "content": "Připrav mě na schůzku s kolegou {DOPLŇ JMÉNO KOLEGY}. Prohledej naše společné e-maily, chaty v Teams a sdílené soubory za posledních 30 dní. Vypiš hlavní témata, nedořešené problémy a úkoly, které si navzájem dlužíme. Výstup dej do stručné agendy v odrážkách."
  },
  {
    "id": "text-polite-decline-proposal",
    "category": "#odmítnutí_pozvánky",
    "title": "Diplomatické odmítnutí pozvánky/projektu",
    "content": "Pomoz mi napsat e-mailovou odpověď na zprávu od {DOPLŇ JMÉNO OSOBY}, kde musím odmítnout jejich pozvánku nebo nabídku kvůli plné kapacitě. Zachovej velmi zdvořilý a profesionální tón, poděkuj za důvěru a navrhni, že se k tomu můžeme vrátit v {DOPLŇ DOBU}. Text má být empatický, ale pevný."
  },
  {
    "id": "text-brainstorm-notes-proposal",
    "category": "#hrubé_poznámky",
    "title": "Přeměna poznámek na profesionální návrh",
    "content": "Jsi seniorní konzultant. Mám zde hrubé poznámky z brainstormingu (viz soubor {DOPLŇ NÁZEV SOUBORU} nebo vložený text {DOPLŇ TEXT}). Přepiš je do strukturovaného návrhu ve Wordu: 1) Manažerské shrnutí, 2) Analýza současného stavu, 3) Navrhované řešení, 4) Odhadované přínosy. Text ať je formální a přesvědčivý."
  },
  {
    "id": "text-project-status-overview",
    "category": "#status_projektu",
    "title": "Status projektu napříč aplikacemi",
    "content": "Jsi projektový manažer. Potřebuji rychlý přehled o projektu {DOPLŇ NÁZEV PROJEKTU}. Prohledej mé e-maily, chaty v Teams a soubory na OneDrive za posledních 14 dní. Zjisti, kdo naposledy reportoval pokrok, zda se objevil blocker a co je potřeba řešit jako první. Výstup napiš jako stručný report na jednu stránku."
  },
  {
    "id": "text-project-risk-analysis",
    "category": "#projektové_riziko",
    "title": "Analýza rizik projektu",
    "content": "Na základě přiloženého plánu projektu {DOPLŇ NÁZEV SOUBORU} identifikuj 5 potenciálních rizik, která by mohla ohrozit termín dodání nebo rozpočet. U každého rizika odhadni pravděpodobnost a navrhni konkrétní mitigační opatření. Výstup dej do tabulky s jasnými kroky."
  },
  {
    "id": "text-email-summary-response",
    "category": "#e-mail",
    "title": "Shrnutí dlouhé e-mailové konverzace",
    "content": "Jsi můj asistent pro e-maily. Z následující e-mailové konverzace vytáhni 5 nejdůležitějších bodů, rozhodnutí, otázky a akční položky. Pokud je v textu nejasnost, označ ji. Piš stručně."
  },
  {
    "id": "text-vacation-automatic-replies",
    "category": "#dovolená",
    "title": "Tři automatické odpovědi k dovolené",
    "content": "Podívej se do mého kalendáře a sepíš tři automatické odpovědi:\n* Krátkou\n* Středně dlouhou\n* Podrobnou\nV závislosti na okolnostech mé nadcházející dovolené."
  },
  {
    "id": "rewrite-email",
    "category": "#email",
    "title": "Přepis e-mailu do srozumitelného jazyka ",
    "content": "Přepiš tento e-mail do jednoduchého, srozumitelného jazyka vhodného pro čtenáře bez technických znalostí. Termíny a složité fráze nahraď běžnými slovy, ale zachovej původní význam a tón zprávy."
  },
  {
    "id": "rewrite-email-next-steps-owners-deadlines",
    "category": "#e-mail",
    "title": "Přepis e-mailu s dalšími kroky",
    "content": "Přepiš níže uvedený e-mail tak, aby bylo jasně vidět, jaké jsou další kroky, kdo za ně odpovídá a jaké jsou termíny."
  }
  ,
  {
    "id": "text-email-sentiment-analysis",
    "category": "#e-mail",
    "title": "Analýza sentimentu e-mailu",
    "content": "Analyzuj sentiment níže uvedeného e-mailu. Urči, zda je tón znepokojený, frustrovaný, zmatený, naléhavý, pozitivní nebo neutrální. Navrhni tón odpovědi, který by k tomu nejlépe seděl."
  }
  ,
  {
    "id": "text-email-to-qa-faq",
    "category": "#e-mail",
    "title": "Převod e-mailové konverzace na Q&A / FAQ",
    "content": "Převeď níže uvedenou e-mailovou konverzaci do dokumentu ve formátu otázek a odpovědí (Q&A / FAQ)."
  }
  ,
  {
    "id": "text-inbox-cleanup-strategy",
    "category": "#e-mail",
    "title": "Strategie úklidu doručené pošty",
    "content": "Analyzuj moje doručené e-maily. Navrhni strategii úklidu s doporučením složek, pravidel, filtrů a postupů archivace."
  }
];
