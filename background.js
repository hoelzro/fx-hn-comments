const HN_PAGE_PATTERN = '*://news.ycombinator.com/item?id=*';
const HN_COMMENT_PATTERN = HN_PAGE_PATTERN; // happens to be the same
const HN_PAGE_RE = new RegExp('^http[s]?://news[.]ycombinator[.]com/item[?]id=(\\d+)$');
const HN_COMMENT_RE = HN_PAGE_RE; // happens to be the same

const STORAGE = browser.storage.local;

function extractPageId(url) {
    let match = HN_PAGE_RE.exec(url);

    if(match) {
        return match[1];
    }

    return null;
}

function extractCommentId(url) {
    let match = HN_COMMENT_RE.exec(url);

    if(match) {
        return match[1];
    }

    return null;
}

async function isMarked(page, id) {
    let results = await STORAGE.get(page + '\x1e' + id);

    return Object.keys(results).length != 0;
}

async function markComment(page, id) {
    await STORAGE.set({
        [page + '\x1e' + id]: true
    });
}

async function unmarkComment(page, id) {
    await STORAGE.remove(page + '\x1e' + id);
}

browser.menus.create({
    id: 'toggle-mark',
    documentUrlPatterns: [HN_PAGE_PATTERN],
    targetUrlPatterns: [HN_COMMENT_PATTERN],
    title: 'Mark', // XXX update dynamically based on whether comment already marked
    contexts: ['link']
});

// XXX handle promise failure?
browser.menus.onClicked.addListener(async function(info) {
    let currentPageId = extractPageId(info.pageUrl);
    if(!currentPageId) {
        return;
    }
    let target = info.linkUrl;
    let id = extractCommentId(target);

    if(!id) {
        return;
    }

    if(await isMarked(currentPageId, id)) {
        await unmarkComment(currentPageId, id);
    } else {
        await markComment(currentPageId, id);
    }
});
