import { type DesignTypeEnum } from '#app/models/design/definitions'
import { type IDesignCreateData } from '../definitions.create'
import { type IDesignAttributesFill } from './definitions'

export interface IDesignFillCreateData extends IDesignCreateData {
	type: typeof DesignTypeEnum.FILL
	attributes: IDesignAttributesFill
}
