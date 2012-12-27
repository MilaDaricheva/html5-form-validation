;(function($) {

    $.fn.validateForm = function(typeOptions, attrMsgs, notify) {

        //Extend the defaults with provided options        
        typeOptions = $.extend(true, {}, $.fn.validateForm.typeOptions, typeOptions);
        attrMsgs = $.extend(true, {}, $.fn.validateForm.attrMsgs, attrMsgs);
        notify = $.extend(true, {}, $.fn.validateForm.notify, notify);

        //Ckecks if browser is safari 
        var isSafari = $.browser.webkit && !(/chrome/.test(navigator.userAgent.toLowerCase()));

        // Checks if attribute is supported by a browser
        var isAttributeSupported = function(attribute) {
            return false;
            return (attribute in document.createElement("input"));
        };

        // Checks if input type is supported by a browser
        var isInputTypeSupported = function(inputType) {
            return false;
            var testInput = document.createElement("input");
            testInput.setAttribute("type", inputType);
            return (testInput.type == inputType);
        };

        // Validates input value according to the rules
        var validateRegExp = function(inputValue, formValidationRule) {
            if(formValidationRule) {
                try {
                    var regExpObj = new RegExp(formValidationRule);
                    return regExpObj.test(inputValue); 
                } catch (err) {
                    //TODO: resolve params issue    
                    notify.error(err, formValidationRule);
                    return false;
                };
            } else {
                return false;
            };
        };

        return this.each(function() {
            var parentForm = $(this);

            if ((parentForm.attr("novalidate") !== undefined) || (!!parentForm.find("[formnovalidate]").length)) {
                //no validation required
                return;
            }; 

            parentForm.on('change', function(e) {
                var $this = $(this), //form
                    $field = $(e.target), //changed field
                    $fParent = $field.parent(), //parent of field
                    fieldVal = $.trim($field.val()), //trimmed field value
                    attrRequired = $field.attr("required"), //required attribute
                    attrPattern = $field.attr("pattern"), //pattern attribute
                    attrType = $field.attr("type"); //type attribute
                
                //if required attribute is not supported, but field has it
                if ( !isAttributeSupported("required") && (typeof attrRequired !== "undefined") ) {
                    //if field has no value
                    if ( !fieldVal ) {
                        //TODO: create object to track form state
                        notify.warning($field, attrMsgs.required);
                    };
                    //check single checkbox,
                    //if checkbox has required attribute and is not checked 
                    if ( (attrType === "checkbox") && (!$field.is(":checked")) ) {
                        //TODO: create object to track form state
                        notify.warning($field, attrMsgs.required);
                    };
                    
                };

                //check multiple checkboxes,
                //if field is a checkbox with required attribute set for parent,
                //then check that at least one checkbox is checked
                if ( (attrType === "checkbox") && (typeof $fParent.attr("required") !== "undefined") ) {
                    if ($fParent.find(":checked").length === 0) {
                        //TODO: create object to track form state
                        notify.warning($field, attrMsgs.required);
                    };    
                };

                //if pattern attribute is not supported  
                if (!isAttributeSupported("pattern")) {     
                    //if attribute is pattern, use it to validate value
                    if ( (typeof attrPattern !== "undefined") && fieldVal ) {
                        var validationResult = validateRegExp(fieldVal, attrPattern);
                        if (!validationResult) {
                            //TODO: create object to track form state
                            notify.warning($field, attrMsgs.pattern);
                        };
                    };
                };

                //validate throught input types
                //if validation rules exist for this field type and value is set and field type is not supported
                if ( (typeof typeOptions[attrType] !== "undefined") && fieldVal && !isInputTypeSupported(attrType) ) {
                    var validationResult = validateRegExp(fieldVal, typeOptions[attrType].pattern);
                    if (!validationResult) {
                        //TODO: create object to track form state
                        notify.warning($field, typeOptions[attrType].message);
                    };
                };
                

            });        



        });
    };

    //Set the default validation options for input fields with types as below:
    $.fn.validateForm.typeOptions = {
        "number": {
            "pattern": "^[+-]?\\d+(\.\\d+)?$",
            "message": "Please enter correct number."
        },
        "email": {
            "pattern": "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$",
            "message": "Please enter valid email."
        },
        "url": {
            "pattern": "^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([0-9A-Za-z]+\.)",
            "message": "Please enter valid URL."
        },
        "tel": {
            "pattern": "^\\(?(\\d{3})\\)?[- ]?(\\d{3})[- ]?(\\d{4})$",
            "message": "Please enter valid phone number."
        }
    };

    //Set the default validation options for input fields with attributes as below:
    $.fn.validateForm.attrMsgs = {
        required: "Please enter all required fields.",
        pattern: "Please use correct format."
    };

    //Notify that something is not valid
    $.fn.validateForm.notify = {
        warning: function(field, message) {
            console.log('Warning: ', message, field);
        },
        error: function(field, message) {
            console.log('Error: ', message, field);
        }      
    };

})(jQuery);