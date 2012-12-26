// Encapsulate workspace-specific state to allow one block to build on the next
// Also provide a runtime environment for the block script

function Local(){
    this.shape = null;
    this.shape_references = {};
    this.array_references = {};
    this.object_references = {};
    this.function_references = {};
    this.regex_references = {};
    this.string_references = {};
    this.last_var = null;
    this.variables = {};
};

Local.prototype.set = function(type, name, value){
    if (this[type] === undefined){
        this[type] = {};
    }
    if (this[type][name] !== undefined){
        console.warn('Overwriting %s named %s', type, name);
    }
    this[type][name] = value;
    this.last_var = value;
    return this;
};

Local.prototype.get = function(type, name){
    if (this[type] === undefined){
        console.error('Cannot remove %s from unknown type %s', name, type);
        return undefined;
    }
    if (this[type][name] === undefined){
        console.error('No %s named %s to remove', type, name);
        return undefined;
    }
    return this[type][name];
};

Local.prototype.delete = function(type, name){
    if (this[type] === undefined){
        console.error('Cannot remove %s from unknown type %s', name, type);
        return undefined;
    }
    if (this[type][name] === undefined){
        console.error('No %s named %s to remove', type, name);
        return undefined;
    }
    var value = this[type][name];
    delete this[type][name];
    return value;
};

function Global(){
    this.timer = new Timer();
    this.subscribeMouseEvents();
    this.subscribeKeyboardEvents();
    this.keys = {};
    this.stage = document.getElementsByClassName('.stage')[0];
    this.mouse_x = -1;
    this.mouse_y = -1;
    this.stage_width = this.stage.clientWidth;
    this.stage_height = this.stage.clientHeight;
    this.stage_center_x = this.stage_width / 2;
    this.stage_center_y = this.stage_height / 2;
    this.mouse_down = false;
};

Global.prototype.subscribeMouseEvents = function(){
    var self = this;
    this.stage.addEventListener('mousedown', function(evt){
		self.mouse_down = true;
	});
    this.stage.addEventListener('mousemove', function(evt){
		self.mouse_x = evt.offsetX;
        self.mouse_y = evt.offsetY;
	});
    $(document.body).mouseup(function(evt){
		self.mouse_down = false;
	});
};

Global.prototype.specialKeys = {
	// taken from jQuery Hotkeys Plugin
	8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
	20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
	37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
	96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
	104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
	112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
	120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
};
	
Global.prototype.shiftNums = {
	// taken from jQuery Hotkeys Plugin
	"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
	"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
	".": ">",  "/": "?",  "\\": "|"
}


Global.prototype.keyForEvent = function(evt){
    if (this.specialKeys[evt.keyCode]){
        return this.specialKeys[evt.keyCode];
    }else{
        return String.fromCharCode( evt.which ).toLowerCase();
    }
}

Global.prototype.isKeyDown = function(key){
    return this.keys[key];
}

Global.prototype.subscribeKeyboardEvents = function(){
    var self = this;
    document.body.addEventListener('keydown', function(evt){
        self.keys[self.keyForEvent(evt)] = true;
    });
	document.body.addEventListener('keyup', function(evt){
        self.keys[self.keyForEvent(evt)] = false;
    });
};


