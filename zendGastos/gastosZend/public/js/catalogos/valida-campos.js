/* 
 * maragon
 *  
 */

var validateElement = {
    
    init: function() {
        
    },
    
    isValid: function(element, element2,margin) {
        
        var isValid = true;
        var $element = $(element);
        
        var id = $element.attr('id');
        var name = $element.attr('name');        
        var clas = $element.attr('class');
        
        var value = $element.val();
        
        var $element2 = $(element2);
        var id2 = $element2.attr('id');
        var clas2 = $element2.attr('class');
        var regex = /^[0-9]*$/;

        var type = $element[0].type.toLowerCase();
        var contador = 1;
        switch(type) {
            case 'text':
            if(regex.test(value) ) {
                isValid = true;
                $("#" +id ).removeAttr('style');
                $("#input" + id).remove()
            } else {
                isValid = false;     
                $("#" +id ).css({ borderWidth: "2px", borderColor:"red",  borderStyle:"solid"});
               if($("#input" + id).length > 0) {
               } else {
                 $("#" +id2 ).append("<div id='input" + id+ "' style='color: red; font-size: 12px; font-weight: bold;'><span style='margin-left: " + margin + "px;' class='icon-warning-sign info-warning'></span>Campo numérico</div>");
               }
                
            }
            break;
            case 'textarea':
            case 'password':
        }
        return isValid;
    }
};

validateElement.init();

