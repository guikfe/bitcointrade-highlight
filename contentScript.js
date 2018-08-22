var BTDHighlight = function () {};

BTDHighlight.prototype.init = function (text, rgb, position) {
  this.position = position;
  this.sum = 0;
  this.rows = [];
  this.rowWidth = 0;

  this.table = $("span:contains('" + text + "')").parent().parent().parent().find('tr');
  this.rowWidth = $(this.table[1]).width();

  this.convertRowValues();
  this.sumRowValues();

  this.columnsRatio = this.rowWidth / this.sum;

  var accumulation = 0;

  $.each(this.table, function(i, o) {
    if (i > 0) {
      var btc = this.rows[i - 1]
      accumulation += btc;
      $(o).css('background-color', 'rgba(' + rgb + ', ' + btc + ')')
      this.appendBar($(o), accumulation)
    }
  }.bind(this))
}

BTDHighlight.prototype.convertRowValues = function () {
  $.each(this.table, function (i, o) {
    var btc = $(o).find('td:nth-child(2)').text()
    if (btc) {
      var val = parseFloat(btc.replace(',', '.').match(/(\d)+.(\d)+/g)[0])
      this.rows.push(val);
    }
  }.bind(this))
}

BTDHighlight.prototype.sumRowValues = function () {
  for (var i = 0; i < this.rows.length; i++) {
    this.sum += this.rows[i]
  }
}

BTDHighlight.prototype.appendBar = function ($el, btc) {
  if (this.position == 'left') {
    var td = $el.find('td:nth-child(5)')
  } else {
    var td = $el.find('td:nth-child(1)')
  }

  td.css('position', 'relative')
  td.append("<div class='bar' style='" + this.getBarStyle(btc) + "'></div>")
}

BTDHighlight.prototype.getBarStyle = function (btc) {
  var positionStyle = ''
  var background = ''
  var width = `width: ` + (btc * this.columnsRatio * 1e8) / (this.sum * 1e8) + `px;`

  if (this.position == 'left') {
    positionStyle = 'right: 0px;'
    background = 'background: linear-gradient(to bottom, rgba(210,255,82,.7) 0%,rgba(145,232,66,.7) 100%);'
  } else {
    positionStyle = 'left: 0px;'
    background = 'background: linear-gradient(to bottom, rgba(255,48,25,.7) 0%,rgba(207,4,4,.7) 100%);'
  }

  return `
    position: absolute;
    top: 0px;
    bottom: 0px;
  ` + positionStyle + background + width;
}

setInterval(function () {

  $('.bar').remove()

  new BTDHighlight().init('Ordens de compra', '107, 197, 44', 'left')
  new BTDHighlight().init('Ordens de venda', '255, 99, 71', 'right')

}, 1000);
