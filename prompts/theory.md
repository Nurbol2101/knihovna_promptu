# Teorie promptního inženýrství

Prompt engineering je disciplína, která se zabývá koncipováním vstupních instrukcí pro jazykové, multimodální a agentní modely tak, aby výstupy byly přesné, spolehlivé a opakovatelné.

## Proč na tom záleží

- Kratší a jasnější prompty dávají stabilnější výstupy.
- Dobře zadaný formát snižuje počet oprav a iterací.
- Kontext a příklady zvyšují šanci, že model trefí požadovaný styl.
- Současné modely častěji pracují s nástroji, soubory, obrázky a dlouhým kontextem, takže prompt není jen „text pro chat“, ale často i součást workflow.

## Základní a doporučené (volitelné) části dobrého promptu

- **Role:** Definuj, kdo nebo co má model simulovat (např. odborník, instruktor, copywriter).
- **Úloha:** Stručně a konkrétně popiš, co má model udělat.
- **Kontext:** Doplň relevantní informace, omezení nebo data.
- **Formát:** Uveď očekávaný výstup (odrážky, tabulka, e-mail, slide deck).
- **Příklad:** Ukaž vzor, pokud požaduješ konkrétní styl nebo strukturu.
- **Nástroje:** Uveď, kdy má model vyhledat, spočítat, vygenerovat nebo pracovat se souborem.
- **Omezení:**
- **Zdroje:**
- **Otázky:**

## Běžné techniky

- **Zero-shot:** Zadání bez příkladu, vhodné pro jednoduché úlohy.
- **Few-shot:** Přidáš pár vzorů a model lépe pochopí styl.
- **Decomposition:** Rozdělíš složitý úkol na menší kroky.
- **Iterace:** Postupně zpřesňuješ prompt podle výsledku.
- **Constraint prompting:** Přidáš omezení délky, tónu nebo struktury.
- **Structured output:** Přinutíš model vracet JSON, tabulku nebo pevně dané sekce.
- **Tool use / function calling:** Model volá nástroj místo toho, aby vše hádal z paměti.
- **RAG:** Model čerpá z přiložených zdrojů, dokumentů nebo knowledge base.
- **Agentic workflow:** Model plánuje, rozděluje úkoly a kontroluje dílčí výsledky.

## Praktická pravidla

1. Začni stručně: role + úkol v první větě.
2. Urči formát výstupu a rozsah (např. "max. 6 bodů").
3. Vyhněte se více nesouvisejícím úkolům v jednom promptu.
4. Použij příklady k přenesení stylu.
5. Iteruj podle výsledku — dolaďuj prompt krok za krokem.
6. U nástrojových modelů řekni, kdy mají hledat, kdy se ptát a kdy nemají nic doplňovat.
7. Pokud jde o důležitý výstup, přidej kontrolní kritéria nebo jednoduchou self-check rutinu.

## Nejčastější chyby

- Příliš obecné zadání bez cíle nebo publika.
- Míchání více různých cílů do jedné instrukce.
- Neurčitá slova bez měřítka, například "lepší" nebo "hezčí".
- Chybějící formát, když potřebuješ výstup rovnou použít.
- Zadání, která předpokládají data nebo znalosti, které model nemá.
- Ignorování prompt injection, když model pracuje s externími zdroji.
- Příliš dlouhý prompt bez priorit, který model přetíží.
- Nejasné oddělení mezi fakty, odhadem a doporučením.

## Kontrolní seznam

1. Je jasné, co je výstup a pro koho je určený?
2. Je určený tón, rozsah a struktura?
3. Je v promptu dostatek kontextu, ale ne zbytečný balast?
4. Je možné výstup okamžitě použít bez velkých úprav?
5. Je zřejmé, z jakých zdrojů model smí čerpat?
6. Je jasné, kdy má model požádat o doplnění a kdy pokračovat sám?

## Aktuální témata

- **Multimodální prompty:** Kombinace textu, obrázku, tabulek a souborů.
- **AI asistované programování:** Prompty pro generování patchů, review, testů a refaktorů.
- **MCP a nástroje:** Propojení modelu s externími službami, daty a interními workflow.
- **Evaluace:** Porovnání odpovědí podle přesnosti, konzistence a bezpečnosti.
- **Bezpečnost:** Obrana proti prompt injection, únikům dat a nechtěnému používání nástrojů.
- **Soukromí a lokální modely:** Kdy dává smysl běžet on-prem nebo lokálně.
- **Dlouhý kontext:** Jak pracovat s většími dokumenty, zápisy a rozsáhlými specifikacemi.

## Vzor promptu

```
Role: Jsi seniorní AI konzultant pro produktový tým.
Úkol: Z přiloženého dokumentu připrav krátký návrh prompt workflow pro výzkum, tvorbu obsahu a kontrolu kvality.
Kontext: Cílový tým používá nástroje s dlouhým kontextem, obrazovým vstupem a možností práce se soubory.
Formát: Vrať 5 sekcí: Cíl, Vstupy, Krokování, Kontrola kvality, Rizika.
```

## Doporučené prompty k dalšímu procvičení

- Návrh promptu pro tvorbu dokumentace z technických poznámek.
- Přepis meeting notes do akčního plánu s prioritami.
- Sestavení workflow pro kontrolu faktů a citací.
- Návrh agentního promptu pro rešerši, shrnutí a následný výstup.
