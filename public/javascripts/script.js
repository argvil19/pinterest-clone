function getPins() {
    $.get('/allPins', function(pins) {
        for (var i=0;i<pins.length;i++) {
            var div = $('<div/>').addClass('item');
            var imgDiv = $('<div/>').addClass('img-wrapper');
            var textDiv = $('<div/>').addClass('text-center txt-wrapper');
            var img = $('<img/>').attr('src', pins[i].imgURL).attr('onerror', 'imgError(this)');
            var title = $('<h5/>').html(pins[i].name);
            var author = $('<a/>').attr('href', window.location + 'user/' + pins[i].author).html(pins[i].author);
            imgDiv.append(img);
            textDiv.append(title).append(author);
            div.append(imgDiv).append(textDiv);
            $('#items').append(div);
        }
        $('#items').masonry({
            columnWidth:160,
            itemSelector:'.item',
            gutter:5
        }).imagesLoaded().progress(function() {
            $('#items').masonry({
                columnWidth:160,
                itemSelector:'.item',
                gutter:5
            });
        });
    });
}

function imgError(image) {
    image.onerror = "";
    image.src = "/images/image.jpg";
    return true;
}

$(document).ready(function() {
    getPins();
})