import graphene


class TeamProfile(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()
    leader = graphene.Field('user.graphql.types.UserProfile')
    members = graphene.List('user.graphql.types.UserProfile')

    def resolve_members(self, info):
        return self.members.all()


class MyTeamProfile(TeamProfile, graphene.ObjectType):
    inviteCode = graphene.String()


__all__ = [
    'TeamProfile',
    'MyTeamProfile'
]
