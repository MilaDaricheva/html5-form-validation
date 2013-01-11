;(function($) {

    $.fn.validateForm = function(typeOptions, attrMsgs, notify) {

        //Extend the defaults with provided options        
        typeOptions = $.extend(true, {}, $.fn.validateForm.typeOptions, typeOptions);
        attrMsgs = $.extend(true, {}, $.fn.validateForm.attrMsgs, attrMsgs);
        notify = $.extend(true, {}, $.fn.validateForm.notify, notify);

        //Ckeck if browser is safari 
        var isSafari = $.browser.webkit && !(/chrome/.test(navigator.userAgent.toLowerCase())),

            // Check if attribute is supported by a browser
            isAttributeSupported = function(attribute) {
                return false;
                return (attribute in document.createElement("input"));
            },

            // Check if input type is supported by a browser
            isInputTypeSupported = function(inputType) {
                return false;
                var testInput = document.createElement("input");
                testInput.setAttribute("type", inputType);
                return (testInput.type == inputType);
            },

            // Validate input value according to the pattern
            validateRegExp = function(inputValue, pattern) {
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

            validateRequiredField = function($field, fieldId, fieldVal, fieldType, formState) {
                if (fieldType === "checkbox") {
                    //check single checkbox
                    if (!$field.is(":checked")) {
                        //Track form state, send warning
                        formState[fieldId] = attrMsgs.required;
                        notify.warning(fieldId, attrMsgs.required);
                        return false;
                    };
                } else {
                    //check other types, not checkbox
                    //if field has no value
                    if ( !fieldVal ) {
                        //Track form state, send warning
                        formState[fieldId] = attrMsgs.required;
                        notify.warning(fieldId, attrMsgs.required);
                        return false;
                    }; 
                };
                //Required field is set, remove from formState object
                if (formState[fieldId]) {
                    delete formState[fieldId];
                };
                return true;
            },

            // Add id attribute for a field that does not have it yet
            addFieldId = function($field, fieldId) {
                if ( (typeof fieldId === "undefined") || !$.trim(fieldId) ) {
                    //we use time to make it unique
                    //TODO: find a better way because when validating all on submit, time may be the same
                    fieldId = "field_" + (new Date().getTime());
                    $field.attr("id", fieldId);
                };   
                return fieldId;               
            };

        return this.each(function() {
            var parentForm = $(this),
                formState = {};

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
                var $this = $(this),                            //form
                    $field = $(e.target),                       //changed field
                    $fParent = $field.parent(),                 //parent of field
                    fieldId = $field.attr("id"),                //id attribute
                    fieldVal = $.trim($field.val()),            //trimmed field value
                    attrRequired = $field.attr("required"),     //required attribute
                    attrPattern = $field.attr("pattern"),       //pattern attribute
                    attrType = $field.attr("type");             //type attribute
       
                //if field does not have an id, then add one
                fieldId = addFieldId($field, fieldId);
                console.log("ID", fieldId);
                
                //if required attribute is not supported, but field has it
                if ( !isAttributeSupported("required") && (typeof attrRequired !== "undefined") ) {
                    validateRequiredField($field, fieldId, fieldVal, attrType, formState);
                };
                //console.log("Form State", formState);

                //check multiple checkboxes,
                //if field is a checkbox with required attribute set for parent,
                if ( (attrType === "checkbox") && (typeof $fParent.data("required") !== "undefined") ) {
                    //if parent of the field does not have an id, then add one
                    var fieldParentId = addFieldId($fParent, $fParent.attr("id"));
                    //if none of checkboxes are checked
                    if ($fParent.find(":checked").length === 0) {
                        //Track form state, send warning
                        formState[fieldParentId] = attrMsgs.required;
                        notify.warning(fieldParentId, attrMsgs.required);
                    } else {
                        //Required field is set, remove from formState object
                        if (formState[fieldParentId]) {
                            delete formState[fieldParentId];
                        };        
                    };   
                };

                //validate throught input types
                //if validation rules exist for this field type and value is set and field type is not supported
                if ( (typeof typeOptions[attrType] !== "undefined") && fieldVal && !isInputTypeSupported(attrType) ) {
                    var validationResult = validateRegExp(fieldVal, typeOptions[attrType].pattern);
                    if (!validationResult) {
                        //Track form state, send warning
                        formState[fieldId] = typeOptions[attrType].message;
                        notify.warning(fieldId, typeOptions[attrType].message);
                    } else {
                        //Field matches the pattern, remove from formState object
                        if (formState[fieldId]) {
                            delete formState[fieldId];
                        };
                    };
                };

                //if pattern attribute is not supported  
                if (!isAttributeSupported("pattern")) {     
                    //if attribute is pattern, use it to validate value
                    if ( (typeof attrPattern !== "undefined") && fieldVal ) {
                        var validationResult = validateRegExp(fieldVal, attrPattern);
                        if (!validationResult) {
                            //Track form state, send warning
                            formState[fieldId] = attrMsgs.pattern;
                            notify.warning(fieldId, attrMsgs.pattern);
                        } else {
                            //Field matches the pattern, remove from formState object
                            if (formState[fieldId]) {
                                delete formState[fieldId];
                            };
                        };
                    };
                };

                //TODO: there can be a situation when we have input type email/url/tel/number and pattern attr as well

                //console.log(formState);
                

            });  

            parentForm.on('submit', function(e) {
                //if formState object does not have warnings, we still can have empty required fields, 
                //empty required radio button/checkbox groups.
                //No need to check for type attr again because if user used those fields, we have all warnings in our object
                if ($.isEmptyObject(formState)) {
                    //Check all required fields 
                    $(this).find("[required]").each(function() {
                        var $field = $(this),                           //required field
                            fieldId = $field.attr("id"),                //id attribute of the field
                            fieldVal = $.trim($field.val()),            //trimmed field value
                            attrType = $field.attr("type");             //type attribute
       
                        //if field does not have an id, then add one
                        fieldId = addFieldId($field, fieldId);
                        
                        //TODO: replace supported check, we don't need to check for every field, 
                        //result is same for all fields and forms
                        //if required attribute is not supported
                        if ( !isAttributeSupported("required") ) {
                            validateRequiredField($field, fieldId, fieldVal, attrType, formState);
                        };                    
                        //console.log(this);
                    });
                    
                    //Check all required groups
                    $(this).find("[data-required]").each(function() {
                        var $field = $(this),                           //required field
                            fieldId = $field.attr("id");                //id attribute of the field
       
                        //if field does not have an id, then add one
                        fieldId = addFieldId($field, fieldId);

                        if ($field.find(":checked").length === 0) {
                            //TODO: create object to track form state
                            formState[fieldId] = attrMsgs.required;
                            notify.warning(fieldId, attrMsgs.required);
                        };    
                        //console.log(this);
                        //console.log($(this).find(":checked").length);
                    });    

                    if ($.isEmptyObject(formState)) {
                        //if formState object is still empty, then the form passed validation
                        return true;
                    } else {
                        //notifications are already set by this moment
                        //TODO: some global warning about form submition failed
                        return false;      
                    };
                      

                } else {
                    //formState object has warnings, so show them all, do not allow form submition
                    var fieldId;
                    for (fieldId in formState) {
                        notify.warning(fieldId, formState[fieldId]);
                    };
                    //TODO: some global warning about form submition failed
                    return false;
                };
                // This return should never happen
                return false;
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
            console.log('Warning for field: ', fieldId, message);
        },
        patternError: function(pattern, err) {
            console.log('Pattern is wrong: ', pattern, err);
        }      
    };

})(jQuery);