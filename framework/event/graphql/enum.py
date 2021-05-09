import graphene


class EventManagerPermissionsEnum(graphene.Enum):
    CAN_JUDGE_PARTICIPANTS = 'CAN_JUDGE_PARTICIPANTS'


__all__ = [
    'EventManagerPermissionsEnum'
]
