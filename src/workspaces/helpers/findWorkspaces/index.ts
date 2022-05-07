import { User } from '@users/schemas/User'
import { UserModel, WorkspaceModel } from '@root/models'

export interface workspacesQuery {
  name?: string
  code?: 'BASH' | 'JAVASCRIPT' | 'PYTHON'
  self?: string
  owner?: string
}

export const findWorkspaces = async (query: workspacesQuery, current: User) => {
  const __owner = UserModel.matchedFullname(query.owner)

  let workspaces = WorkspaceModel.find({
    $or: [{ contributors: current._id }, { author: current._id }],
  })

  if (query.code) {
    workspaces = workspaces.find({
      code: { $regex: query.code, $options: 'i' },
    })
  }

  if (query.name) {
    workspaces = workspaces.find({
      name: { $regex: query.name, $options: 'i' },
    })
  }

  const owners = await __owner
  if (owners) {
    workspaces = workspaces.find({ author: { $in: owners } })
  }

  if (query.self === 'true') {
    workspaces = workspaces.find({ author: current._id })
  }

  return workspaces.transform((workspaces) => workspaces.map((workspace) => workspace.public))
}
