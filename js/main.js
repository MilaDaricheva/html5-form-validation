$(document).ready(function () {    // validates form unless 'novalidate' or 'formnovalidate' attributes are set    $('.formTemplate').validateForm(null, {        required: "Please enter all required fields!!!",        pattern: "Please use correct format!!!"    }/*,     {        warning: function(fieldId, message) {            alert(fieldId + ': ' + message);        }    }*/);});	