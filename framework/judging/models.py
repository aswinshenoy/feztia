from django.db import models

from event.models import Participant
from user.models import User


class ParticipantJudgement(models.Model):
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    judge = models.ForeignKey(User, on_delete=models.PROTECT, related_name='judge')
    timestamp = models.DateTimeField(auto_now=True)
    points = models.PositiveSmallIntegerField()

    class Meta:
        unique_together = [
            ('judge', 'participant')
        ]
        db_table = 'participant_judgement'
        verbose_name_plural = "Participant Judgements"
        verbose_name = "Participant Judgement"

    def __str__(self):
        return str(self.participant) + ' by ' + self.judge.username


__all__ = [
    'ParticipantJudgement'
]
