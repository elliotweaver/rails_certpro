module.exports = {

    fieldSelect: function(name, attr, value) {
      var data = sel = '';
      data += '<select id="User_'+name+'" name="User['+name+']">';
      attr.forEach(function(item) {
        sel = '';
        if (item == value) {
          sel = 'selected="selected"';
        }
        data += '<option value="'+item+'" '+sel+'>'+item+'</option>';
      });
      data += '</select>';
      return data;
    },
    
    fieldDisabled: function(name, value) {
      var data = '';
      value = (undefined === value ? "" : value);
      data += '<input type="text" disabled="disabled" name="User['+name+']" value="'+value+'">';
      return data;
    },

    fieldSelectMonth: function(name, value) {
      var data = sel = '';
      var attr = ["01","02","03","04","05","06","07","08","09","10","11","12"];
      data += '<select id="User_'+name+'" name="User['+name+']">';
      attr.forEach(function(item) {
        sel = '';
        if (item == value) {
          sel = 'selected="selected"';
        }
        data += '<option value="'+item+'" '+sel+'>'+item+'</option>';
      });
      data += '</select>';
      return data;
    },
    
    fieldSelectYear: function(name, value) {
      var data = sel = '';
      var attr = [];
      for (var i = 2012; i < 2023; i++) {
        attr.push(i);
      }
      data += '<select id="User_'+name+'" name="User['+name+']">';
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