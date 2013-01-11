<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>HTML5 Forms and JavaScript fallbacks</title>
    <meta name="description" content="HTML5 Forms and JavaScript fallbacks" /> 
    <meta name="keywords" content="HTML5, HTML5 forms, JavaScript fallbacks" />
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
        <h1>HTML5 Forms and JavaScript fallbacks</h1>
        <form class="formTemplate" action="#" novalidate>
            <div>
                <label for="attrPlaceholder">Attribute placeholder</label>
                <input type="text" id="attrPlaceholder" name="attrPlaceholder" placeholder="Disappears when you type" />
            </div>
            <div>
                <label for="attrAutofocus">Attribute autofocus</label>
                <input type="text" id="attrAutofocus" name="attrAutofocus" autofocus />
            </div>
            <div>
                <label for="attrRequired">Attribute required<sup>*</sup></label>
                <input type="text" name="attrRequired" required />
            </div>
            <div>
                <label for="attrPattern">Attribute pattern: allowed uppercase/lovercase letters, numbers, underscores, min 5 max 20 characters (username format)</label>
                <input type="text" id="" name="attrPattern" pattern="[A-Za-z0-9_]{5,20}" required />
            </div>
            <div>
                <label for="typeNumber">Type number with min/max/step attributes</label>
                <input type="number" id="typeNumber" name="typeNumber" min="0" max="50" step="5" />
            </div>
            <div>
                <label for="typeRange">Type range with min/max attributes</label>
                <input type="range" id="typeRange" name="typeRange" min="1" max="10" />
            </div>
            <div>
                <label for="typeEmail">Type email</label>
                <input type="email" id="typeEmail" name="typeEmail" placeholder="some@email.here" />
            </div>
            <div>
                <label for="typeUrl">Type URL</label>
                <input type="url" id="typeUrl" name="typeUrl" placeholder="http://www." />
            </div>
            <div>
                <label for="typeTel">Type tel</label>
                <input type="tel" id="typeTel" name="typeTel" placeholder="xxx-xxx-xxxx" />
            </div>
            <div>
                <label for="typeSearch">Type search</label>
                <input type="search" id="typeSearch" name="typeSearch" placeholder="Search..." />
            </div>
            <div>
                <label for="typeColor">Type color</label>
                <input type="color" id="typeColor" name="typeColor" />
            </div>
            <div>
                <label for="elementDatalist">Datalist element</label>
                <input type="text" id="elementDatalist" name="elementDatalist" list="myDatalist" placeholder="Dropdown should appear here" />
                <datalist id="myDatalist">
                    <option label="prom" value="Promo Package" >
                    <option label="corp" value="Corporate Package" >
                    <option label="ecom" value="eCommerce Package" >
                </datalist>
            </div>
            <div>
                <label for="typeDate">Type date</label>
                <input type="date" id="typeDate" name="typeDate" />
            </div>
            <div>
                <label for="typeTime">Type time</label>
                <input type="time" id="typeTime" name="typeTime" />
            </div>
            <div>
                <label for="typeDatetime">Type datetime</label>
                <input type="datetime" id="typeDatetime" name="typeDatetime" />
            </div>
            <div>
                <label for="typeMonth">Type month</label>
                <input type="month" id="typeMonth" name="typeMonth" />
            </div>
            <div>
                <label for="typeWeek">Type week</label>
                <input type="week" id="typeWeek" name="typeWeek" />
            </div>
            <div>
                <label for="elementOutput">Output element</label>
                <input type="range" id="elementOutput" name="elementOutput" />
                <output for="elementOutput"></output>
            </div>
            <div>
                <label>Progress element</label>
                <progress id="elementProgress" max="100" value="20" >Showing some note for browsers which do not support progress element</progress>
            </div>
            <div>
                <label>Meter element</label>
                <meter id="elementMeter" min="0" max="100" value="20" >Showing some note for browsers which do not support meter element</meter>
            </div>
            <div>
                <label for="elementTextarea">Textarea element</label>
                <textarea id="elementTextarea" rows="10" cols="30" > </textarea>
            </div>
            <div>
                <label>Checkboxes</label>    
                <div data-required>
                    <input type="checkbox" id="bike" name="vehicle" value="bike"><label for="bike">I have a bike</label><br/>
                    <input type="checkbox" id="car" name="vehicle" value="car"><label for="car">I have a car</label><br/> 
                    <input type="checkbox" id="truck" name="vehicle" value="truck"><label for="truck">I have a truck</label> 
                </div>
            </div>   
            <div>
                <label>Radio buttons</label>    
                <div data-required>
                    <input type="radio" id="male" name="sex" value="male"><label for="male">Male</label><br/>
                    <input type="radio" id="female" name="sex" value="female"><label for="female">Female</label><br/>
                    <input type="radio" id="unknown" name="sex" value="unknown"><label for="unknown">Unknown</label>
                </div>
            </div>    
            <div>
                <label>Select box</label>   
                <select required>
                    <option value="">Choose a car</option>
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                </select> 
            </div>  
            <div>
                <label>Checkbox</label>    
                <input type="checkbox" id="agree" name="agree" value="agree" required><label for="agree">Agree with terms</label>
            </div>

          <div>
            <button type="submit">Submit</button>
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