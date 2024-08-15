import {
	type IDesignUpdateParams,
	type IDesignUpdateSubmission,
} from '../definitions.update'
import {
	type IDesignAttributesFill,
	type IDesignFillBasis,
	type IDesignFillStyle,
} from './definitions'

export interface IDesignFillUpdateBasisSubmission
	extends IDesignUpdateSubmission {
	basis: IDesignFillBasis
}

export interface IDesignFillUpdateStyleSubmission
	extends IDesignUpdateSubmission {
	style: IDesignFillStyle
}

export interface IDesignFillUpdateValueSubmission
	extends IDesignUpdateSubmission {
	value: string
}

export interface IDesignFillUpdateAttributesData {
	attributes: IDesignAttributesFill
}

export interface IDesignFillUpdateParams extends IDesignUpdateParams {
	data: IDesignFillUpdateAttributesData
}
