// Seznam vestavěných promptů dostupných v aplikaci
let builtinPrompts = [];

const PROMPT_SECTION_TYPES = {
    text: 'json',
    presentation: 'json',
    images: 'json',
    agent: 'json',
    system: 'json',
    theory: 'markdown',
    other: 'markdown'
};

const HAS_PROMPT_SECTION_SCRIPTS = typeof window !== 'undefined' && !!window.PROMPT_LIBRARY_SECTIONS;

const TEXT_PROMPTS_PAGE = 'text-prompts';
const FAB_VISIBLE_PAGES = new Set([TEXT_PROMPTS_PAGE, 'presentation', 'images', 'agents', 'system-settings']);
const FAB_NEW_PROMPT_LABELS = {
    [TEXT_PROMPTS_PAGE]: 'Přidat prompt do textových promptů',
    presentation: 'Přidat prompt do prezentace',
    images: 'Přidat prompt do obrázků',
    agents: 'Přidat prompt pro agenta',
    'system-settings': 'Přidat systémovou instrukci'
};

const PAGE_PROMPT_SECTION = {
    [TEXT_PROMPTS_PAGE]: 'text',
    presentation: 'presentation',
    images: 'images',
    agents: 'agent',
    'system-settings': 'system',
    'prompt-engineering-theory': 'theory',
    'copilot-fallback': 'other'
};

const CARD_PAGES = new Set([TEXT_PROMPTS_PAGE, 'presentation', 'images', 'agents', 'system-settings']);

let currentPage = TEXT_PROMPTS_PAGE;
let currentSearchTerm = '';
let currentCategory = 'all';
let pendingNewPromptSection = 'text';
let pendingNewPromptPage = TEXT_PROMPTS_PAGE;

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
const fabNewPromptButton = document.getElementById('fab-new-prompt');

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

if (promptContainer) {
    promptContainer.classList.add('prompt-container');
}

const PAGE_HIERARCHY = {
    [TEXT_PROMPTS_PAGE]: { group: 'prompts' },
    'new-prompt': { group: 'prompts' },
    'custom': { group: 'prompts' },
    'presentation': { group: 'prompts' },
    'images': { group: 'prompts' },
    'agents': { group: 'tools' },
    'system-settings': { group: 'tools' },
    'prompt-engineering-theory': { group: 'outputs' },
    'copilot-fallback': { group: 'outputs' }
};

const GROUP_DEFAULT_PAGE = {
    'prompts': TEXT_PROMPTS_PAGE,
    'tools': 'agents',
    'outputs': 'prompt-engineering-theory'
};

// localStorage klíč pro ukládání stavu promptů
const PROMPT_STATE_KEY = 'promptLibraryState';
const LEGACY_CUSTOM_PROMPTS_KEY = 'customPrompts';
let currentEditTarget = null;
let pendingDelete = null;
let currentNewPromptTargetPage = TEXT_PROMPTS_PAGE;

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
        defaultOverrides: safePromptState.defaultOverrides && typeof safePromptState.defaultOverrides === 'object' ? safePromptState.defaultOverrides : {},
        order: Array.isArray(safePromptState.order) ? safePromptState.order : []
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

function reconcilePromptStateWithBuiltinPrompts(promptState, defaultPromptList) {
    const normalizedState = normalizePromptState(promptState);
    const builtinIds = new Set(
        defaultPromptList
            .filter(prompt => prompt && typeof prompt.id === 'string' && prompt.id.trim())
            .map(prompt => prompt.id)
    );

    normalizedState.hiddenDefaultIds = normalizedState.hiddenDefaultIds
        .filter(id => typeof id === 'string' && builtinIds.has(id));

    const filteredOverrides = {};
    Object.entries(normalizedState.defaultOverrides || {}).forEach(([id, override]) => {
        if (builtinIds.has(id)) {
            filteredOverrides[id] = override;
        }
    });
    normalizedState.defaultOverrides = filteredOverrides;

    // Recovery guard: if local state hides every built-in prompt, restore defaults.
    if (builtinIds.size > 0 && normalizedState.hiddenDefaultIds.length >= builtinIds.size) {
        normalizedState.hiddenDefaultIds = [];
    }

    return normalizedState;
}

function loadCustomPrompts() {
    return loadPromptState().customPrompts.map(prompt => ({
        ...prompt,
        section: typeof prompt.section === 'string' && prompt.section ? prompt.section : 'text'
    }));
}

function saveCustomPrompts(customPrompts) {
    const promptState = loadPromptState();
    promptState.customPrompts = customPrompts.map(prompt => ({
        ...prompt,
        section: typeof prompt.section === 'string' && prompt.section ? prompt.section : 'text'
    }));
    return savePromptStateToStorage(promptState);
}

function getSectionScriptData(section) {
    if (!HAS_PROMPT_SECTION_SCRIPTS) {
        return null;
    }

    return window.PROMPT_LIBRARY_SECTIONS[section] ?? null;
}

function normalizeBuiltinPrompt(prompt, section, index) {
    const safePrompt = prompt && typeof prompt === 'object' ? prompt : {};

    return {
        id: typeof safePrompt.id === 'string' && safePrompt.id.trim()
            ? safePrompt.id
            : `${section}-${index}`,
        category: typeof safePrompt.category === 'string' ? safePrompt.category : '',
        title: typeof safePrompt.title === 'string' ? safePrompt.title : '',
        content: typeof safePrompt.content === 'string' ? safePrompt.content : '',
        section
    };
}

function normalizeCustomPrompt(prompt) {
    const safePrompt = prompt && typeof prompt === 'object' ? prompt : {};

    return {
        ...safePrompt,
        section: typeof safePrompt.section === 'string' && safePrompt.section ? safePrompt.section : 'text'
    };
}

function loadBuiltinPrompts() {
    const sectionEntries = Object.entries(PROMPT_SECTION_TYPES);
    const loadedPrompts = [];

    sectionEntries.forEach(([section, sectionType]) => {
        const sectionData = getSectionScriptData(section);

        if (sectionType === 'markdown') {
            const mdContent = typeof sectionData === 'string' ? sectionData : '';
            loadedPrompts.push({
                id: `${section}-md`,
                category: '',
                title: '',
                content: mdContent,
                section,
                isMarkdown: true
            });
            return;
        }

        if (!Array.isArray(sectionData)) {
            return;
        }

        sectionData
            .filter(prompt => prompt && typeof prompt === 'object')
            .forEach((prompt, index) => {
                loadedPrompts.push(normalizeBuiltinPrompt(prompt, section, index));
            });
    });

    return Promise.resolve(loadedPrompts);
}

function renderMarkdownToHtml(md) {
    if (!md) return '';

    const escapeHtml = (text) => text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const renderInline = (text) => {
        let html = escapeHtml(text);
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>');
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
        return html;
    };

    const lines = md.replace(/\r\n/g, '\n').split('\n');
    const blocks = [];
    let paragraphLines = [];
    let listItems = [];
    let listType = null;
    let quoteLines = [];
    let inCodeBlock = false;
    let codeBuffer = [];

    const flushParagraph = () => {
        if (!paragraphLines.length) return;
        blocks.push(`<p>${renderInline(paragraphLines.join(' '))}</p>`);
        paragraphLines = [];
    };

    const flushList = () => {
        if (!listItems.length || !listType) return;
        const tag = listType === 'ol' ? 'ol' : 'ul';
        blocks.push(`<${tag}>${listItems.map(item => `<li>${renderInline(item)}</li>`).join('')}</${tag}>`);
        listItems = [];
        listType = null;
    };

    const flushQuote = () => {
        if (!quoteLines.length) return;
        blocks.push(`<blockquote>${quoteLines.map(line => `<p>${renderInline(line)}</p>`).join('')}</blockquote>`);
        quoteLines = [];
    };

    const flushCode = () => {
        if (!inCodeBlock) return;
        blocks.push(`<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
        codeBuffer = [];
        inCodeBlock = false;
    };

    const flushAll = () => {
        flushParagraph();
        flushList();
        flushQuote();
    };

    for (const rawLine of lines) {
        const line = rawLine.trimEnd();
        const trimmed = line.trim();

        if (trimmed.startsWith('```')) {
            if (inCodeBlock) {
                flushCode();
            } else {
                flushAll();
                inCodeBlock = true;
            }
            continue;
        }

        if (inCodeBlock) {
            codeBuffer.push(rawLine);
            continue;
        }

        if (!trimmed) {
            flushAll();
            continue;
        }

        const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
            flushAll();
            const level = Math.min(6, headingMatch[1].length + 1);
            blocks.push(`<h${level}>${renderInline(headingMatch[2])}</h${level}>`);
            continue;
        }

        if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
            flushAll();
            blocks.push('<hr/>');
            continue;
        }

        const quoteMatch = trimmed.match(/^>\s?(.*)$/);
        if (quoteMatch) {
            flushParagraph();
            flushList();
            quoteLines.push(quoteMatch[1]);
            continue;
        }

        const unorderedMatch = trimmed.match(/^[-*+]\s+(.+)$/);
        const orderedMatch = trimmed.match(/^\d+[.)]\s+(.+)$/);
        if (unorderedMatch || orderedMatch) {
            flushParagraph();
            flushQuote();
            const nextType = unorderedMatch ? 'ul' : 'ol';
            if (listType && listType !== nextType) {
                flushList();
            }
            listType = nextType;
            listItems.push((unorderedMatch || orderedMatch)[1]);
            continue;
        }

        flushQuote();
        flushList();
        paragraphLines.push(line);
    }

    flushAll();
    flushCode();

    return blocks.join('');
}

// Highlight text within curly braces by wrapping it with a span
function highlightBracedText(text) {
    if (!text) return text;
    return text.replace(/\{([^}]+)\}/g, '<span class="braced-text">{$1}</span>');
}

function getPromptSectionForPage(page) {
    if (page === TEXT_PROMPTS_PAGE) {
        return 'text';
    }

    return PAGE_PROMPT_SECTION[page] || null;
}

function getCustomPromptsForSection(section) {
    return loadCustomPrompts().filter(prompt => {
        const promptSection = typeof prompt.section === 'string' && prompt.section.trim() ? prompt.section : 'text';
        return promptSection === section;
    });
}

// --- Drag & drop reordering for prompt cards ---
function initPromptCardDrag() {
    if (!promptContainer) return;

    let dragged = null;
    let placeholder = null;
    let startX = 0, startY = 0, offsetX = 0, offsetY = 0;
    let dragPointerId = null;
    let dragStartTimer = null;
    let pendingDragCard = null;
    let pendingDragEvent = null;
    let pendingPointerId = null;
    let holdStartX = 0;
    let holdStartY = 0;
    // auto-scroll while dragging near viewport edges
    let autoScrollInterval = null;
    let autoScrollDirection = 0; // -1 = up, 1 = down, 0 = none
    let lastClientX = 0, lastClientY = 0;
    const EDGE_SCROLL_THRESHOLD = 80; // px from viewport edge to start scrolling
    const EDGE_SCROLL_MAX_SPEED = 24; // px per interval
    const HYSTERESIS_PX = 12; // spatial hysteresis to avoid flicker when near center
    const DRAG_HOLD_DELAY_MS = 200;
    const DRAG_CANCEL_DISTANCE_PX = 6;
    let lastNearestEl = null;
    let lastInsertBefore = null;

    function clearPendingDrag() {
        if (dragStartTimer) {
            clearTimeout(dragStartTimer);
            dragStartTimer = null;
        }
        pendingDragCard = null;
        pendingDragEvent = null;
        pendingPointerId = null;
    }

    function startDrag(card, e) {
        dragged = card;
        dragPointerId = e.pointerId;

        const rect = card.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        offsetX = startX - rect.left;
        offsetY = startY - rect.top;

        // create placeholder to keep layout
        placeholder = document.createElement('div');
        placeholder.className = 'prompt-card placeholder';
        placeholder.style.width = `${rect.width}px`;

        // style dragged card as fixed so it can follow the pointer
        card.classList.add('dragging');
        card.style.position = 'fixed';
        card.style.left = `${rect.left}px`;
        card.style.top = `${rect.top}px`;
        card.style.width = `${rect.width}px`;
        card.style.pointerEvents = 'none';
        card.style.zIndex = 10000;

        // insert placeholder where the card currently is to preserve layout
        if (card.parentNode === promptContainer) {
            promptContainer.insertBefore(placeholder, card);
        } else {
            promptContainer.appendChild(placeholder);
        }

        // capture the pointer so we reliably receive pointerup
        try { card.setPointerCapture && card.setPointerCapture(e.pointerId); } catch (err) {}

        // show grid styling on container
        promptContainer.classList.add('drag-grid');

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp, { once: true });
    }

    function startAutoScroll(dir) {
        autoScrollDirection = dir;
        if (autoScrollInterval) return;
        autoScrollInterval = setInterval(() => {
            if (!autoScrollDirection) return;
            const h = window.innerHeight;
            let dist = 0;
            if (autoScrollDirection === -1) {
                dist = Math.max(0, EDGE_SCROLL_THRESHOLD - lastClientY);
            } else {
                dist = Math.max(0, lastClientY - (h - EDGE_SCROLL_THRESHOLD));
            }
            const speed = Math.max(2, Math.ceil((dist / EDGE_SCROLL_THRESHOLD) * EDGE_SCROLL_MAX_SPEED));
            window.scrollBy(0, autoScrollDirection * speed);
        }, 50);
    }

    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
        autoScrollDirection = 0;
    }

    const onPointerDown = (e) => {
        const card = e.target.closest('.prompt-card');
        if (!card || (e.button && e.button !== 0)) return; // only left mouse

        // Delay drag start so clicks on action buttons stay clicks.
        clearPendingDrag();
        pendingDragCard = card;
        pendingDragEvent = e;
        holdStartX = e.clientX;
        holdStartY = e.clientY;
        pendingPointerId = e.pointerId;

        dragStartTimer = setTimeout(() => {
            if (!pendingDragCard || !pendingDragEvent) return;
            startDrag(pendingDragCard, pendingDragEvent);
            clearPendingDrag();
        }, DRAG_HOLD_DELAY_MS);

        const onPendingMove = (moveEvent) => {
            if (!pendingDragCard || moveEvent.pointerId !== pendingPointerId) return;
            const movedX = Math.abs(moveEvent.clientX - holdStartX);
            const movedY = Math.abs(moveEvent.clientY - holdStartY);
            if (movedX > DRAG_CANCEL_DISTANCE_PX || movedY > DRAG_CANCEL_DISTANCE_PX) {
                clearPendingDrag();
                window.removeEventListener('pointermove', onPendingMove);
                window.removeEventListener('pointerup', onPendingUp);
                window.removeEventListener('pointercancel', onPendingCancel);
            }
        };

        const onPendingUp = (upEvent) => {
            if (upEvent.pointerId !== pendingPointerId) return;
            clearPendingDrag();
            window.removeEventListener('pointermove', onPendingMove);
            window.removeEventListener('pointerup', onPendingUp);
            window.removeEventListener('pointercancel', onPendingCancel);
        };

        const onPendingCancel = (cancelEvent) => {
            if (cancelEvent.pointerId !== pendingPointerId) return;
            clearPendingDrag();
            window.removeEventListener('pointermove', onPendingMove);
            window.removeEventListener('pointerup', onPendingUp);
            window.removeEventListener('pointercancel', onPendingCancel);
        };

        window.addEventListener('pointermove', onPendingMove);
        window.addEventListener('pointerup', onPendingUp, { once: true });
        window.addEventListener('pointercancel', onPendingCancel, { once: true });
    };

    const onPointerMove = (e) => {
        if (!dragged) return;
        const clientX = e.clientX;
        const clientY = e.clientY;
        lastClientX = clientX;
        lastClientY = clientY;
        dragged.style.left = `${clientX - offsetX}px`;
        dragged.style.top = `${clientY - offsetY}px`;

        // auto-scroll when near top or bottom of viewport
        let desiredDir = 0;
        if (clientY < EDGE_SCROLL_THRESHOLD) desiredDir = -1;
        else if (clientY > window.innerHeight - EDGE_SCROLL_THRESHOLD) desiredDir = 1;
        if (desiredDir !== autoScrollDirection) {
            if (desiredDir === 0) stopAutoScroll(); else startAutoScroll(desiredDir);
        }

        const children = Array.from(promptContainer.querySelectorAll('.prompt-card'))
            .filter(el => el !== dragged && el !== placeholder);

        const containerRect = promptContainer.getBoundingClientRect();
        const adjX = Math.min(Math.max(clientX, containerRect.left + 1), containerRect.right - 1);
        const adjY = Math.min(Math.max(clientY, containerRect.top + 1), containerRect.bottom - 1);

        if (children.length === 0) {
            if (placeholder.parentNode !== promptContainer) promptContainer.appendChild(placeholder);
            return;
        }

        const metrics = children.map(child => {
            const rect = child.getBoundingClientRect();
            return {
                el: child,
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom,
                cx: rect.left + rect.width / 2,
                cy: rect.top + rect.height / 2,
                width: rect.width,
                height: rect.height,
            };
        });

        const averageHeight = metrics.reduce((sum, item) => sum + item.height, 0) / metrics.length;
        const rowTolerance = Math.max(24, averageHeight * 0.6);

        const rows = [];
        for (const item of metrics.sort((a, b) => a.cy - b.cy || a.cx - b.cx)) {
            const row = rows[rows.length - 1];
            if (!row || Math.abs(item.cy - row.centerY) > rowTolerance) {
                rows.push({
                    cards: [item],
                    centerY: item.cy,
                    top: item.top,
                    bottom: item.bottom,
                });
            } else {
                row.cards.push(item);
                row.centerY = row.cards.reduce((sum, card) => sum + card.cy, 0) / row.cards.length;
                row.top = Math.min(row.top, item.top);
                row.bottom = Math.max(row.bottom, item.bottom);
            }
        }

        let targetRow = rows[0];
        let targetRowDistance = Infinity;
        for (const row of rows) {
            const distance = adjY < row.top ? row.top - adjY : adjY > row.bottom ? adjY - row.bottom : 0;
            if (distance < targetRowDistance) {
                targetRowDistance = distance;
                targetRow = row;
            }
        }

        if (!targetRow || targetRow.cards.length === 0) {
            if (placeholder.parentNode !== promptContainer) promptContainer.appendChild(placeholder);
            return;
        }

        const orderedRowCards = targetRow.cards.sort((a, b) => a.left - b.left || a.top - b.top);
        let targetCard = orderedRowCards[0];
        let insertBeforeEl = true;

        if (adjX <= orderedRowCards[0].cx) {
            targetCard = orderedRowCards[0];
            insertBeforeEl = true;
        } else if (adjX >= orderedRowCards[orderedRowCards.length - 1].cx) {
            targetCard = orderedRowCards[orderedRowCards.length - 1];
            insertBeforeEl = false;
        } else {
            for (const card of orderedRowCards) {
                if (adjX < card.cx) {
                    targetCard = card;
                    insertBeforeEl = true;
                    break;
                }
                targetCard = card;
                insertBeforeEl = false;
            }
        }

        const deltaX = adjX - targetCard.cx;
        if (Math.abs(deltaX) < HYSTERESIS_PX && targetCard.el === lastNearestEl) {
            return;
        }

        if (targetCard.el !== lastNearestEl || insertBeforeEl !== lastInsertBefore) {
            if (insertBeforeEl) {
                if (targetCard.el.previousSibling !== placeholder) promptContainer.insertBefore(placeholder, targetCard.el);
            } else {
                const next = targetCard.el.nextSibling;
                if (next !== placeholder) {
                    if (next) promptContainer.insertBefore(placeholder, next);
                    else promptContainer.appendChild(placeholder);
                }
            }
            lastNearestEl = targetCard.el;
            lastInsertBefore = insertBeforeEl;
        }
    };

    const onPointerUp = (e) => {
        if (!dragged) return;
        // insert dragged at placeholder position
        promptContainer.insertBefore(dragged, placeholder);

        // cleanup styles
        dragged.classList.remove('dragging');
        dragged.style.position = '';
        dragged.style.left = '';
        dragged.style.top = '';
        dragged.style.width = '';
        dragged.style.pointerEvents = '';
        dragged.style.zIndex = '';

        if (placeholder && placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
        placeholder = null;

        // persist new order
        try {
            const ids = Array.from(promptContainer.querySelectorAll('.prompt-card')).map(c => c.dataset.id).filter(Boolean);
            const state = loadPromptState();
            state.order = ids;
            savePromptStateToStorage(state);
        } catch (err) {
            console.warn('Nepodařilo se uložit pořadí karet:', err);
        }

        // release pointer capture if available
        try { dragged.releasePointerCapture && dragged.releasePointerCapture(e.pointerId); } catch (err) {}

        // stop any auto-scrolling
        stopAutoScroll();

        // reset hysteresis trackers
        lastNearestEl = null;
        lastInsertBefore = null;
        dragPointerId = null;

        dragged = null;

        promptContainer.classList.remove('drag-grid');

        window.removeEventListener('pointermove', onPointerMove);
    };

    // Hover tooltip removed; using native `title` + `aria-label` instead

    // Start dragging via pointerdown (handles mouse and touch)
    promptContainer.addEventListener('pointerdown', onPointerDown);
}

// Initialize drag support after DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    initPromptCardDrag();
});

function getPageElement(page) {
    const pageMap = {
        [TEXT_PROMPTS_PAGE]: libraryPage,
        custom: customPage,
        'new-prompt': newPromptPage,
        agents: agentsPage,
        'system-settings': systemSettingsPage,
        presentation: presentationPage,
        images: imagesPage,
        'prompt-engineering-theory': promptEngineeringTheoryPage,
        'copilot-fallback': copilotFallbackPage
    };

    return pageMap[page] || null;
}

function ensurePromptContainer(page) {
    const pageElement = getPageElement(page);
    if (!pageElement) {
        return null;
    }

    const existingContainer = pageElement.querySelector('.prompt-container');
    if (existingContainer) {
        return existingContainer;
    }

    const container = document.createElement('div');
    container.className = 'prompt-container';
    pageElement.appendChild(container);
    return container;
}

function getVisibleBuiltinPrompts() {
    const promptState = loadPromptState();
    return builtinPrompts.filter(prompt => !promptState.hiddenDefaultIds.includes(prompt.id));
}

function getLibraryPrompts() {
    const promptState = loadPromptState();
    const customPrompts = getCustomPromptsForSection('text').map(prompt => ({
        ...prompt,
        sourceType: 'custom'
    }));

    const builtinLibraryPrompts = getVisibleBuiltinPrompts()
        .filter(prompt => prompt.section === 'text')
        .map(prompt => ({
            ...prompt,
            ...((promptState.defaultOverrides || {})[prompt.id] || {}),
            sourceType: 'builtin'
        }));

    return [...customPrompts, ...builtinLibraryPrompts];
}

function getPromptsForPage(page) {
    const promptSection = getPromptSectionForPage(page);
    if (page === TEXT_PROMPTS_PAGE) {
        let promptsForLibrary = getLibraryPrompts();

        if (currentCategory !== 'all') {
            promptsForLibrary = promptsForLibrary.filter(prompt => prompt.category === currentCategory);
        }

        if (currentSearchTerm) {
            promptsForLibrary = promptsForLibrary.filter(prompt =>
                normalizeString(prompt.title).includes(currentSearchTerm) ||
                normalizeString(prompt.category).includes(currentSearchTerm) ||
                normalizeString(prompt.content).includes(currentSearchTerm)
            );
        }

        return promptsForLibrary;
    }

    if (!promptSection) {
        return [];
    }

    const customPrompts = getCustomPromptsForSection(promptSection).map(prompt => ({
        ...prompt,
        sourceType: 'custom'
    }));

    const builtinPromptsForSection = getVisibleBuiltinPrompts()
        .filter(prompt => prompt.section === promptSection)
        .map(prompt => ({
            ...prompt,
            sourceType: 'builtin'
        }));

    return [...customPrompts, ...builtinPromptsForSection];
}

function refreshVisiblePrompts() {
    if (CARD_PAGES.has(currentPage) || currentPage === TEXT_PROMPTS_PAGE) {
        renderPromptsForCurrentPage();
    }

    if (currentPage === TEXT_PROMPTS_PAGE) {
        generateCategories();
    }
}

function getAllPrompts() {
    const customPrompts = loadCustomPrompts();
    const promptState = loadPromptState();
    const visibleDefaults = getVisibleBuiltinPrompts()
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

function renderPromptsForCurrentPage() {
    if (currentPage === TEXT_PROMPTS_PAGE) {
        const libraryPrompts = getPromptsForPage(TEXT_PROMPTS_PAGE);
        const libraryContainer = ensurePromptContainer(TEXT_PROMPTS_PAGE);
        displayPrompts(libraryPrompts, libraryContainer);
        return;
    }

    // Special rendering for Markdown-based pages (theory / other)
    if (currentPage === 'prompt-engineering-theory' || currentPage === 'copilot-fallback') {
        const promptSection = getPromptSectionForPage(currentPage);
        const mdPrompt = builtinPrompts.find(p => p.section === promptSection && p.isMarkdown);
        const pageElement = getPageElement(currentPage);
        if (!pageElement) return;
        const container = pageElement.querySelector('.markdown-content');
        if (container && mdPrompt) {
            container.innerHTML = renderMarkdownToHtml(mdPrompt.content);
        }
        return;
    }

    if (!CARD_PAGES.has(currentPage)) {
        return;
    }

    const pagePrompts = getPromptsForPage(currentPage);
    const pageContainer = ensurePromptContainer(currentPage);
    displayPrompts(pagePrompts, pageContainer, { sectionLayout: true });
}

// Vykreslí karty promptů podle zadaného filtru
function displayPrompts(filteredPrompts, targetContainer, options = {}) {
    const container = targetContainer || promptContainer;
    if (!container) {
        return;
    }

    // apply stored order if present
    const promptStateForOrder = loadPromptState();
    const storedOrder = Array.isArray(promptStateForOrder.order) ? promptStateForOrder.order : [];
    const orderedPrompts = Array.from(filteredPrompts);
    if (storedOrder && storedOrder.length) {
        orderedPrompts.sort((a, b) => {
            const ia = storedOrder.indexOf(a.id);
            const ib = storedOrder.indexOf(b.id);
            const va = ia === -1 ? 1e9 : ia;
            const vb = ib === -1 ? 1e9 : ib;
            return va - vb;
        });
    }

    container.innerHTML = '';
    orderedPrompts.forEach((prompt, index) => {
        const card = document.createElement('div');
        card.className = 'prompt-card';
        if (options.sectionLayout) {
            card.classList.add('section-prompt-card');
        }
        
        // Kontrola, jestli je to vlastní prompt (má id)
        const isCustom = prompt.sourceType === 'custom';
        const promptKey = prompt.id;
        const deleteButton = `<button class="delete-button" data-source="${isCustom ? 'custom' : 'builtin'}" data-key="${promptKey}" data-label="Smazat" aria-label="Smazat" title="Smazat">❌</button>`;
        const editButton = `<button class="edit-button" data-source="${isCustom ? 'custom' : 'builtin'}" data-key="${promptKey}" data-label="Editovat" aria-label="Editovat" title="Editovat">🔧</button>`;
        
        card.innerHTML = `
            <h2>${prompt.title}</h2>
            <div class="hashtag">${prompt.category}</div>
            <p>${highlightBracedText(prompt.content)}</p>
            <div class="card-actions">
                ${editButton}
                <button class="copy-button" data-content="${prompt.content.replace(/"/g, '&quot;')}" data-label="Kopírovat" aria-label="Kopírovat" title="Kopírovat">🗐</button>
                ${deleteButton}
            </div>
        `;
        // native tooltip + accessibility label
        card.setAttribute('title', 'podrž a přetáhni kartu pro změnu pozice');
        card.setAttribute('aria-label', 'Podrž a přetáhni kartu pro změnu pozice');
        // attach data-id for persistence
        card.dataset.id = prompt.id;
        container.appendChild(card);
    });
    
    // Přidání event listenerů na všechna tlačítka Kopírovat
    container.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', function() {
            const content = this.getAttribute('data-content');
            copyToClipboard(content);
        });
    });
    
    // Přidání event listenerů na tlačítka Smazat
    container.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function() {
            const source = this.getAttribute('data-source');
            const key = this.getAttribute('data-key');
            
            // Zobrazit potvrzovací dialog
            showDeleteConfirmDialog(source, key);
        });
    });

    // Přidání event listenerů na tlačítka Editovat
    container.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function() {
            const source = this.getAttribute('data-source');
            const key = this.getAttribute('data-key');
            openEditPromptDialog(source, key);
        });
    });
}

// Dynamicky generuje kategorie ze souboru prompts
function generateCategories() {
    // Získat všechny jedinečné kategorie
    const allPrompts = getLibraryPrompts();
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

// Funkce pro normalizaci znaků s diakritikou
function normalizeString(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Vyhledávání v reálném čase podle názvu, kategorie i obsahu
searchInput.addEventListener('input', () => {
    currentSearchTerm = normalizeString(searchInput.value);
    renderPromptsForCurrentPage();
});



// Filtrování promptů podle vybrané kategorie
categoryList.addEventListener('click', (event) => {
    const selectedCategory = event.target.dataset.category;
    if (selectedCategory) {
        currentCategory = selectedCategory;
        renderPromptsForCurrentPage();
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
    const resolvedPage = PAGE_HIERARCHY[page] ? page : TEXT_PROMPTS_PAGE;
    const metadata = PAGE_HIERARCHY[resolvedPage];
    currentPage = resolvedPage;

    setActiveGroup(metadata.group);

    const pageMap = {
        [TEXT_PROMPTS_PAGE]: libraryPage,
        custom: customPage,
        'new-prompt': newPromptPage,
        agents: agentsPage,
        'system-settings': systemSettingsPage,
        presentation: presentationPage,
        images: imagesPage,
        'prompt-engineering-theory': promptEngineeringTheoryPage,
        'copilot-fallback': copilotFallbackPage
    };

    Object.entries(pageMap).forEach(([key, element]) => {
        if (element) {
            element.classList.toggle('hidden', key !== resolvedPage);
        }
    });

    if (navElement) {
        navElement.classList.toggle('hidden', resolvedPage !== TEXT_PROMPTS_PAGE);
    }
    if (fabContainer) {
        const shouldShowFab = FAB_VISIBLE_PAGES.has(resolvedPage);
        fabContainer.classList.toggle('hidden', !shouldShowFab);
        if (!shouldShowFab) {
            closeFabMenu();
        } else {
            updateFabMenuLabel(resolvedPage);
        }
    }
    pageButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.page === resolvedPage);
    });

    renderPromptsForCurrentPage();
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

function openNewPromptDialogForPage(page) {
    currentNewPromptTargetPage = page;
    pendingNewPromptSection = getPromptSectionForPage(page) || 'text';
    setPage('new-prompt');
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
        const builtinPrompt = builtinPrompts.find(prompt => prompt.id === currentEditTarget.key);
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
    refreshVisiblePrompts();
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
        content: content,
        section: pendingNewPromptSection || 'text'
    };
    
    // Přidej na začátek pole (nejnovější první)
    customPrompts.unshift(newPrompt);
    
    // Ulož
    if (saveCustomPrompts(customPrompts)) {
        showToast('✓ Prompt úspěšně uložen!');
        clearForm();
        currentSearchTerm = '';
        currentCategory = 'all';
        if (searchInput) {
            searchInput.value = '';
        }
        if (categoryButton) {
            categoryButton.textContent = 'Všechny kategorie';
        }
        generateCategories();
        setPage(currentNewPromptTargetPage || TEXT_PROMPTS_PAGE);
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
        const targetPrompt = builtinPrompts.find(prompt => prompt.id === key);
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
    refreshVisiblePrompts();
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
        setPage(TEXT_PROMPTS_PAGE);
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
    fabButton.setAttribute('aria-expanded', 'false');
    fabButton.textContent = '＋';
}

function updateFabMenuLabel(page) {
    if (!fabNewPromptButton) {
        return;
    }

    fabNewPromptButton.textContent = FAB_NEW_PROMPT_LABELS[page] || 'Přidat prompt';
}

function toggleFabMenu() {
    if (!fabMenu || !fabButton) {
        return;
    }
    const isHidden = fabMenu.classList.contains('hidden');
    fabMenu.classList.toggle('hidden', !isHidden);
    fabButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    fabButton.textContent = isHidden ? '×' : '＋';
}

if (fabButton) {
    fabButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleFabMenu();
    });
}

if (fabNewPromptButton) {
    fabNewPromptButton.addEventListener('click', () => {
        openNewPromptDialogForPage(currentPage);
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
    return loadBuiltinPrompts().then(defaultPromptList => {
        if (!HAS_PROMPT_SECTION_SCRIPTS && (!defaultPromptList || defaultPromptList.length === 0)) {
            console.warn('Nebyla načtena data sekcí. Zkontrolujte, že jsou v index.html připojené scripts prompts/*.js.');
        }

        builtinPrompts = defaultPromptList;
        const promptState = reconcilePromptStateWithBuiltinPrompts(loadPromptState(), defaultPromptList);
        savePromptStateToStorage(promptState);
        currentSearchTerm = '';
        currentCategory = 'all';
        renderPromptsForCurrentPage();
        generateCategories();
        setPage(TEXT_PROMPTS_PAGE);
        updateXmlOutput();
    });
}

initializeAppData().catch(error => {
    console.error('Chyba při inicializaci aplikace:', error);
    setPage(TEXT_PROMPTS_PAGE);
    updateXmlOutput();
}).finally(() => {
    openStartupPageDialog();
});