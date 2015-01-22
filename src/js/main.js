$(document).ready(function () {
    var parser = new Parser()

    parser.run('views/bolets.html', 'data/bolets.json')
    .done(function (html) {
    	$('#bolets').html(html)
    })
})