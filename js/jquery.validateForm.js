;(function($) {

    $.fn.validateForm = function(typeOptions, attrMsgs, notify) {

        //Extend the defaults with provided options        
        typeOptions = $.extend(true, {}, $.fn.validateForm.typeOptions, typeOptions);
        attrMsgs = $.extend(true, {}, $.fn.validateForm.attrMsgs, attrMsgs);
        notify = $.extend(true, {}, $.fn.validateForm.notify, notify);

            // Validate input value according to the pattern
        var validateRegExp = function(inputValue, pattern) {
                if(pattern) {
                    try {
                        var regExpObj = new RegExp(pattern);
                        return regExpObj.test(inputValue); 
                    } catch (err) {
                        notify.patternError(pattern, err);
                        return false;
                    };
                } else {
                    return false;
                };
            },

            // Validate pattern
            validatePattern = function(fieldOpts, pattern, message, formState) {
                fieldOpts.isInvalid = !validateRegExp(fieldOpts.value, pattern);
                fieldOpts.message = message;
                processField(fieldOpts, formState);
            },

            /*  Validate required field
            */
            validateRequiredField = function(fieldOpts, formState) {
                //field is invalid if it has no value
                fieldOpts.isInvalid = !fieldOpts.value;      

                if (fieldOpts.type === "checkbox") {
                    //checkbox may have value but may be unchecked
                    fieldOpts.isInvalid = !fieldOpts.jField.is(":checked");     
                }; 

                processField(fieldOpts, formState);
            },

            /*  Validate required group of fields
            */
            validateRequiredFieldGroup = function(fieldOpts, formState) {
                //field group is invalid if it has no checked fields
                fieldOpts.isInvalid = fieldOpts.jField.find(":checked").length === 0;

                processField(fieldOpts, formState);

                //TODO: remember uniqueID for fieldOpts, or maybe not
            },

            /*  Process a field, manipulate with formState object and warnings
            */
            processField = function(fieldOpts, formState) {
                // Add id attribute for a field if it does not have it
                if ( (typeof fieldOpts.id === "undefined") || !$.trim(fieldOpts.id) ) {
                    fieldOpts.id = addFieldId(fieldOpts.jField, fieldOpts.uniqueId);
                    fieldOpts.uniqueId++; //increment uniqueId
                };
                
                if (fieldOpts.isInvalid) {
                    //Track form state, send warning
                    formState[fieldOpts.id] = fieldOpts.message;
                    if (fieldOpts.toNotify) { 
                        notify.warning(fieldOpts.id, fieldOpts.message); 
                    };
                } else {
                    //Field is valid, remove from formState object if set so
                    if (fieldOpts.toClearState && formState[fieldOpts.id]) {
                        delete formState[fieldOpts.id];
                    };
                };  
            },

            // Add id attribute for a field that does not have it yet
            addFieldId = function($field, uniqueId) {
                //TODO: make field prefix defined by user
                var fieldId = "field_" + uniqueId; 
                $field.attr("id", fieldId);  
                return fieldId;               
            };

        return this.each(function() {
            var parentForm = $(this),   //a form to validate
                uniqueId = 1,           // will increment and is used for id generation
                formState = {};         //formSate object contains warning messages for fields  

            //TODO: define better rules for novalidation/validation
            /* If a user disabled html5 validation, 
            ** then validate everything even if browser supports html5 form validation
            */        
            /*if ((parentForm.attr("novalidate") !== undefined) || (!!parentForm.find("[formnovalidate]").length)) {
                //no validation required
                return;
            }; */

            //track every field change
            parentForm.on('change', function(e) {
                var $field = $(e.target),                       //changed field
                    $fParent = $field.parent(),                 //parent of field
                    fieldOpts = {
                        jField: $field,
                        id: $field.attr("id"),
                        uniqueId: uniqueId,
                        type: $field.attr("type"),
                        value: $.trim($field.val()),
                        pattern: $field.attr("pattern"),
                        isRequired: typeof $field.attr("required") !== "undefined",
                        message: attrMsgs.required,     //for now we set this as required 
                        isInvalid: false,   //will override that later for each check
                        toNotify: true,     //notify when a field has changed
                        toClearState: true  //clear formState object when a field has changed to be valid 
                    };
                
                //if required attribute is set
                if ( fieldOpts.isRequired ) {
                    validateRequiredField(fieldOpts, formState);
                };
                //console.log("Form State", formState);

                //check multiple checkboxes,
                //if field is a checkbox with required attribute set for parent,
                if ( (fieldOpts.type === "checkbox") && (typeof $fParent.data("required") !== "undefined") ) {
                    var fieldGroupOpts = {
                            jField: $fParent,
                            id: $fParent.attr("id"),
                            uniqueId: uniqueId,
                            //type: $field.attr("type"),
                            //value: $.trim($field.val()),
                            //pattern: $field.attr("pattern"),
                            //isRequired: typeof $field.attr("required") !== "undefined",
                            message: attrMsgs.required,     //for now we set this as required 
                            isInvalid: false,   //will override that later for each check
                            toNotify: true,     //do not notify when a field has changed, we do it later
                            toClearState: true  //do not clear formState, nothing is filled on submit  
                        };  

                    validateRequiredFieldGroup(fieldGroupOpts, formState);

                    //save uniqueId so that next time we set new id it will be unique (incremented)
                    uniqueId = fieldGroupOpts.uniqueId;
                    
                };

                //validate patterns
                if (fieldOpts.value && fieldOpts.type !== "checkbox") {
                    //if attribute pattern is set, use it to validate value
                    //inline pattern takes presidence over patterns defined with plugin options
                    if ( typeof fieldOpts.pattern !== "undefined" ) {
                        validatePattern(fieldOpts, fieldOpts.pattern, attrMsgs.pattern, formState);
                    } else if (typeof typeOptions[fieldOpts.type] !== "undefined") {
                        //if validation rules exist for this field type, validate
                        var fTypeOpts = typeOptions[fieldOpts.type];
                        validatePattern(fieldOpts, fTypeOpts.pattern, fTypeOpts.message, formState);
                    };
                };

                //save uniqueId so that next time we set new id it will be unique (incremented)
                uniqueId = fieldOpts.uniqueId;

                //console.log(formState);

            });  

            parentForm.on('submit', function(e) {
                //We still can have empty required fields or empty required radio button/checkbox groups.
                //No need to check for type attr again because if a user has changed those fields, we have all warnings in our object
                
                //Check all required fields 
                $(this).find("[required]").each(function() {
                    var $field = $(this),             //required field
                        fieldOpts = {
                            jField: $field,
                            id: $field.attr("id"),
                            uniqueId: uniqueId,
                            type: $field.attr("type"),
                            value: $.trim($field.val()),
                            //pattern: $field.attr("pattern"),
                            //isRequired: typeof $field.attr("required") !== "undefined",
                            message: attrMsgs.required,     //for now we set this as required 
                            isInvalid: false,   //will override that later for each check
                            toNotify: false,    //do not notify when a field has changed, we do it later
                            toClearState: false //do not clear formState, nothing is fixed on submit  
                        };  

                    validateRequiredField(fieldOpts, formState);

                    //save uniqueId so that next time we set new id it will be unique (incremented)
                    uniqueId = fieldOpts.uniqueId;

                });
                
                //Check all required groups
                $(this).find("[data-required]").each(function() {
                    var $field = $(this),             //required field group
                        fieldOpts = {
                            jField: $field,
                            id: $field.attr("id"),
                            uniqueId: uniqueId,
                            //type: $field.attr("type"),
                            //value: $.trim($field.val()),
                            //pattern: $field.attr("pattern"),
                            //isRequired: typeof $field.attr("required") !== "undefined",
                            message: attrMsgs.required,     //for now we set this as required 
                            isInvalid: false,   //will override that later for each check
                            toNotify: false,    //do not notify when a field has changed, we do it later
                            toClearState: false //do not clear formState, nothing is filled on submit  
                        };  

                    validateRequiredFieldGroup(fieldOpts, formState);

                    //save uniqueId so that next time we set new id it will be unique (incremented)
                    uniqueId = fieldOpts.uniqueId;

                });

                if ($.isEmptyObject(formState)) {
                    //if formState object is still empty, then the form passed validation
                    return true;    
                } else {
                    //formState object has warnings, so show them all, do not allow form submition
                    var fieldId;
                    for (fieldId in formState) {
                        notify.warning(fieldId, formState[fieldId]);
                    };
                    //TODO: some global warning about form submition failed
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
        required: "Please enter all required fields.",
        pattern: "Please use correct format."
    };

    //Notify that something is not valid
    $.fn.validateForm.notify = {
        warning: function(fieldId, message) {
            console.log('Warning for field: ', fieldId, ': ', message);
        },
        patternError: function(pattern, err) {
            console.log('Pattern is wrong: ', pattern, ': ', err);
        }      
    };

})(jQuery);