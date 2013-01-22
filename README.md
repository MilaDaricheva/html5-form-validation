jQuery html5 form validation plugin
===

Provides validation for:
- required fields and groups of fields.
- the following input types: number, url, email, tel.
- for html5 pattern attributes.


Usage:
___

This plugin requires jQuery.

Make sure to include plugin:

    <script src="js/jquery.validateForm.js"></script>

Apply it to any forms on your page:

    $('.formsSelector').validateForm();


Params:
___    

Override default options for all forms, make it once before plugin initializations:

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

Override default notification functions for all forms, make it once before plugin initializations:

$.fn.validateForm.notif = {
    show: function(field, message) {
        //your code to show notification
    },
    hide: function(jField) {
        //your code to hide notification
    } 
};

To override params only for selected forms just pass objects as params:

    var options = { /*Your options*/ }, notif = { /*Your show and hide functions*/ };

    $('.someFormSelector').validateForm(options, notif);


Form structure:
---

Apply html5 "required" attribute to any input you want to make required:

    <input type="text" name="requiredField" required />

If and input does not have an ID, it will be generated.


Apply "data-required" (or your custom) attribute for a group of checkboxes or radio buttons:

    <div data-required>
        <input type="checkbox" id="bike" name="vehicle" value="bike"><label for="bike">I have a bike</label><br/>
        <input type="checkbox" id="car" name="vehicle" value="car"><label for="car">I have a car</label><br/> 
        <input type="checkbox" id="truck" name="vehicle" value="truck"><label for="truck">I have a truck</label> 
    </div>


Apply html5 "pattern" attribute to any input that needs special format:

    <input type="text" name="requiredPattern" pattern="[A-Za-z0-9_]{5,20}" required />


Use html5 input types (number, url, email, tel) to validate according to default patterns or your custom (set inside options):

    <input type="number" />
    <input type="url" />
    <input type="email" />
    <input type="tel" />

If you would like to disable default browser's validation, use standard features like "novalidate" attribute for forms.







