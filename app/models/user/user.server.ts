import { type User } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'
import { prisma } from '#app/utils/db.server'

// Omitting 'createdAt' and 'updatedAt' from the User interface
// prisma query returns a string for these fields
type BaseUser = Omit<User, 'createdAt' | 'updatedAt'>

export interface IUser extends BaseUser {
	createdAt: DateOrString
	updatedAt: DateOrString
}

export interface IUserBasic {
	id: string
	username: string
	name: string | null
	image: { id: string | null }
}

export const getRootUser = ({ id }: { id: IUser['id'] }) => {
	return prisma.user.findUniqueOrThrow({
		select: {
			id: true,
			name: true,
			username: true,
			image: { select: { id: true } },
			roles: {
				select: {
					name: true,
					permissions: {
						select: { entity: true, action: true, access: true },
					},
				},
			},
		},
		where: { id },
	})
}
