import { getModelForClass } from '@typegoose/typegoose'

import { User, Role } from '@users/schemas'
import { Invitation, Workspace } from '@workspaces/schemas'
import { Editor } from '@editor/schemas'

export const UserModel = getModelForClass(User)
export const RoleModel = getModelForClass(Role)
export const WorkspaceModel = getModelForClass(Workspace)
export const InvitationModel = getModelForClass(Invitation)
export const EditorModel = getModelForClass(Editor)
