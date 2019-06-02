const MARKED_CSS_CLASS = 'marked-comment';

function refreshCommentMark(id, marked) {
    let commentElement = document.getElementById(id);

    // XXX make sure the current classList is sane wrt. this state?
    if(marked) {
        commentElement.classList.add(MARKED_CSS_CLASS);
    } else {
        commentElement.classList.remove(MARKED_CSS_CLASS);
    }
}

browser.storage.onChanged.addListener(function(changes) {
    for(let id of Object.keys(changes)) {
        refreshCommentMark(id, changes[id].newValue);
    }
});

browser.storage.local.get().then(function(marks) {
    for(let id of Object.keys(marks)) {
        refreshCommentMark(id, true);
    }
});
