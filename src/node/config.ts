export type Setting<T> = {
	get: () => T
	set: (val: T) => T
}

export const Version: Setting<string> = (() => {
	let v = "v0.0.1"
	return {
		get: () => v,
		set: (val: string) => {
			v = val
			return v
		}
	}
})()

export const NetworkID: Setting<string> = (() => {
	let v = "mitum"
	return {
		get: () => v,
		set: (val: string) => {
			v = val
			return v
		}
	}
})()

export type RangeConfig = {
	value?: number
	min: number
	max: number
	satisfy: (target: number) => boolean
}

const getRangeConfig = (min: number, max?: number): RangeConfig => {
	return {
		value: min == (max ?? min) ? min : undefined,
		min,
		max: max ?? min,
		satisfy: (target: number) => min <= target && target <= (max ?? min),
	}
}

export const Config = {
	SUFFIX: {
		DEFAULT: getRangeConfig(3),
		ZERO_ADDRESS: getRangeConfig(5)
	},
	CURRENCY_ID: getRangeConfig(3, 10),
	CONTRACT_ID: getRangeConfig(3, 10),
	SEED: getRangeConfig(36, Number.MAX_SAFE_INTEGER),
	THRESHOLD: getRangeConfig(1, 100),
	WEIGHT: getRangeConfig(1, 100),
	ADDRESS: {
		DEFAULT: getRangeConfig(43, 47),
		ZERO: getRangeConfig(8, 15),
		NODE: getRangeConfig(4, Number.MAX_SAFE_INTEGER),
	},
	KEYS_IN_ACCOUNT: getRangeConfig(1, 100),
	AMOUNTS_IN_ITEM: getRangeConfig(1, 10),
	ITEMS_IN_FACT: getRangeConfig(1, 100),
	OPERATIONS_IN_SEAL: getRangeConfig(1, 10),
	KEY: {
		MITUM: {
			PRIVATE: getRangeConfig(46, 48),
			PUBLIC: getRangeConfig(46, 48),
		},
		ETHER: {
			PRIVATE: getRangeConfig(67),
			PUBLIC: getRangeConfig(69),
		}
	},
	NFT: {
		ROYALTY: getRangeConfig(0, 99),
		SHARE: getRangeConfig(0, 100),
		ADDRESS_IN_WHITELIST: getRangeConfig(0, 10),
		SIGNERS_IN_SIGNERS: getRangeConfig(0, 10),
	},
	CREDENTIAL: {
		ID: getRangeConfig(1, 20),
		VALUE: getRangeConfig(1, 1024),
		TEMPLATE_ID: getRangeConfig(1, 20),
		TEMPLATE_NAME: getRangeConfig(1, 20),
		DISPLAY_NAME: getRangeConfig(1, 20),
		SUBJECT_KEY: getRangeConfig(1, 20),
		DESCRIPTION: getRangeConfig(1, 1024),
	},
	TIMESTAMP: {
		PROJECT_ID: getRangeConfig(1, 10),
		DATA: getRangeConfig(1, 1024),
	},
	STO: {
		PARTITION: getRangeConfig(3, 10),
	},
	DAO: {
		ADDRESS_IN_WHITELIST: getRangeConfig(0, 10),
		QUORUM: getRangeConfig(0, 100),
		VOTE: getRangeConfig(0, 255),
	}
}