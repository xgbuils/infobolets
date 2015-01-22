function Parser() {
	this.templates = {}
}

Parser.prototype.run = function (file_template, file_data) {
    var compiled = $.Deferred()
    var created = $.Deferred()
    var self = this

    var template
    var type = typeof file_template
    if      (type === 'string')
        template = self.templates[file_template]
    else if (type === 'function')
        template = file_template
    else 
        created.reject()

    if (template) {
        compiled.resolve(template)
    } else {
        $.get(file_template)
        .done (function (view) {
            template = Handlebars.compile(view)
            self.templates[file_template] = template
            compiled.resolve(template)
        })
    }

    compiled.done(function (template) {
        type = typeof file_data
        if (type === 'string') {
	        $.getJSON(file_data, function (data) {
                var html = template(data)
                created.resolve(html)
            })
        } else if (type === 'object') {
            var html = template(file_data)
            created.resolve(html)
        } else {
            created.reject()
        }
    }).fail(function () {
	    created.reject()
    })

    return created
}