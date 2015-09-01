

export class DIError implements Error {
	name: string
	message:string
	constructor(message:string) {
		this.message = message;
	}
	
	toString (): string {
		return `[${this.name}: ${this.message}]` 
	}
}

export class DIAggregateError extends DIError {
	errors:Error[]
	constructor(message:string, errors:Error[]) {
		super(message);
		this.errors = errors;
	}
	
	toString (): string {
		return `[${this.name}: ${this.message}], errors:${this.errors}` 
	}
}

export function createError(name:string, message:string, errors?:Error[]): Error {
	let e;
	if (errors) {
		e = new DIAggregateError(message, errors);
	} else {
		e = new DIError(message);	
	}
	e.name = name;
	return e;
}