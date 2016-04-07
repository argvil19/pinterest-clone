function getPins(author) {
    $.get('/getPins?', {
        author:author
    }, function(pins) {
        $('#items').remove();
        $('.jumbotron').append($('<div/>').attr('id', 'items'));
        for (var i=0;i<pins.length;i++) {
            var div = $('<div/>').addClass('item').attr('data-id', pins[i]._id);
            var imgDiv = $('<div/>').addClass('img-wrapper');
            var textDiv = $('<div/>').addClass('text-center txt-wrapper');
            var img = $('<img/>').attr('src', pins[i].imgURL).attr('onerror', 'imgError(this)');
            var title = $('<h5/>').html(pins[i].name);
            var deleteBtn = $('<a/>').addClass('btn btn-danger deletePin').html('Delete').css('display', 'block');
            imgDiv.append(img);
            textDiv.append(title);
            div.append(imgDiv).append(textDiv);
            $('#items').append(div);
        }
        var $grid = $('#items').masonry({
            columnWidth:160,
            itemSelector:'.item',
            gutter:5
        });
        $grid.imagesLoaded().progress(function() {
            $grid.masonry({
            columnWidth:160,
            itemSelector:'.item',
            gutter:5
        });
        })
    });
}

function imgError(image) {
    image.onerror = "";
    image.src = "/images/image.jpg";
    return true;
}

$(document).ready(function() {
    getPins(profile.html());
})