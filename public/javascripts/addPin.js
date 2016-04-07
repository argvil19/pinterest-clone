$(document).ready(function() {
    $('#addPin').submit(function(e) {
        var pinName = e.target.pinName.value;
        var pinURL = e.target.pinURL.value;
        return false;
    })
});