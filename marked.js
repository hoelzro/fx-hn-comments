browser.storage.local.get().then(function(marks) {
    let markedCommentsTable = document.getElementById('marked_comments');

    let contents = ['page_id', ',', 'comment_id', '\n'];

    for(let key of Object.keys(marks)) {
        let [ pageId, id ] = key.split('\x1e');

        let row = document.createElement('tr');
        let pageIDCell = document.createElement('td');
        let commentIDCell = document.createElement('td');

        pageIDCell.innerText = pageId;
        commentIDCell.innerText = id;

        row.appendChild(pageIDCell);
        row.appendChild(commentIDCell);

        markedCommentsTable.appendChild(row);

        contents.push(pageId, ',', id, '\n');
    }

    contents = new Blob(contents, { type: 'text/csv' });
    let downloadLink = document.getElementById('download_link');
    download_link.href = URL.createObjectURL(contents);
});
