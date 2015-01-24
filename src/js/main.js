function showInfo(event) {
  event.preventDefault()
    var data = event.data

    data.top = data.$window.scrollTop()
    data.$window.scrollTop(Math.min(data.heightHeader, data.top))
    
    data.$itemList.hide()
    data.$itemInfo
    .css('opacity', 0)
    .show()
    .animate({opacity: 1}, 300)
}

function hideInfo(event) {
  event.preventDefault()
    var data = event.data

    data.$itemInfo.hide()
    data.$itemList
    .css('opacity', 0)
    .show()
    .animate({opacity: 1}, 300)
    data.$window.scrollTop(data.top)
}

$(document).ready(function () {
    var parser = new Parser()
    var data   = {
        $window:      $(window),
        $itemList:    $('.item-list'),
        $itemInfo:    $('.item-info'),
        heightHeader: $('#header').height()
    }

    parser.run('views/bolets.html', 'data/bolets.json')
    .done(function (html) {
        $('#bolets').html(html)
    })
    $('.wrapper').on('click', '.more-info', data, showInfo)
    $('.wrapper').on('click', '.main-info', data, hideInfo)
})