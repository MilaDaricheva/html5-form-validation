;(function($) {

    $.fn.validateForm = function(typeOptions, attrMsgs, notif) {

        //Extend the defaults with provided options        
        typeOptions = $.extend(true, {}, $.fn.validateForm.typeOptions, typeOptions);
        attrMsgs = $.extend(true, {}, $.fn.validateForm.attrMsgs, attrMsgs);
        notif = $.extend(true, {}, $.fn.validateForm.notif, notif);

            // Validate input value according to the pattern
        var validateRegExp = function(jField, inputValue, pattern) {
                if(pattern) {
                    try {
                        var regExpObj = new RegExp(pattern);
                        return regExpObj.test(inputValue); 
                    } catch (err) {
                        notif.show(jField, "Pattern is wrong: " + pattern + " Error: " + err);
                        return false;
                    };
                } else {
                    return false;
                };
            },

            // Validate pattern
            validatePattern = function(fieldOpts, pattern, message, formState) {
                fieldOpts.message = message;
                fieldOpts.isInvalid = !validateRegExp(fieldOpts.jField, fieldOpts.value, pattern);        
                processField(fieldOpts, formState);
            },

            //  Validate required field
            validateRequiredField = function(fieldOpts, formState) {
                fieldOpts.message = attrMsgs.required;

                if (typeof fieldOpts.jField.data("required") !== "undefined") {
                    //Check a fieldgroup, it is invalid if it has no checked fields 
                    fieldOpts.isInvalid = fieldOpts.jField.find(":checked").length === 0;
                } else {
                    //Check a field
                    if (fieldOpts.type === "checkbox") {
                        //Checkbox may have value but may be unchecked
                        fieldOpts.isInvalid = !fieldOpts.jField.is(":checked");     
                    } else {
                        //Field is invalid if it has no value
                        fieldOpts.isInvalid = !fieldOpts.value;      
                    };
                };

                processField(fieldOpts, formState);
            },

            //  Play with formState object and warnings and field's id
            processField = function(fieldOpts, formState) {
                // Add id attribute for a field if it does not have it
                if ( (typeof fieldOpts.id === "undefined") || !$.trim(fieldOpts.id) ) {
                    fieldOpts.id = addFieldId(fieldOpts.jField, fieldOpts.uniqueId);
                    fieldOpts.uniqueId++; //increment uniqueId
                };
                
                if (fieldOpts.isInvalid) {
                    //Track form state, make notification 
                    formState[fieldOpts.id] = fieldOpts.message;
                    if (fieldOpts.toNotify) { 
                        notif.show(fieldOpts.jField, fieldOpts.message); 
                    };
                } else {
                    //Field is valid, remove from formState object if set so and hide notification
                    if (fieldOpts.toClearState && formState[fieldOpts.id]) {
                        notif.hide(fieldOpts.jField);
                        delete formState[fieldOpts.id];
                    };
                };  
            },

            // Add id attribute for a field that does not have it yet
            addFieldId = function($field, uniqueId) {
                var fieldId = "field_" + uniqueId; 
                $field.attr("id", fieldId);  
                return fieldId;               
            },

            fieldOptions = function($field, uniqueId, toNotify, toClearState) {
                return {
                    jField: $field,
                    id: $field.attr("id"),
                    uniqueId: uniqueId,
                    type: $field.attr("type"),
                    value: $.trim($field.val()),
                    pattern: $field.attr("pattern"),
                    isRequired: typeof $field.attr("required") !== "undefined",
                    toNotify: (typeof toNotify === "undefined") ? true : toNotify,     //notify when a field has changed
                    toClearState: (typeof toClearState === "undefined") ? true : toClearState  //clear formState object when a field has changed to be valid
                };                   
            };

        return this.each(function() {
            var form = $(this),         //a form to validate
                uniqueId = 1,           // will increment and is used for id generation
                formState = {};         //formSate object contains warning messages for fields  

            //Track every field change
            form.on('change', function(e) {
                var $field = $(e.target),                       //changed field
                    $fParent = $field.parent(),                 //parent of field
                    fieldOpts = fieldOptions($field, uniqueId);
                
                //If required attribute is set
                if ( fieldOpts.isRequired ) {
                    validateRequiredField(fieldOpts, formState);
                };

                //If field is a checkbox with required attribute set for parent,
                if ( (fieldOpts.type === "checkbox") && (typeof $fParent.data("required") !== "undefined") ) {
                    var fieldGroupOpts = fieldOptions($fParent, uniqueId);
                    validateRequiredField(fieldGroupOpts, formState);
                    //save uniqueId so that next time when we set new id it will be unique (incremented)
                    uniqueId = fieldGroupOpts.uniqueId; 
                };

                //Validate patterns
                if (fieldOpts.value && fieldOpts.type !== "checkbox") {
                    //If attribute pattern is set, use it to validate value
                    //Inline pattern takes presidence over patterns defined with plugin options
                    if ( typeof fieldOpts.pattern !== "undefined" ) {
                        validatePattern(fieldOpts, fieldOpts.pattern, attrMsgs.pattern, formState);
                    } else if (typeof typeOptions[fieldOpts.type] !== "undefined") {
                        //If validation rules exist for this field type, then validate
                        var fTypeOpts = typeOptions[fieldOpts.type];
                        validatePattern(fieldOpts, fTypeOpts.pattern, fTypeOpts.message, formState);
                    };
                };

                //Save uniqueId so that next time we set new id it will be unique (incremented)
                if (uniqueId < fieldOpts.uniqueId) {
                    uniqueId = fieldOpts.uniqueId;
                };

            });  

            form.on('submit', function(e) {
                var submitButton = form.find('[type="submit"]');
                //We still can have empty required fields or empty required radio button/checkbox groups.
                //No need to check for type attr again because if a user has changed those fields, we have all warnings in our object
                form.find("[required], [data-required]").each(function() {
                    var $field = $(this),
                        fieldOpts = fieldOptions($field, uniqueId, false, false);  

                    validateRequiredField(fieldOpts, formState);
                    //Save uniqueId so that next time when we set new id it will be unique (incremented)
                    uniqueId = fieldOpts.uniqueId;
                });

                if ($.isEmptyObject(formState)) {
                    //If formState object is still empty, then the form passed validation
                    notif.hide(submitButton);
                    return true;    
                } else {
                    //formState object has warnings, so show them all, do not allow form submition
                    var fieldId;
                    for (fieldId in formState) {
                        notif.show(fieldId, formState[fieldId]);
                    };
                    //Global warning about form submition failed
                    notif.show(submitButton, attrMsgs.failed);
                    return false;
                };
            });      
        });
    };


    //TODO: maybe it is better to combine all options into one object
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
        required: "Please enter this required field.",
        pattern: "Please use correct format for this field.",
        failed: "Form submition failed, please check fields."
    };

    //Notify that something is not valid
    $.fn.validateForm.notif = {
        show: function(field, message) {
            if (typeof field === "string") {
                field = $('#' + field);
            }; 
            var prev = field.prev(),
                notification = $("<div/>", {
                    class: "notification",
                    text: message
                });
            if (prev.hasClass("notification")) {
                prev.show();
            } else {
                field.before(notification);
            };  
        },
        hide: function(jField) {
            var prev = jField.prev();
            if (prev.hasClass("notification")) {
                prev.hide();
            };
        } 
    };

})(jQuery);