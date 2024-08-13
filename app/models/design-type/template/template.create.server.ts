import { type IDesign } from '#app/models/design/definitions'
import { IDesignTypeCreateOverrides } from '#app/models/design/definitions.create'
import { TemplateDataSchema } from '#app/schema/template'
import { prisma } from '#app/utils/db.server'

export interface ITemplateCreateOverrides {
	style?: string
}

export const createDesignTemplate = ({
	designId,
	designTypeOverrides,
}: {
	designId: IDesign['id']
	designTypeOverrides: IDesignTypeCreateOverrides
}) => {
	const templateData = {
		designId,
		...(designTypeOverrides as ITemplateCreateOverrides),
	}
	const data = TemplateDataSchema.parse(templateData)

	return prisma.template.create({ data })
}
