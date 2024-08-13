// for using with actions that have multiple intents

export interface IntentActionArgs {
	request?: Request
	userId: string
	formData: FormData
}

interface IResponse {
	success: boolean
	message?: string
}
export interface IClonedResponse extends IResponse {}
export interface ICreatedResponse extends IResponse {}
export interface IUpdatedResponse extends IResponse {}
export interface IDeletedResponse extends IResponse {}
