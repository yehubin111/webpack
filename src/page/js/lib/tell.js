export default class fundname {
    constructor() {
    	this.x = 0;
    	this.y = 0;
    }

    set prop([x, ...y]) {
    	this.x = x;
    	this.y = y;
    }

    init() {
    	console.log(this.x + '_' + this.y);
    }

    getter() {
    	console.log(this.x);
    }
}
