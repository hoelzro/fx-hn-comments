let button = document.getElementById('view_marked_comments');
button.addEventListener('click', function() {
    browser.tabs.create({
        url: '/marked.html'
    });
});
