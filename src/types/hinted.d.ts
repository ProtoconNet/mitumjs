export type HintedObject = {
	_hint?: string,
	[i: string]: any
}

export type HintedExtensionObject = {
	authentication: HintedObject,
	proxy_payer?: HintedObject,
	settlement: HintedObject
}