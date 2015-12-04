var path = require('path')
var Reporter = require('jsreport-core').Reporter

describe('phantom pdf', function () {
  var reporter

  beforeEach(function (done) {
    reporter = new Reporter({
      rootDirectory: path.join(__dirname, '../')
    })

    reporter.init().then(function () {
      done()
    }).fail(done)
  })

  it('should not fail when rendering', function (done) {
    var request = {
      template: {content: 'Heyx', recipe: 'phantom-pdf', engine: 'none'}
    }

    reporter.render(request, {}).then(function (response) {
      done()
    }).catch(done)
  })
})
