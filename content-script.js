const HN_PAGE_RE = new RegExp('^http[s]?://news[.]ycombinator[.]com/item[?]id=(\\d+)$');
const MARKED_CSS_CLASS = 'marked-comment';

function extractPageId(url) {
    let match = HN_PAGE_RE.exec(url);

    if(match) {
        return match[1];
    }

    return null;
}

function refreshCommentMark(id, marked) {
    let commentElement = document.getElementById(id);

    if(!commentElement) {
        return;
    }

    // XXX make sure the current classList is sane wrt. this state?
    if(marked) {
        commentElement.classList.add(MARKED_CSS_CLASS);
    } else {
        commentElement.classList.remove(MARKED_CSS_CLASS);
    }
}

browser.storage.onChanged.addListener(function(changes) {
    let thisPageId = extractPageId(document.location);

    for(let key of Object.keys(changes)) {
        let [ pageId, id ] = key.split('\x1e');
        if(pageId == thisPageId) {
            refreshCommentMark(id, changes[key].newValue);
        }
    }
});

browser.storage.local.get().then(function(marks) {
    let thisPageId = extractPageId(document.location);

    for(let key of Object.keys(marks)) {
        let [ pageId, id ] = key.split('\x1e');
        if(pageId == thisPageId) {
            refreshCommentMark(id, true);
        }
    }
});
