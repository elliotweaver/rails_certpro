module.exports = {
    
    fieldAutoSelect: function(name, values) {
      var data = sel = '';
      data += '<select id="Job_'+name+'" name="Job['+name+'][]" multiple="multiple">';
      for(i = 0; i < values.length; i++) {
        data += '<option class="selected" selected="selected" value="'+values[i]._id+'">'+values[i].name+'</option>';
      }
      data += '</select>';
      return data;
    },
    
};