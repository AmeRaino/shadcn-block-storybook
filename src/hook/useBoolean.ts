import { useCallback, useState } from 'react'

import type { Dispatch, SetStateAction } from 'react'

type TUseBooleanReturn = {
	value: boolean
	setValue: Dispatch<SetStateAction<boolean>>
	setTrue: () => void
	setFalse: () => void
	toggle: () => void
}

export function useBoolean(defaultValue: boolean = false): TUseBooleanReturn {
	const [value, setValue] = useState(defaultValue)

	const setTrue = useCallback(() => {
		setValue(true)
	}, [])

	const setFalse = useCallback(() => {
		setValue(false)
	}, [])

	const toggle = useCallback(() => {
		setValue((x) => !x)
	}, [])

	return { value, setValue, setTrue, setFalse, toggle }
}
