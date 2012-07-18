module.exports = {

    fieldSelect: function(name, attr, value) {
      var data = sel = '';
      data += '<select id="Lead_'+name+'" name="Lead['+name+']">';
      attr.forEach(function(item) {
        sel = '';
        if (item == value) {
          sel = 'selected="selected"';
        }
        data += '<option value="'+item+'" '+sel+'>'+item+'</option>';
      });
      data += '</select>';
      return data;
    }

};