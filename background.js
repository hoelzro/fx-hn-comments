const HN_PAGE_PATTERN = '*://news.ycombinator.com/item?id=*';
const HN_COMMENT_PATTERN = HN_PAGE_PATTERN; // happens to be the same
const HN_COMMENT_RE = new RegExp('^http[s]?://news[.]ycombinator[.]com/item[?]id=(\\d+)$');

const STORAGE = browser.storage.local;

function extractCommentId(url) {
    let match = HN_COMMENT_RE.exec(url);

    if(match) {
        return match[1];
    }

    return null;
}

async function isMarked(id) {
    // XXX use URL of page itself in the key?
    let results = await STORAGE.get(id);

    return Object.keys(results).length != 0;
}

async function markComment(id) {
    await STORAGE.set({
        [id]: true
    });
}

async function unmarkComment(id) {
    await STORAGE.remove(id);
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
    let target = info.linkUrl;
    let id = extractCommentId(target);

    if(!id) {
        return;
    }

    if(await isMarked(id)) {
        await unmarkComment(id);
    } else {
        await markComment(id);
    }
});
