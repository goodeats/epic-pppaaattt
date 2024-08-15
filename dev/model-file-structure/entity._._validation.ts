import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IUser } from '#app/models/user/user.server.js'
import { type IValidateSubmissionStrategy } from '#app/strategies/validate-submission.strategy.js'
import {
	addNotFoundIssue,
	validateEntitySubmission,
} from '#app/utils/conform-utils'
import { getExampleEntity } from './entity._.get.db.server'
import { type CloneExampleEntityExampleChildSchema } from './entity.child.clone.schema'

type ExampleEntityParentSchema = typeof CloneExampleEntityExampleChildSchema

export class ValidateExampleEntityParentSubmissionStrategy
	implements IValidateSubmissionStrategy
{
	async validateFormDataEntity({
		userId,
		data,
		ctx,
	}: {
		userId: IUser['id']
		data: any
		ctx: any
	}): Promise<void> {
		const { branchId } = data
		const exampleEntity = await getExampleEntity({
			where: { id: branchId, ownerId: userId },
		})
		if (!exampleEntity) ctx.addIssue(addNotFoundIssue('ExampleEntity'))
	}
}

export const validateExampleEntityParentSubmission = async (
	{ userId, formData }: IntentActionArgs,
	schema: ExampleEntityParentSchema,
) => {
	const strategy = new ValidateExampleEntityParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
}
