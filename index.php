<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>jQuery plugin, HTML5 Forms validation</title>
    <meta name="description" content="jQuery plugin, HTML5 Forms validation" /> 
    <meta name="keywords" content="HTML5, HTML5 forms, forms validation, jQuery, JavaScript" />
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width" />
    <link rel="shortcut icon" href="http://wideline-studio.com/sites/default/files/clean_960gs_favicon.png">
    <link rel="apple-touch-icon" href="http://wideline-studio.com/sites/default/files/clean_960gs_favicon.png">
    <link rel="stylesheet" href="css/style.css" />
    <!--[if lt IE 9]>
    <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
</head>
<body>
    <div id="wrapper">
        <h1>jQuery plugin, HTML5 Forms validation</h1>
        <form class="formTemplate" action="#" novalidate>
            <div class="row">
                <label for="someField">Some field without validation rules</label>
                <input type="text" class="width100" id="someField" name="someField" />
            </div>
            <div class="row">
                <label for="requiredField">Required field</label>
                <input type="text" class="width100" id="requiredField" name="requiredField" required />
            </div>
            <div class="row">
                <label for="requiredPattern">Required field with pattern: allowed uppercase/lovercase letters, numbers, underscores, min 5 max 20 characters (username format)</label>
                <input type="text" class="width100" id="requiredPattern" name="requiredPattern" pattern="[A-Za-z0-9_]{5,20}" required />
            </div>
            <div class="row">
                <label for="typeNumber">Number</label>
                <input type="number" class="width100" id="typeNumber" name="typeNumber" min="0" max="50" step="5" />
            </div>
            <div class="row">
                <label for="typeEmail">Email</label>
                <input type="email" class="width100" id="typeEmail" name="typeEmail" placeholder="some@email.here" />
            </div>
            <div class="row">
                <label for="typeUrl">URL</label>
                <input type="url" class="width100" class="width100" id="typeUrl" name="typeUrl" placeholder="http://www." />
            </div>
            <div class="row">
                <label for="typeTel">Tel</label>
                <input type="tel" class="width100" id="typeTel" name="typeTel" placeholder="xxx-xxx-xxxx" />
            </div>
            <div class="row">
                <label>Required group of checkboxes: pick at least one</label>    
                <div data-required>
                    <input type="checkbox" id="bike" name="vehicle" value="bike"><label for="bike">I have a bike</label><br/>
                    <input type="checkbox" id="car" name="vehicle" value="car"><label for="car">I have a car</label><br/> 
                    <input type="checkbox" id="truck" name="vehicle" value="truck"><label for="truck">I have a truck</label> 
                </div>
            </div>   
            <div class="row">
                <label>Required group of radio buttons: pick at least one</label>    
                <div data-required>
                    <input type="radio" id="male" name="sex" value="male"><label for="male">Male</label><br/>
                    <input type="radio" id="female" name="sex" value="female"><label for="female">Female</label><br/>
                    <input type="radio" id="unknown" name="sex" value="unknown"><label for="unknown">Unknown</label>
                </div>
            </div>    
            <div class="row">
                <label>Select box</label>   
                <select required>
                    <option value="">Choose a car</option>
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                </select> 
            </div>          
            <div class="row">
                <label for="elementTextarea">Required textarea</label>
                <textarea class="width100" id="elementTextarea" rows="10" cols="30" required> </textarea>
            </div>
            <div class="row">
                <label>Single required checkbox</label>    
                <input type="checkbox" id="agree" name="agree" value="agree" required><label for="agree">Agree with terms</label>
            </div>
            <div class="row">
                <button type="submit" class="button" >Submit</button>
            </div>    
        </form>
    </div>

<!-- SCRIPTS -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script src="js/jquery.validateForm.js"></script>
<script src="js/main.js"></script>
<!-- end SCRIPTS -->    
</body>
</html>