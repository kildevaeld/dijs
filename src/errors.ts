
export class DIError extends Error {
	name: string
	message: string
	constructor(message?:string) {
		super(message);
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

	/*toString (): string {
		return `[${this.name}: ${this.message}], errors:${this.errors}`
	}*/
	
	toString (): string {
		
		let errors = this.errors;
		let error: Error;
		while (errors.length > 0) {
			error = errors[errors.length - 1];
			errors = (<any>error).errors||[];
		}
		
		if (error == null) {
			return `[${this.name}: ${this.message}]`;	
		} else {
			return String.prototype.toString.call(error);
		}
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