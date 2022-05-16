import { User } from '@users/schemas'
import { Workspace } from '@workspaces/schemas'
import { UserModel } from '@root/models'
import { PaginationQuery } from '@common/types'

interface Props {
  user: User
  workspace: Workspace
  query: string
  pagination: PaginationQuery
}

export const findUsersToInvite = async (props: Props) => {
  const { query, pagination, user, workspace } = props

  const matchedUsers = await UserModel.matchedFullname(query)
  const users = await UserModel.findPagination(
    {
      $and: [
        // without author of workspace
        {
          _id: {
            $not: {
              $eq: user._id,
            },
          },
        },
        // without contributors of the workspace
        {
          _id: {
            $nin: workspace.contributors,
          },
        },
        // if query check by email and fullname
        query
          ? {
              $or: [
                {
                  _id: {
                    $in: matchedUsers,
                  },
                },
                {
                  email: new RegExp(query, 'i'),
                },
              ],
            }
          : {},
      ],
    },
    pagination
  )

  return users
}

export default findUsersToInvite
