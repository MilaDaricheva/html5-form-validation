jQuery html5 form validation plugin
=====================

Provides validation for required fields and groups of fields.

Provides validation for the following input types: number, url, email, tel.

Usage:

This requires you to use jQuery.

Make sure to include plugin:

<script src="js/jquery.validateForm.js"></script>

Apply it to any forms on your page:

$('.formsSelector').validateForm();

Override params for all forms selected for validation:

$.fn.validateForm.options = {
    notifClass:      "notification",
    notifWrapper:    "<div/>",
    fieldIdPrefix:   "field_",
    submitButton:    "[type='submit']",
    requiredFields:  "[required], [data-required]",
    messages: {
        required:   "Please enter this required field.",
        pattern:    "Please use correct format for this field.",
        failed:     "Form submition failed, please check fields."
    },
    typeOptions: {
        number: {
            pattern: "^[+-]?\\d+(\.\\d+)?$",
            message: "Please enter correct number."
        },
        email: {
            pattern: "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$",
            message: "Please enter valid email."
        },
        url: {
            pattern: "^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([0-9A-Za-z]+\.)",
            message: "Please enter valid URL."
        },
        tel: {
            pattern: "^\\(?(\\d{3})\\)?[- ]?(\\d{3})[- ]?(\\d{4})$",
            message: "Please enter valid phone number."
        }
    }
};

Working with notifications:

$.fn.validateForm.notif = {
    show: function(field, message) {
        //your code to show notification
    },
    hide: function(jField) {
        //your code to hide notification
    } 
};