from celery import shared_task

from .utils import send_mail_user


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 5},
)
def send_mail_async(self, subject, template, message_context, to):
    return send_mail_user(subject, template, message_context, to)
