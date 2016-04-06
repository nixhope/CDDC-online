'use strict';

var ENV = 'prd'; //'dev'; 'tst'; 'prd'; 'trn'
var BASE_URL = '';

if (ENV === 'dev') {
    BASE_URL =
        'https://en.wikipedia.org/wiki/Emu_War'; 
    $('h3.title').text($('h3.title').text()+' (Development environment)')
} else if (ENV === 'tst') {
    BASE_URL =
        'https://en.wikipedia.org/wiki/Bathyscaphe_Trieste';
    $('h3.title').text($('h3.title').text()+' (Testing/Training environment)')
} else if (ENV === 'prd') {
    BASE_URL = 
    'https://en.wikipedia.org/wiki/Welsh_Factor';
} else if (ENV === 'trn') {
    BASE_URL =
        'https://en.wikipedia.org/wiki/List_of_Lithuanian_records_in_swimming';
    $('h3.title').text($('h3.title').text()+' (Testing/Training environment)')
}

var HANDLER_URL = BASE_URL+'/handler_2017.py';
var CHANGE_URL = BASE_URL+'/changes.py';
var TIMEOUT_URL = BASE_URL+'/timeout_prevent.py';

// Timeout prevention
// Prevents authentication timeouts in live environment
/*setInterval(function(){
    $.get(TIMEOUT_URL);
}, 1000*60*14);*/

$('.overlay').hide();

var DEFAULT_PAGE_SIZE = 10;
var DEFAULT_CURRENT_PAGE = 1;

/*
    Project Monolith Model View View-Model code
    Dependencies: jQuery, KnockOutJS, KOJS.mapping, jQuery URL parser
*/

// Function to track changes
ko.subscribable.fn.trackChanges = function() {
    var original = null;
    var isArray = jQuery.isArray(this());
    if (isArray) {
        original = ko.observableArray(this.slice());
    } else {
        original = ko.observable(this());
    }

    this.isDirty = ko.computed(function() {
        if (isArray) {
            if (compareArrays(original(), this())) {
                return false;
            } else {
                return true;
            }
        } else {
            return this() !== original();
        }
    }, this);
    this.discardChanges = function(){ 
        if (isArray) {
            this(original().slice());
        } else {
            this(original());
        }
    }
    this.keepChanges = function(){ 
        if (isArray) {
            var temp = original.slice();
            original(this.slice());
            return temp;
        } else {
            var temp = original(); 
            original(this()); 
            return temp;
        }
    }
    return this;  
}

function generateId() {
    var text = "";
    var possible = "ABCDEF0123456789";

    while (text.length < 32) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Returns true if arrays are equal
function compareArrays(arr1, arr2) {
    arr1 = arr1.slice().sort();
    arr2 = arr2.slice().sort();
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
            // Recursion
            if (!compareArrays(arr1[i], arr2[i])) {
                return false;
            }
        } else if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

// Returns the type (Module, Component, Template, Activity)
function getObjectType(foo) {
    if (foo instanceof Course) {
        return 'course';
    } else if (foo instanceof Component) {
        return 'component';
    } else if (foo instanceof Template) {
        return 'template';
    } else if (foo instanceof Activity) {
        return 'activity';
    } else if (foo instanceof StaffVariant) {
        return 'staffVariant';
    } else {
        return null;
    }
}

/* Converts the weeks boolean array
to text, e.g. "10-15, 18, 19-22" */
function weeksToText(weeks) {
    var weekString = "";
    var start = 0;
    for (var i = 1; i <= 52; i++) {
        if (weeks[i-1]) { // Current week is true
            if (start == 0) {
                start = i;
            }
            if (i == 52) {
                weekString += (weekString.length > 0) ? ", " : "";
                weekString += (i-start == 0) ?
                    start : start+"-"+(i);
                start = 0;
            }
        } else { // Current week is false
            if (start != 0) {
                weekString += (weekString.length > 0) ? ", " : "";
                weekString += (i-start == 1) ?
                    start : start+"-"+(i-1);
                start = 0;
            } else {}
        }
    }
    return weekString.length > 0 ?
        weekString : "0";
}

// Sets weeks array when format is either "##-##" or "##"
function setWeeks(weeks, text) {
    if (text.indexOf("-") !== -1) {
        for (var i = parseInt(text.split("-")[0])-1;
            i <= parseInt(text.split("-")[1])-1;
            i++)
            weeks[i] = true;
    } else {
        weeks[parseInt(text)-1] = true;
    }
}

// Converts text to boolean array (needs to be formatted correctly!)
function textToWeeks(text) {
    var weeks = [false];
    for (var i = 0; i < 52; i++)
        weeks[i] = false;
    text = text.replace(" ","");    
    if (text.indexOf(',') !== -1) {
        var split = text.split(',');
        for (var i = 0; i < split.length; i++) {
            setWeeks(weeks, split[i]);
        }
    } else {
        setWeeks(weeks, text);
    }
    return weeks;
}

// Converts a string of form '01110' to bool[]
function stringToWeeksArray(s) {
    var weeks = [false];
    for (var i = 0; i < 52; i++) {
        weeks[i] = (s[i] === '1') ? true : false;
    }
    return weeks;
}

// Function to get codes for campuses and terms
// This system is verbose, may fix later
function termLookUp(term){
    return {
        "SS": "SS Summer School",
        "S1": "S1 Semester One",
        "S2": "S2 Semester Two",
        "Q1": "Q1 Quarter One",
        "Q2": "Q2 Quarter Two",
        "Q3": "Q3 Quarter Three",
        "Q4": "Q4 Quarter Four",
        "LY": "LY Late Year"
    }[term];
}

function durationLookUp(duration) {
    // "120 mins (2 hours)"
    if (duration instanceof Function) {
        var d = duration();
    } else {
        var d = duration;
    }
    d = d/2;
    return d*60+' mins ('+d+' hours)';
}

function campusLookUp(campus){
    return {
        "C": "C (City)",
        "E": "E (Epsom)",
        "H": "H (Grafton)",
        "T": "T (Tamaki)",
        "K": "K (Unspecified NZ)",
        "KA": "KA (Kawakawa)",
        "LM": "LM (Leigh Marine)",
        "M": "M (Manukau)",
        "N": "N (Whangarei)",
		"NM": "NM (Newmarket)",
        "O": "O (Online)",
        "R": "R (Rotorua)",
        "V": "V (Overseas)",
        "WI": "WI (Waiheke)",
        "X": "X (Extramural)",
        "Y": "Y (Tai Tokerau)",
        "Z": "Z (Waikato)"
    }[campus];
}

function componentLookUp(componentType){
    return {
        "CLN": "Clinic", 
        "DIS": "Discussion", 
        "FLD": "Field Studies", 
        "IND": "Independent", 
        "LAB": "Laboratory", 
        "LEC": "Lecture", 
        "PLC": "Plenary", 
        "SEM": "Seminar", 
        "STU": "Studio", 
        "SUP": "Supervised", 
		"TBL": "Team Based Learning",
        "THE": "Thesis", 
        "TUT": "Tutorial", 
        "WRK": "Workshop"
    }[componentType];
}

// Return a sorted array with <br/> splits
function displayArray(arr, mapFunction) {
    arr = arr.slice();
    if (arr.length == 0) {
        return 'None';
    }
    if (typeof mapFunction === 'function') {
        // Apply mapping function
        for (var i = 0; i < arr.length; i++) {
            arr[i] = mapFunction(arr[i]);
        }
    } else {
        arr.sort();
    }
    return arr.join('<br/>\n');
}

// Replaces \n with <br/>
function addLineBreaks(raw) {
    if (raw === null || raw === undefined) {
        return '';
    } else {
        return raw.replace(/\n/g, '<br/>');
    }
}

// Sort variant array by weeks, assuming each variant is a ko.observable()
// Format for variantX.weeks() should be '0011100' string
function sortVariantListByWeeks(list) {
    list.sort(function(variant1, variant2) {
        var w1 = variant1.weeks();
        var w2 = variant2.weeks();
        // This doesn't quite work.
        // 001 must come AFTER 010
        // But 00101 must come AFTER 00110
        // AND 001010 must come BEFORE 001001
        // AND 001110 must come AFTER 001100
        for (var i = 0; i < Math.min(w1.length, w2.length); i++) {
            if (w1[i] != w2[i]) { 
                if (w1[i] == '0') {
                    return 1; // '0' goes after '1'
                } else {
                    return -1;
                }
                //return w1[i].localeCompare(w2[i]); 
            }
        }
        return 0;
    });
}

// Sort variant array by names, assuming each variant is a ko.observable()
function sortVariantListByNames(list) {
    list.sort(function(variant1, variant2) {
        var w1 = variant1.staffPreset();
        var w2 = variant2.staffPreset();
        if (w1 < w2) {
            return -1;
        } else {
            return 1;
        }
    });
}

// Combines all weeks (logical OR), from a ko.observableArray or other array of staffVariants
function addVariantWeeks(staffVariantList) {
    var combinedWeeks = '';
    for (var weekNumber = 0; weekNumber < 52; weekNumber++) {
        var local = '0';
        for (var ind = 0; ind < staffVariantList.length; ind++) {
            if (staffVariantList[ind].weeks()[weekNumber] === '1') {
                local = '1';
                break;
            }
        }
        combinedWeeks += local;
    }
    return combinedWeeks;
}

// Returns true if all of weeks is contained by parentWeeks
function weeksContainedBy(weeks, parentWeeks) {
    for (var i = 0; i < 52; i++) {
        if (weeks[i] === '1' && parentWeeks[i] !== '1') {
            return false;
        }
    }
    return true;
}

// Remove any suitabilities we don't want to display
// Won't affect underlying data if we remove them before changes are tracked
function stripSuitabilities(suitabilities, faculty) {
    for (var i = suitabilities.length-1; i >= 0; i--) {
        if (RESTRICTED_SUITABILITIES.indexOf(suitabilities[i]) > -1
            || LOCATION_TYPES.indexOf(suitabilities[i]) > -1
            || SUITABILITIES_BY_FACULTY[faculty].indexOf(suitabilities[i]) >-1) {
            // Do nothing, happy to just keep the suitability
        } else {
            suitabilities.splice(i, 1);
        }
    }
    // No need to return since suitabilities should be a reference
}

function StaffVariant(course, parentId, variantData, isNew) {
    var self = this;

    // Internal flags
    self._new = ko.observable(isNew);
    self.courseId = ko.observable(course.id);
    self.parentId = ko.observable(parentId);

    var fields = ['id', 'weeks', 'staffPreset'];

    for (var i = 0; i < fields.length; i++) {
        self[fields[i]] = ko.observable(variantData[fields[i]]).trackChanges();
    }

    // Checks if this staffvariant has been modified
    self._changed = ko.computed(function() {
        if (self._new())
            return true;
        for (var propertyName in self) {         
            var property = self[propertyName];
            if (property) {
                if (property instanceof Function && property.hasOwnProperty('isDirty')
                    && property() instanceof Array && property().length > 0
                    && property()[0] !== null
                    && property()[0].hasOwnProperty('_changed')) {
                    // property is a ko.observableArray of a major data structure
                    for (var i = 0; i < property().length; i++) {
                        if (property()[i]._changed()) {
                            return true;
                        }
                    }
                } else if (property.hasOwnProperty('isDirty') && property.isDirty()) {
                    // property is a ko.observable, or ko.observableArray
                    return true;
                }
            }
        }
        return false;
    });
}

function Activity(course, parentId, activityData, isNew) {
    var self = this;

    // Internal flags
    self._new = ko.observable(isNew);   
    self.courseId = ko.observable(course.id);
    self.parentId = ko.observable(parentId);

    var fields = [
        'id', 
        'name', 
        'hostkey', 
        'duration', 
        'size',
        'locationRequirementNumber',
        'staffRequirementNumber',
        'weeks', 
        'availabilityPatternName', 
        'startPreferenceName',
        'activityFreeText',
        'locationFreeText'
    ];
    var arrayFields = [
        'locationPresets', 
        'staffPresets', 
        'locationSuitabilities',
        'jointlyTaughtWith',
        'variants'
    ];
    for (var i = 0; i < fields.length; i++) {
        self[fields[i]] = ko.observable(activityData[fields[i]]).trackChanges();
    }
    stripSuitabilities(activityData.locationSuitabilities, course.faculty());
    for (var i = 0 ; i < arrayFields.length; i ++) {
        self[arrayFields[i]] = ko.observableArray(activityData[arrayFields[i]]).trackChanges();
    }

    var mappedData = $.map(activityData.staffVariants, function(item) {
        return new StaffVariant(course, self.id, item, isNew);
    });
    self.staffVariants = ko.observableArray(mappedData).trackChanges();

    sortVariantListByWeeks(self.staffVariants);

    self.expanded = ko.observable(false);   

    // Functions
    self.expand = function() {
        self.expanded(!self.expanded());
    }

    // Checks if this activity has been modified
    self._changed = ko.computed(function() {
        if (self._new())
            return true;
        for (var propertyName in self) {         
            var property = self[propertyName];
            if (property) {
                if (property instanceof Function && property.hasOwnProperty('isDirty')
                    && property() instanceof Array && property().length > 0
                    && property()[0] !== null
                    && property()[0].hasOwnProperty('_changed')) {
                    // property is a ko.observableArray of a major data structure
                    for (var i = 0; i < property().length; i++) {
                        if (property()[i]._changed()) {
                            return true;
                        }
                    }
                } else if (property.hasOwnProperty('isDirty') && property.isDirty()) {
                    // property is a ko.observable, or ko.observableArray
                    return true;
                }
            }
        }
        return false;
    });
}

// Class to represent a component of a particular duration
function Template(course, parentId, templateData, isNew) {
    var self = this;

    // Internal flags
    self._new = ko.observable(isNew);   
    self.courseId = ko.observable(course.id);
    self.parentId = ko.observable(parentId);

    var fields = [
        'id', 
        'name', 
        'hostkey', 
        'duration',
        'locationRequirementNumber', 
        'staffRequirementNumber',
        'locationFreeText'
    ];
    var arrayFields = [
        'locationPresets', 
        'staffPresets', 
        'locationSuitabilities'
    ];
    for (var i = 0; i < fields.length; i++) {
        var d = templateData[fields[i]];
        if (fields[i] == 'duration') {
            d = parseInt(d);
        }
        self[fields[i]] = ko.observable(d).trackChanges();
    }
    stripSuitabilities(templateData.locationSuitabilities, course.faculty());
    for (var i = 0 ; i < arrayFields.length; i ++) {
        self[arrayFields[i]] = ko.observableArray(templateData[arrayFields[i]]).trackChanges();
    }

    var mappedData = $.map(templateData.activities, function(item) {
        return new Activity(course, self.id, item, false);
    });
    self.activities = ko.observableArray(mappedData).trackChanges();

    self.expanded = ko.observable(false);   

    // Functions
    self.expand = function() {        
        self.expanded(!self.expanded());
    }

    // Checks if this template has been modified
    self._changed = ko.computed(function() {
        if (self._new())
            return true;
        for (var propertyName in self) {         
            var property = self[propertyName];
            if (property) {
                if (property instanceof Function && property.hasOwnProperty('isDirty')
                    && property() instanceof Array && property().length > 0
                    && property()[0] !== null
                    && property()[0].hasOwnProperty('_changed')) {
                    // property is a ko.observableArray of a major data structure
                    for (var i = 0; i < property().length; i++) {
                        if (property()[i]._changed()) {
                            return true;
                        }
                    }
                } else if (property.hasOwnProperty('isDirty') && property.isDirty()) {
                    // property is a ko.observable, or ko.observableArray
                    return true;
                }
            }
        }
        return false;
    });
}

// Class to represent a component
function Component(course, componentData, isNew) {
    var self = this;

    // Internal flags
    self._new = ko.observable(isNew);

    self.courseId = ko.observable(course.id);
    self.parentId = ko.observable(course.id);

    self.id = ko.observable(componentData.id);
    self.name = ko.observable(componentData.name).trackChanges();
    self.campus = ko.observable(componentData.campus).trackChanges();
    self.size = ko.observable(componentData.size).trackChanges();
    self.streamCount = componentData.streamCount;
    var mappedData = $.map(componentData.templates, function(item) {
        return new Template(course, self.id, item, false);
    });
    self.templates = ko.observableArray(mappedData).trackChanges();

    self.expanded = ko.observable(false);   

    // Functions
    self.expand = function() {        
        self.expanded(!self.expanded());
    }

    // Checks if this component has been modified
    self._changed = ko.computed(function() {
        if (self._new())
            return true;
        for (var propertyName in self) {         
            var property = self[propertyName];
            if (property) {
                if (property instanceof Function && property.hasOwnProperty('isDirty')
                    && property() instanceof Array && property().length > 0
                    && property()[0] !== null
                    && property()[0].hasOwnProperty('_changed')) {
                    // property is a ko.observableArray of a major data structure
                    for (var i = 0; i < property().length; i++) {
                        if (property()[i]._changed()) {
                            return true;
                        }
                    }
                } else if (property.hasOwnProperty('isDirty') && property.isDirty()) {
                    // property is a ko.observable, or ko.observableArray
                    return true;
                }
            }
        }
        return false;
    });
}

function checkForChanges(scope) {
    if (scope._new())
        return true;
    for (var propertyName in scope) {         
        var property = scope[propertyName];
        if (property) {
            if (property instanceof Function && property.hasOwnProperty('isDirty')
                && property() instanceof Array && property().length > 0
                && property()[0] !== null
                && property()[0].hasOwnProperty('_changed')) {
                // property is a ko.observableArray of a major data structure
                for (var i = 0; i < property().length; i++) {
                    if (property()[i]._changed()) {
                        return true;
                    }
                }
            } else if (property.hasOwnProperty('isDirty') && property.isDirty()) {
                // property is a ko.observable, or ko.observableArray
                return true;
            }
        }
    }
    return false;
}

// Class to represent a course
function Course(changeLog, courseData, isNew) {
    var self = this;
    self.hostkey = isNew ? Math.round(Math.random()*10000, 0) : courseData['moduleHostkey'];
    
    // Internal flags
    self._new = ko.observable(isNew);    
    
    // Initialise the tracked fields all at once
    var fields = [
        'id',
        'name',
        'subject',
        'courseNumber',
        'term',
        'campus',
        'faculty',
        'department',
        'title',
        'size',
        'status',
        'availability',
        'credits',
        'moduleFreeText',
        'sequencingFreeText',
        'lastEdited'
    ];
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        self[field] = ko.observable(courseData[field]).trackChanges();
    }
    if (courseData.sequencingSelection instanceof Array) {
        var sequencingSelection = courseData.sequencingSelection;
    } else {
        var sequencingSelection = JSON.parse(courseData.sequencingSelection);
    }
    if (sequencingSelection === null) {
        sequencingSelection = [ ];
    }
    self.sequencingSelection = ko.observableArray(sequencingSelection).trackChanges();
	
    self.courseId = ko.observable(self.id());
    self.parentId = ko.observable(null);
    // Components
	var mappedData = $.map(courseData.components, function(item) {
        return new Component(
            self,
            item,
            false
        )
    });
    self.components = ko.observableArray(mappedData).trackChanges();
	
    self.expanded = ko.observable(false);

    // Functions
    self.expand = function() {
        self.expanded(!self.expanded());
    }

    // Checks if this course has been modified
    self._changed = ko.computed(function() {
        if (self._new())
            return true;
        for (var propertyName in self) {         
            var property = self[propertyName];
            if (property) {
                if (property instanceof Function && property.hasOwnProperty('isDirty')
                    && property() instanceof Array && property().length > 0
                    && property()[0] !== null
                    && property()[0].hasOwnProperty('_changed')) {
                    // property is a ko.observableArray of a major data structure
                    for (var i = 0; i < property().length; i++) {
                        if (property()[i]._changed()) {
                            return true;
                        }
                    }
                } else if (property.hasOwnProperty('isDirty') && property.isDirty()) {
                    // property is a ko.observable, or ko.observableArray
                    return true;
                }
            }
        }
        return false;
    });
    
    var recursiveSave = function(foo, alreadyLogged) {
        if (undefined === alreadyLogged) {
            alreadyLogged = false; // Indicates whether this change has been logged by an ancestor
        }
        if (foo._new()) {
            // Log if course is new/copied
            // Will include ALL changes made to own properties, plus descendants
            if (!alreadyLogged) {
                changeLog.log(foo, getObjectType(foo), "insert", null, ko.toJS(foo));
            }
            foo._new(false);
            alreadyLogged = true; // Prevents logging of descendants' changes
        }
        
        // Make changes permanent
        for (var propertyName in foo) {   
            var property = foo[propertyName];
            if (propertyName === 'parent') {
            } else if (property) {
                if (property instanceof Function && property.hasOwnProperty('isDirty')
                    && property() instanceof Array && property().length > 0
                    && property()[0] !== null
                    && property()[0].hasOwnProperty('_changed')) {
                    // property is a ko.observableArray of a major data structure                    
                    // Make changes to children
                    for (var i = 0; i < property().length; i++) {
                        if (property()[i]._changed()) {
                            recursiveSave(property()[i], alreadyLogged);
                        }
                    }
                } else
                if (property.hasOwnProperty("isDirty") && property.isDirty()) {
                    // Save changes for properties
                    var oldValue = property.keepChanges();
                    if (!alreadyLogged) {
                        changeLog.log(foo, propertyName, "update", oldValue, property());
                    }
                }
            }
        }
    }
    
    self.saveChanges = function(){recursiveSave(self, false);};

    var recursiveDiscard = function(scope) {
        for (var propertyName in scope) {            
            var property = scope[propertyName];
            if (propertyName === 'parent') {

            } else if (property && property.hasOwnProperty('isDirty')) {
                if (property() instanceof Array && property().length > 0
                    && property()[0] !== null
                    && property()[0].hasOwnProperty('_changed')) {
                    // property is a ko.observableArray of a major data structure
                    // Make changes to children
                    for (var i = 0; i < property().length; i++) {
                        if (property()[i]._changed()) {
                            recursiveDiscard(property()[i]);
                        }
                    }
                } 
                if (property.isDirty()) {
                    // Discard property changes
                    property.discardChanges();
                }
            }
        }
    }

    self.discardChanges = function() {recursiveDiscard(self);};
};

// This is more an interface/skeleton-class than a fully fledged class
// Implementation details vary depending on task
function Overlay(){
    var self = this;
    self.visible = ko.observable(false);
    self.origin = null; // Object that initiated the overlay data entry
    self.value = ko.observable(null); // To be used as appropriate
    self.localName = ko.observable('');
    self.course = ko.observable(null);
    self.parent = ko.observable(null);
    self.caller = ko.observable(null);
    self.show = function(origin, name, course, parent, caller){
        self.localName(name);        
        self.course(course);
        self.value(origin());
        self.caller(caller);
        self.origin = origin;
        if (parent !== undefined) {
            self.parent(parent);
        } else {
            self.parent(null);
        }
        // Lastly initialise and set as visible (and trigger lazy binding)        
        self.initialiseOverlay();
        self.visible(true);
    }    
    self.change = function(){
        self.handleChanges();
        self.visible(false);
        self.origin = null;
        self.value(null);
        self.parent(null);
    }
    self.cancel = function(){
        self.visible(false);
        self.origin = null;
        self.value(null);
        self.parent(null);
        self.discard();
    }
    // Extendable functions:
    self.initialiseOverlay = function() { // Needs to be implemented
        // Enter relevant code
    }
    self.handleChanges = function() { // Needs to be implemented
        // Enter relevant code here to return changes to the caller
    }
    
    self.discard = function(){ // Needs to be implemented (if required)
        // Enter relevant code here to deal with cancellations
    }
    // There is probably a much better and simpler way of dealing with the overlays!
    // callbacks maybe?    
}

// Week selection
var isMouseSelecting = false;
var isMouseDown = true;

// Mouse listeners
$(document).mousedown(function() {
    isMouseDown = true;
})
.mouseup(function() {
    isMouseDown = false;
});

function selectWeek(self) {
    self.removeClass("week");
    self.addClass("selectedweek");
    isMouseSelecting = true;
    self.unbind();
    self.mouseenter(function() {
        if (isMouseDown && !isMouseSelecting) {
            deselectWeek(self)
        }                   
    });
    self.mousedown(function(event) {
        deselectWeek(self);
    });
}

function deselectWeek(self) {
    self.removeClass("selectedweek");
    self.addClass("week");
    isMouseSelecting = false;
    self.unbind();
    self.mouseenter(function() {
        if (isMouseDown && isMouseSelecting) {              
            selectWeek(self);                   
        }
    });
    self.mousedown(function(event) {
        selectWeek(self);
    });
}

// Overall ViewModel for the data
function CourseInformationViewModel() {
    var self = this;
    self.status = ko.observable('initialising');

    self.unsentChanges = ko.observable(false);

    // ChangeLog
    self.changeLog = ko.observableArray([ ]);
    self.changeLog.log = function(foo, property, changeType, initialValue, finalValue){
        this.push({
            courseId: foo.courseId(),
            objectType: getObjectType(foo),
            changeType: changeType,
            property: property,
            id: foo.id(),
            parentId: foo.parentId(),
            initialValue: initialValue,
            finalValue: finalValue
        });
        self.unsentChanges(true);
    };
    self.watchlog = ko.computed(function() {
        return JSON.stringify(ko.toJS(self.changeLog), null, 2);
    });

    // Send changes to server
    self.sendChangesToServer = function() {
        // Send changes
        if (false) { // In case there are times when we don't want to send changes to the server
            // E.g. if it's just a mockup online somewhere!
            self.responseOverlay.status('sending');
            self.responseOverlay.visible(true);
            $.ajax({
                url: CHANGE_URL,
                data: {
                    changes: encodeURIComponent(ko.toJSON(self.changeLog))
                },
                type: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                dataType: 'jsonp',
                success: function(response) {
                    // Success. Handle response and clear changelog
                    self.responseOverlay.status('success');
                    self.responseOverlay.text(response.messages);
                    self.responseOverlay.errorText(response.errors);
                    self.responseOverlay.visible(true);
                    self.unsentChanges(false);
                    self.changeLog([]);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 0) {
                        // Authenticated session timed out
                        // Ask user to refresh
                        self.responseOverlay.status('success');
                        self.responseOverlay.text('');
                        self.responseOverlay.errorText('The server did not respond.\n'+
                            'This is probably because your network session timed out.\n'+
                            'Please refresh the page (you can use [Ctrl]+[F5]).');
                        self.responseOverlay.visible(true);
                        self.changeLog([]);
                    } else {
                        var errorLog = {
                            'errorStatus': textStatus,
                            'errorThrown': errorThrown,
                            'httpStatus': jqXHR.status,
                            'httpResponse': jqXHR.responseText,
                            'changeLog': ko.toJS(self.changeLog)
                        };
                        self.responseOverlay.status('error');
                        self.responseOverlay.errorText(JSON.stringify(errorLog, null, 2));
                        self.responseOverlay.visible(true);
                    }
                }
            });
        } else {
            // Lol
            self.responseOverlay.status('sending');
            self.responseOverlay.visible(true);
            self.responseOverlay.status('success');
            self.responseOverlay.text('We\'re going to pretend that changes were actually saved. Hint: They weren\'t.');
            self.responseOverlay.errorText('Magically, there were no errors. Except for the fact that nothing got saved.');
            self.responseOverlay.visible(true);
            self.unsentChanges(false);
            self.changeLog([]);
        }     
    }
    
    // All the course data
    self.courses = ko.observableArray([ ]);    
    
    // Functions
    self.changeStatus = function(course, status) {
        course.status(status);
    }

    // Add Course, Component, Template or Activity. Need to know parent
    self.addObject = function(objectType, parent, course) {
        if ('course' === objectType) {
            // console.log('Don't add new courses this way. Get people to copy existing ones');
        } else if ('component' === objectType) {
            var newObjectData = {
                'id': generateId(),
                'name': 'IND',
                'campus': parent.campus(),
                'size': parent.size(),
                'streamCount': 1,
                'templates': []
            }
            var newObject = new Component(course, newObjectData, true);
            parent.components.splice(0, 0, newObject);
        } else if ('template' === objectType) {
            var newObjectData = {
                'id': generateId(),
                'name': 'New Template',
                'hostkey': '',
                'duration': 2,
                'locationRequirementNumber': 0,
                'staffRequirementNumber': 0,
                'locationFreeText': null,
                'locationPresets': [],
                'staffPresets': [],
                'locationSuitabilities': [],
                'activities':[]
            }
            var newObject = new Template(course, parent.id, newObjectData, true);
            parent.templates.splice(0, 0, newObject);
        } else if ('activity' === objectType) {
            var newObjectData = {
                'id': generateId(),
                'name': 'New Activity',
                'hostkey': '',
                'duration': parent.duration(),
                'size': 999,
                'locationRequirementNumber': parent.locationRequirementNumber(),
                'staffRequirementNumber': 0,
                'weeks': FORMAL_AWARDS[course.term()],
                'availabilityPatternName': null,
                'startPreferenceName': null,
                'activityFreeText': null,
                'locationFreeText': parent.locationFreeText(),
                'locationPresets': parent.locationPresets.slice(),
                'staffPresets': parent.staffPresets.slice(),
                'locationSuitabilities': parent.locationSuitabilities.slice(),
                'jointlyTaughtWith': [],
                'variants': [],
                'staffVariants': []
            }
            var newObject = new Activity(course, parent.id, newObjectData, true);
            parent.activities.splice(0, 0, newObject);
        } else if ('staffVariant' === objectType) {
            var newObjectData = {
                'id': generateId(),
                'weeks': '0000000000000000000000000000000000000000000000000000',
                'staffPreset': null
            }
            var newObject = new StaffVariant(course, parent.id, newObjectData, true);
            parent.staffVariants.splice(0,0, newObject);
        } else {
            // console.log('So, what are we actually adding???');
        }
    }

    // Copy Course, Component, Template or Activity. Need to know parent
    self.copyObject = function(foo, parent, course) {
        function changeActivityIds(activity, parentId) {
            var newId = generateId();
            activity.id(newId);
            activity.parentId(parentId);
            for (var i = 0; i < activity.staffVariants().length; i++) {
                activity.staffVariants()[i].id(newId);
                activity.staffVariants()[i].parentId(newId);
            }
        }
        function changeTemplateIds(template, parentId) {
            var newId = generateId();
            template.id(newId);
            template.parentId(parentId);
            for (var i = 0; i < template.activities().length; i++) {
                changeActivityIds(template.activities()[i], newId);
            }
        }
        function changeComponentIds(component, parentId) {
            var newId = generateId();
            component.id(newId);
            component.parentId(parentId);
            for (var i = 0; i < component.templates().length; i++) {
                changeTemplateIds(component.templates()[i], newId);
            }
        }

        var newObjectData = ko.toJS(foo); // Convert the object to pure JavaScript, as seed for new one
        var objectType = getObjectType(foo);
        newObjectData.id = generateId();

        if ('course' === objectType) {
            var newObject = new Course(self.changeLog, newObjectData, true);
            var ind = self.courses.indexOf(foo)+1;
            for (var i = 0; i < newObject.components().length; i++) {
                changeComponentIds(newObject.components()[i], newObject.id());
            }
            self.courses.splice(ind, 0, newObject);            
        } else if ('component' === objectType) {
            var newObject = new Component(course, newObjectData, true);
            var ind = parent.components.indexOf(foo)+1;
            for (var i = 0; i < newObject.templates().length; i++) {
                changeTemplateIds(newObject.templates()[i], newObject.id());
            }
            parent.components.splice(ind, 0, newObject);
        } else if ('template' === objectType) {
            var newObject = new Template(course, parent.id, newObjectData, true);
            var ind = parent.templates.indexOf(foo)+1;
            for (var i = 0; i < newObject.activities().length; i++) {
                changeActivityIds(newObject.activities()[i], newObject.id());
            }
            parent.templates.splice(ind, 0, newObject);
        } else if ('activity' === objectType) {
            var newObject = new Activity(course, parent.id, newObjectData, true);
            var ind = parent.activities.indexOf(foo)+1;
            parent.activities.splice(ind, 0, newObject);
        } else if ('staffVariant' === objectType) {
            // console.log('Don't copy staff variants');
        } else {
            // console.log('So, what are we actually copying???');
        }
    }

    // Delete Course, Component, Template or Activity. Need to know parent
    self.deleteObject = function(foo, parent) {
        var objectType = getObjectType(foo);
        if (null === parent) {
            var text = 'Are you sure you wish to delete '+foo.name()+'?'+
            '\n\nThis change cannot be undone once written back to the server.';
        } else {
            var text = "Are you sure you wish to delete this "+objectType+" of "+parent.name()+"?"+
                "\n\nThis change cannot be undone once written back to the server.";
        }
        if (foo._new() || true === confirm(text)) {                      
            if (!foo._new()) {
                // Log if the object is not new
                self.changeLog.log(foo, objectType, "delete", ko.toJS(foo), null);
            }
            // DELETE
            if ('course' === objectType) {
                // Courses shouldn't really be getting deleted unless they are ._new()
                self.courses.remove(foo);
            } else if ('component' === objectType) {
                parent.components.remove(foo);
                if (0 === parent.components().length) {
                    // Deleting last member will trigger the isDirty flag
                    parent.components.keepChanges();
                }
            } else if ('template' === objectType) {
                parent.templates.remove(foo);
                if (0 === parent.templates().length) {
                    // Deleting last member will trigger the isDirty flag
                    parent.templates.keepChanges();
                }
            } else if ('activity' === objectType) {
                parent.activities.remove(foo);
                if (0 === parent.activities().length) {
                    // Deleting last member will trigger the isDirty flag
                    parent.activities.keepChanges();
                }
            } else if ('staffVariant' === objectType) {
                parent.staffVariants.remove(foo);
                if (0 === parent.staffVariants().length) {
                    // Deleting last member will trigger the isDirty flag
                    parent.staffVariants.keepChanges();
                }
            } else {
                // console.log('So, what are we actually deleting???');
            }
        }
    }

    // Copy an existing course to create a new course
    self.copyCourse = function(course){
        var newCourse = ko.toJS(course); // Convert the ko course to pure JS, to seed new
        self.courses.splice(self.courses.indexOf(course)+1,
            0, new Course(self.changeLog, newCourse, true));
    }

    // Filters
    /* Following fields can be filtered: 
    subject, course number, term, campus, size, faculty, department, status, years, last edited*/
    self.courseHeaders = ['subject',
        'course-number',
        'title',
        'term',
        'campus', 
        'size', // "min,max"
        'faculty',
        'department',
        'status',
        'last-edited'];
    self.filters = { 'sizeMin': ko.observable(null), 'sizeMax': ko.observable(null) };
    self.formatHeader = function(header){ // Formats "course-number" to "Course Number"
        if (header === null) {
            return '';
        }
        header = header.replace('-', ' ');
        return header.charAt(0).toUpperCase() + header.slice(1);
    }
    var changeFilter = function(e){
        // Filter changed
        self.currentFilter(null); // Hide filter row

        // Get new data
        if (self.currentPage() === 1) {
            getData(self);
        } else {
            self.currentPage(1); // Redirect to page 1 after filtering.
        }
    }
    for (var i in self.courseHeaders) {
        self.filters[self.courseHeaders[i]] = ko.observable(null);
        self.filters[self.courseHeaders[i]].subscribe(changeFilter)
    }

    self.filterBySize = function(){
        if (self.filters.sizeMin() !== null || self.filters.sizeMax() !== null)
            self.filters.size(self.filters.sizeMin()+","+self.filters.sizeMax());
    }

    self.filterOptions = { }; // Have to come from the server

    self.currentFilter = ko.observable(null); // The field that is currently being filtered

    // Show the filters
    self.showFilters = function(e) {
        var id = '';
        if (e.target.nodeName === "TH")
            id = e.target.id;
        else
            id = e.target.parentNode.id;
        // Just have to hope nesting is only 1 deep
        self.currentFilter(id);
    }    

    // Clear the relevant filter
    self.clearFilter = function() {
        if (self.currentFilter() === 'size') {
            self.filters.sizeMin(null);
            self.filters.sizeMax(null);
        }
        self.filters[self.currentFilter()](null);
        self.currentFilter(null);
    }
    
    // Sort - sorting is disabled until the demand arises
    /*
    self.sortField = ko.observable("Name");
    self.sortDirection = ko.observable("asc");*/
    
    // Pagination
    self.currentPage = ko.observable(DEFAULT_CURRENT_PAGE);
    self.currentPage.subscribe(function(newValue){        
        getData(self);
    });
    self.pageSize = ko.observable(DEFAULT_PAGE_SIZE);    
    self.pageSize.subscribe(function(newValue){getData(self);}); // Update when pageSize changes
    self.rowCount = ko.observable(0);
    self.pageCount = ko.computed(function() { // Returns total number of pages
        return self.rowCount() <= 0 ? 1 : Math.ceil(self.rowCount()/self.pageSize());
    });
    self.changePage = function(newPage) {
        self.currentPage(parseInt(newPage));
    };   
    
    self.pageList = ko.computed(function() { // Returns the list of page numbers to have as links
        // Depends heavily on current page and pageCount
        var pages = [ ];
        for (var i = 1; i <= self.pageCount(); i++) { // Start at 1, not 0
            if (self.pageCount() <= 7 ||                                    // Show all if length <= 7
                i <= 3 ||                                                   // Show first 3
                i > self.pageCount() - 3 ||                                 // Show last 3
                (i >= self.currentPage()-2 && i <= self.currentPage()+2)    // p-2 ... p ... p+2
                ) {
                pages.push(i);
            }
        }
        // Insert ellipses
        var demarcatedPages = [pages[0]]; // Includes '...' whenever there's a gap
        for (var i = 1; i < pages.length; i++) {
            if (pages[i] != pages[i-1]+1)
                demarcatedPages.push("...");
            demarcatedPages.push(pages[i]);
        }
        return demarcatedPages;
    });
    
    // Form validation
    self.isInteger = function(d, e) {
        // d is data, e is the event
        // returns true if pressed key is between 0 and 9
        var c = e.originalEvent.keyCode > 0 ? e.originalEvent.keyCode : e.originalEvent.charCode;
        if (c == 13 || c == 14) {// Enter/carriage return
            if (e.target.className === 'size-selector') {
                 // Need to change focus to update the knockout variable
                jQuery('#size-filter-button').focus();
                self.filterBySize();
                return true;
            }
        }
        if ((c >= 48 && c <= 57) || (c >= 96 && c <= 105))
            // 48 = 0, 96 = numpad 0
            return true;
        if (c >= 35 && c <= 46) // navigation and delete
            return true;
        if (c < 27)
            return true;
        return false;
    };

    // Parameters in URL
    self.getParameterString = function() { // Gets the parameters as a url-encoded string
        var filterString = '';

        var addValuesToString = function(n, val){
            filterString += filterString.length > 0 ? '&' : '';
            filterString += n + '=' +encodeURIComponent(val);
        };

        for (var f in self.filters) {
            var v = self.filters[f]();
            if (v) {
                addValuesToString(f, v);
            }
        }
        if (self.pageSize() !== DEFAULT_PAGE_SIZE) {
            addValuesToString('pageSize', self.pageSize());
        }
        if (self.currentPage() !== DEFAULT_CURRENT_PAGE) {
            addValuesToString('currentPage', self.currentPage());
        }
        return filterString;
    };

    // Server response overlay - log responses from server when changes are sent
    self.responseOverlay = new Overlay();
    self.responseOverlay.status = ko.observable('');
    self.responseOverlay.text = ko.observable('');
    self.responseOverlay.errorText = ko.observable('');

    // Weeks overlay
    self.weeksOverlay = new Overlay();
    self.weeksOverlay.availabilityOptions = ko.computed(function(){
        var availabilities = [];
        if (self.weeksOverlay.course() === null) {
            return availabilities;
        }
        if ('EDUFAC' === self.weeksOverlay.course().faculty()) {
            for (var availabilityName in EDUFAC_AVAILABILITIES[self.weeksOverlay.course().term()]) {
                availabilities.push(availabilityName);
            }
        } else {
            for (var availabilityName in NAMED_AVAILABILITIES[self.weeksOverlay.course().term()]) {
                availabilities.push(availabilityName);
            }
        }
        return availabilities;
    });
    self.weeksOverlay.selectedAvailabilityOption = ko.computed(function() {
        // Need to by default have the correct option highlighted
        // Try to base it on AVAILABILITY weeks, if they match, 
        // and, if not, on course's semester
        if (self.weeksOverlay.course() === null) {
            return 'First Semester Formal Award';
        }
        var defaultAvailabilityName = null;
        var appropriateAvailabilities;
        var weeks = self.weeksOverlay.value();
        if ('EDUFAC' === self.weeksOverlay.course().faculty()) {
            appropriateAvailabilities = EDUFAC_AVAILABILITIES[self.weeksOverlay.course().term()];
        } else {
            appropriateAvailabilities = NAMED_AVAILABILITIES[self.weeksOverlay.course().term()];
        }
        for (var availabilityName in appropriateAvailabilities) {
            if (weeks === appropriateAvailabilities[availabilityName]) {
                defaultAvailabilityName = availabilityName;
                break;
            }
        }
        if (defaultAvailabilityName === null) {
            // There exists no match to a set week pattern, so use course's semester weeks
            defaultAvailabilityName = {
                'S1': 'First Semester Formal Award',
                'S2': 'Second Semester Formal Award',
                'SS': 'Summer Semester Formal Award',
                'Q1': 'First Quarter Formal Award',
                'Q2': 'Second Quarter Formal Award',
                'Q3': 'Third Quarter Formal Award',
                'Q4': 'Fourth Quarter Formal Award'
            }[self.weeksOverlay.course().term()];
        }
        return defaultAvailabilityName
    });
    self.weeksOverlay.changeAvailability = function() {
        // Triggered the user clicks the "apply preset" button
        var namedAvailability = $('#weeksOverlayAvailabilitySelector').val();
        var weeks = '';
        if ('EDUFAC' === self.weeksOverlay.course().faculty()) {
            weeks = EDUFAC_AVAILABILITIES[self.weeksOverlay.course().term()][namedAvailability];
        } else {
            weeks = NAMED_AVAILABILITIES[self.weeksOverlay.course().term()][namedAvailability];
        }
        // Update the selected week cells accordingly
        for (var i = 0; i < 52; i++) {
            if (weeks[i] == '1') {
                selectWeek(jQuery('#weeks-overlay').
                    find('td#week'+(i+1)));
            } else {
                deselectWeek(jQuery('#weeks-overlay').
                    find('td#week'+(i+1)));
            }
            // Colour parents' missing weeks gray.
            if (self.weeksOverlay.parent() !== null && self.weeksOverlay.parent() !== undefined) {
                // parent is activity
                if (self.weeksOverlay.parent().weeks()[i] == '0') {
                    jQuery('#weeks-overlay').
                        find('td#week'+(i+1))
                        .addClass("parentunavailable");
                } else {
                    jQuery('#weeks-overlay').
                        find('td#week'+(i+1))
                        .removeClass("parentunavailable");
                }
            } else if (self.weeksOverlay.course().faculty() !== 'EDUFAC') {
                // parent is the course
                if (FORMAL_AWARDS[self.weeksOverlay.course().term()][i] === '0') {
                    jQuery('#weeks-overlay').
                        find('td#week'+(i+1))
                        .addClass("parentunavailable");
                } else {
                    jQuery('#weeks-overlay').
                        find('td#week'+(i+1))
                        .removeClass("parentunavailable");
                }
            } else {
                // Clear existing markup
                jQuery('#weeks-overlay').
                    find('td#week'+(i+1))
                    .removeClass("parentunavailable");
            }
        }
    }
    self.weeksOverlay.initialiseOverlay = function() {
        var weeks = this.value();

        for (var i = 0; i < 52; i++) {
            if (weeks[i] == '1') {
                selectWeek(jQuery('#weeks-overlay').
                    find('td#week'+(i+1)));
            } else {                
                deselectWeek(jQuery('#weeks-overlay').
                    find('td#week'+(i+1)));  
            }
            // Colour parents' missing weeks gray.
            if (this.parent() !== null && this.parent() !== undefined) {
                // parent is activity
                if (this.parent().weeks()[i] == '0') {
                    jQuery('#weeks-overlay').
                        find('td#week'+(i+1))
                        .addClass("parentunavailable");
                } else {
                    jQuery('#weeks-overlay').
                        find('td#week'+(i+1))
                        .removeClass("parentunavailable");
                }
            } else if (this.course().faculty() !== 'EDUFAC') {
                // parent is the course
                if (FORMAL_AWARDS[this.course().term()][i] === '0') {
                    jQuery('#weeks-overlay').
                        find('td#week'+(i+1))
                        .addClass("parentunavailable");
                } else {
                    jQuery('#weeks-overlay').
                        find('td#week'+(i+1))
                        .removeClass("parentunavailable");
                }
            } else {
                // Clear existing markup
                jQuery('#weeks-overlay').
                    find('td#week'+(i+1))
                    .removeClass("parentunavailable");
            }
        }
    }
    self.weeksOverlay.handleChanges = function() {
        // Get the selected weeks
        var weeks = '';
        for (var i = 0; i < 52; i++) {
            if (jQuery('#weeks-overlay').find("td#week"+(i+1)).hasClass("selectedweek")) {
                weeks += '1';
            } else {
                weeks += '0';
            }
        }
        this.origin(weeks);
        this.value(null);
    }

    // Staff overlay
    self.staffOverlay = new Overlay();
    // Create bindings
    self.staffOverlay.temporaryStaff = ko.observableArray([]);
    self.staffOverlay.highlightedAvailableStaff = ko.observableArray([]);
    self.staffOverlay.highlightedTemporaryStaff = ko.observableArray([]);
    self.staffOverlay.filterAvailableStaff = ko.observable('');
    self.staffOverlay.filterAvailableStaff.subscribe(function() {
        // Clear highlighting when filtering to avoid adding not-filtered staff
        self.staffOverlay.highlightedAvailableStaff([]);
    });
    self.staffOverlay.availableStaff = ko.computed(function() {
        var _self = self.staffOverlay;
        if (_self.course() === null) {
            return [];
        }
        var availableStaff = (typeof _self.course().department() !== 'undefined'
                && _self.course().department() !== '')
                ? ALL_STAFF[_self.course().department()].slice() : [];
        // Remove staff already selected
        for (var i = 0; i < _self.temporaryStaff().length; i++) {
            var ind = availableStaff.indexOf(_self.temporaryStaff()[i]);
            if (ind > -1) {
                availableStaff.splice(ind, 1);
            }
        }
        // Check if filter exists
        if (_self.filterAvailableStaff().length > 0) {
            // Apply filter
            for (var i = availableStaff.length-1; i >= 0; i--) {
                if (availableStaff[i].toLowerCase().indexOf(
                        _self.filterAvailableStaff().toLowerCase()) < 0) { // Does NOT contain filter
                    availableStaff.splice(i, 1);
                }
            }
        }
        return availableStaff;
    });
    //Initialise
    self.staffOverlay.initialiseOverlay = function() {
        var _self = self.staffOverlay;
        _self.temporaryStaff(self.staffOverlay.origin.slice().sort()); // Copy of actual staff
        _self.highlightedAvailableStaff([]);
        _self.highlightedTemporaryStaff([]);
        _self.filterAvailableStaff('');
    }
    self.staffOverlay.addStaff = function() { // Squirt right
        for (var i = 0; i < self.staffOverlay.highlightedAvailableStaff().length; i++) {
            self.staffOverlay.temporaryStaff.push(self.staffOverlay.highlightedAvailableStaff()[i]);
        }
        self.staffOverlay.highlightedAvailableStaff([]); // Clear highlights
        self.staffOverlay.temporaryStaff.sort();
    }
    self.staffOverlay.removeStaff = function() { // Squirt left
        for (var i = 0; i < self.staffOverlay.highlightedTemporaryStaff().length; i++) {
            var ind = self.staffOverlay.temporaryStaff.indexOf(
                self.staffOverlay.highlightedTemporaryStaff()[i]);
            if (ind > -1) {
                self.staffOverlay.temporaryStaff.splice(ind, 1);
            }
        }
        self.staffOverlay.highlightedTemporaryStaff([]); // Clear highlights
    }
    self.staffOverlay.handleChanges = function() {
        self.staffOverlay.origin(self.staffOverlay.temporaryStaff.slice());
        self.staffOverlay.filterAvailableStaff('');
    }
    self.staffOverlay.discard = function() {
        self.staffOverlay.filterAvailableStaff('');
    }

    // StaffVariant overlay
    self.staffVariantOverlay = new Overlay(); // For selecting a single staff member
    self.staffVariantOverlay.noStaff = false;
    self.staffVariantOverlay.initialiseOverlay = function() {
        if (self.staffVariantOverlay.value() === null) {
            self.staffVariantOverlay.noStaff = true;
        }
    }
    self.staffVariantOverlay.handleChanges = function() {
        if (self.staffVariantOverlay.noStaff === true) {
            self.staffVariantOverlay.origin(null);
        } else {
            self.staffVariantOverlay.origin(self.staffVariantOverlay.value());
        }
        self.staffVariantOverlay.noStaff = false; // Reset for next time
    }

    // Location overlay
    // This is more complicated, includes suitabilities, space type, requirement number, etc
    self.locationOverlay = new Overlay();
    // Create bindings
    self.locationOverlay.locationRequired = ko.observable(true);
    self.locationOverlay.locationRequired.subscribe(function(newVal) {
        if (self.locationOverlay.caller() !== null &&
            self.locationOverlay.caller() !== undefined) {
            if (newVal === false) {
                self.locationOverlay.locationRequirementNumber(0);
            } else if (parseInt(self.locationOverlay.locationRequirementNumber()) === 0) {
                self.locationOverlay.locationRequirementNumber(1);
            }
        }
    });
    self.locationOverlay.locationType = ko.observable('');
    self.locationOverlay.temporarySuitabilities = ko.observableArray([]);
    self.locationOverlay.highlightedAvailableSuitabilities = ko.observableArray([]);
    self.locationOverlay.highlightedTemporarySuitabilities = ko.observableArray([]);
    self.locationOverlay.filterAvailableSuitabilities = ko.observable('');
    self.locationOverlay.filterAvailableSuitabilities.subscribe(function() {
        // Clear highlighting when filtering to avoid adding not-filtered suitabilities
        self.locationOverlay.highlightedAvailableSuitabilities([]);
    });
    self.locationOverlay.availableSuitabilities = ko.computed(function() {
        var _self = self.locationOverlay;
        if (_self.course() === null || _self.course() === undefined) {
            return [ ];
        }
        var availableSuitabilities = (_self.course().faculty() === undefined
                || _self.course().faculty() === null) ? 
            [] :  // Now to join faculty's suitabilities to the restricted list
            SUITABILITIES_BY_FACULTY[_self.course().faculty()].concat(RESTRICTED_SUITABILITIES);
        // Remove suitabilities currently allocated (_self.temporarySuitabilities())
        for (var i = 0; i < _self.temporarySuitabilities().length; i++) {
            var ind = availableSuitabilities.indexOf(_self.temporarySuitabilities()[i]);
            if (ind > -1) {
                availableSuitabilities.splice(ind, 1);
            }
        }
        // Check if filter is set
        if (_self.filterAvailableSuitabilities().length > 0) {
            // Apply filter
            for (var i = availableSuitabilities.length-1; i >= 0; i --) {
                if (availableSuitabilities[i].toLowerCase().indexOf(
                        _self.filterAvailableSuitabilities().toLowerCase()) < 0) { //
                    availableSuitabilities.splice(i, 1);
                }
            }
        }
        return availableSuitabilities.sort();
    });
    self.locationOverlay.locationRequirementNumber = ko.observable(0);
    self.locationOverlay.locationRequirementNumber.subscribe(function(newVal) {
        if (self.locationOverlay.caller() !== null &&
            self.locationOverlay.caller() !== undefined) {
            if (parseInt(newVal) === 0) {
                self.locationOverlay.locationRequired(false);
            } else {
                self.locationOverlay.locationRequired(true);
            }
        }
    });
    self.locationOverlay.locationFreeText = ko.observable('');

    self.locationOverlay.initialiseOverlay = function() {
        var _self = self.locationOverlay;
        if (_self.caller() !== null && _self.caller() !== undefined) {
            _self.locationRequired(_self.caller().locationRequirementNumber() !== 0);
            _self.temporarySuitabilities(_self.caller().locationSuitabilities().slice().sort());
            _self.locationType('');
            _self.locationRequirementNumber(_self.caller().locationRequirementNumber());
            for (var i = 0; i < LOCATION_TYPES.length; i++) {
                var ind = _self.temporarySuitabilities.indexOf(LOCATION_TYPES[i]);
                if (ind > -1) {
                    _self.temporarySuitabilities.splice(ind, 1);
                    _self.locationType(LOCATION_TYPES[i]);
                }
            }
            if (_self.locationType() === '') {
                _self.locationType('LT-Specialist Space');
            }
            _self.highlightedAvailableSuitabilities([]);
            _self.highlightedTemporarySuitabilities([]);
            _self.filterAvailableSuitabilities('');
            _self.locationFreeText(_self.caller().locationFreeText());
                // Textareas don't do 2-way bindings in KnockOut
        } /*// Why *would* caller() be undefined or null?
        else {
            console.log("Initialising with no caller");
        }*/
    }
    self.locationOverlay.addSuitabilities = function() {
        for (var i = 0; i < self.locationOverlay.highlightedAvailableSuitabilities().length; i++) {
            self.locationOverlay.temporarySuitabilities.push(
                self.locationOverlay.highlightedAvailableSuitabilities()[i]);
        }
        self.locationOverlay.highlightedAvailableSuitabilities([]);
        self.locationOverlay.temporarySuitabilities.sort();
    }
    self.locationOverlay.removeSuitabilities = function() {
        for (var i = 0; i < self.locationOverlay.highlightedTemporarySuitabilities().length; i++) {
            var ind = self.locationOverlay.temporarySuitabilities.indexOf(
                self.locationOverlay.highlightedTemporarySuitabilities()[i]);
            if (ind > -1) {
                self.locationOverlay.temporarySuitabilities.splice(ind, 1);
            }
        }
        self.locationOverlay.highlightedTemporarySuitabilities([]);
    }
    self.locationOverlay.handleChanges = function() {
        var _self = self.locationOverlay;
        if (_self.locationType() !== 'LT-Specialist Space') {
            // Since Specialist Space is not actually a suitability
            _self.temporarySuitabilities.push(_self.locationType());
        }
        _self.caller().locationSuitabilities(_self.temporarySuitabilities.slice());
        _self.caller().locationRequirementNumber(_self.locationRequirementNumber());
        _self.caller().locationFreeText(_self.locationFreeText());
        _self.filterAvailableSuitabilities('');
    }
    self.locationOverlay.discard = function() {
        self.locationOverlay.filterAvailableSuitabilities('');
    }

    // Sequencing overlay
    self.sequencingOverlay = new Overlay(); // For selecting a single staff member
    self.sequencingOverlay.sequencingSelection = ko.observableArray([]);
    self.sequencingOverlay.sequencingSelection.subscribe(function(newValue) {
        console.log(newValue);
    })
    self.sequencingOverlay.sequencingFreeText = ko.observable('');

    self.sequencingOverlay.initialiseOverlay = function() {
        var _self = self.sequencingOverlay;
        if (_self.caller() !== null && _self.caller() !== undefined) {
            _self.sequencingSelection(_self.caller().sequencingSelection.slice());
            _self.sequencingFreeText(_self.caller().sequencingFreeText());
        } else {
        // Problem! Should probably be an assert statement there
       }
    }
    self.sequencingOverlay.handleChanges = function() {
        var _self = self.sequencingOverlay;
        if (_self.sequencingSelection().length > 0) {
            _self.caller().sequencingSelection(_self.sequencingSelection.slice());
        } else {
            _self.caller().sequencingSelection([]);
        }
        _self.caller().sequencingFreeText(_self.sequencingFreeText());
    }

    // Initialise data

    // Check parameters
    /* Because status is currently set to 'initialising', AJAX call won't be triggered */
    var parameters = $.url().fparam();
    for (var field in parameters) {
        try {
            var val = decodeURIComponent(parameters[field]);
            if (field === '') {
                // Do nothing
            } else if (field === 'pageSize') {
                self.pageSize(parseInt(val));
            } else if (field === 'currentPage') {
                self.currentPage(parseInt(val));
            } else if (field in self.filters) {
                self.filters[field](val);
            }
        }
        catch (err) {} // Probably unable to parse the field name
    }

    self.status('loading');
    getData(self);
} // End of CourseInformationViewModel

function getData(self) {
    // This will overwrite existing data!
    // Need to check that all changes have been written back first!
    if (self.status() !== 'initialising') {    
        location.hash = self.getParameterString();

        // Delete existing data
        self.courses([ ]);
        self.status('loading');

        // Because online version
        var response = dummy_data;
        self.status('ready');
        // Populate courses
        var serverCourses = response.courses;
        // Trying a faster approach
        var mappedData = $.map(serverCourses, function(item) {
            return new Course(
                self.changeLog,
                item,
                false // isNew?
            )
        });
        self.courses(mappedData);
        self.rowCount(response.rowCount);

        if (self.currentPage() > self.pageCount()) {
            // Prevents cases where no courses show up
            self.currentPage(self.pageCount());
        }

        // Populate filters
        self.filterOptions = response.filterOptions;
        for (var i in self.filterOptions)
            self.filterOptions[i] = ko.observable(self.filterOptions[i]);

        /*
        $.ajax({
            url: HANDLER_URL,
            data: {
                page_size: self.pageSize(),
                page_number: self.currentPage(),
                filters: encodeURIComponent(ko.toJSON(self.filters)) // URI-encoded
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            dataType: 'jsonp',
            success: function(response) {
                self.status('ready');
                // Populate courses
                var serverCourses = response.courses;
                // Trying a faster approach
                var mappedData = $.map(serverCourses, function(item) {
                    return new Course(
                        self.changeLog,
                        item,
                        false // isNew?
                    )
                });
                self.courses(mappedData);
                self.rowCount(response.rowCount);

                if (self.currentPage() > self.pageCount()) {
                    // Prevents cases where no courses show up
                    self.currentPage(self.pageCount());
                }

                // Populate filters
                self.filterOptions = response.filterOptions;
                for (var i in self.filterOptions)
                    self.filterOptions[i] = ko.observable(self.filterOptions[i]);
            },
            error: function(e) {
                self.status('error');
console.error('Problem reading courses from handler');
            }
        }); */
    }
}

var viewModel = new CourseInformationViewModel();

ko.applyBindings(viewModel);


function locationHashChanged() {
    // Need to find a way to ignore changes to the hash made by the mvvm
    // while acknowledging changes made by the user
    /*console.log("New location hash: "+location.hash+', status:'+viewModel.status());*/
}

if ("onhashchange" in window) {
    window.onhashchange = locationHashChanged;
} else {
    // uh oh!
    alert("Your browser is not supported by this page."+
        "Please contact timetable@auckland.ac.nz for assistance.");
}
window.onbeforeunload = function() {
    return viewModel.unsentChanges() ?
        'You have saved changes that have not been sent to the server!' : null;
}