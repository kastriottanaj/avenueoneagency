import logging

from django.conf import settings
from django.core.mail import EmailMessage
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContactMessage, NewsletterSubscriber

logger = logging.getLogger(__name__)

MAX_NAME = 100
MAX_EMAIL = 254
MAX_PHONE = 30
MAX_MESSAGE = 5000


def _clean_email(value):
    value = (value or '').strip()[:MAX_EMAIL]
    try:
        validate_email(value)
    except ValidationError:
        return None
    return value


def _is_bot(request):
    """Hidden honeypot field. A real browser leaves it empty; bots fill everything."""
    return bool((request.data.get('website') or '').strip())


class ContactView(APIView):
    throttle_scope = 'contact'

    def post(self, request):
        if _is_bot(request):
            # Behave exactly like success so the bot has no signal to adapt to.
            logger.info('Contact honeypot triggered')
            return Response({'success': True})

        name = (request.data.get('name') or '').strip()[:MAX_NAME]
        phone = (request.data.get('phone') or '').strip()[:MAX_PHONE]
        message = (request.data.get('message') or '').strip()[:MAX_MESSAGE]
        email = _clean_email(request.data.get('email'))

        if not name or not message:
            return Response({'error': 'Name and message are required.'}, status=400)
        if not email:
            return Response({'error': 'Enter a valid email address.'}, status=400)

        ContactMessage.objects.create(
            name=name, email=email, phone=phone, message=message
        )

        body = message
        if phone:
            body = f'Phone: {phone}\n\n{message}'
        body = f'From: {name} <{email}>\n{body}'

        try:
            EmailMessage(
                subject=f'New contact request from {name}',
                body=body,
                # Send FROM our own authenticated address, not the visitor's.
                # Using the visitor's address as the sender fails SPF/DMARC
                # alignment for their domain and gets the mail spam-filtered.
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.CONTACT_RECEIVER_EMAIL],
                reply_to=[email],
            ).send(fail_silently=False)
        except Exception:
            # The lead is already persisted, so the visitor is told the truth.
            # Previously this was `except Exception: pass`, which meant a broken
            # mailbox silently swallowed every notification with no trace.
            logger.exception('Contact notification email failed for %s', email)

        return Response({'success': True})


class NewsletterView(APIView):
    throttle_scope = 'newsletter'

    def post(self, request):
        if _is_bot(request):
            logger.info('Newsletter honeypot triggered')
            return Response({'success': True})

        email = _clean_email(request.data.get('email'))
        if not email:
            return Response({'error': 'Enter a valid email address.'}, status=400)

        _, created = NewsletterSubscriber.objects.get_or_create(email=email)

        if created:
            try:
                EmailMessage(
                    subject='Successfully subscribed to the newsletter',
                    body='Thank you for subscribing to our newsletter!',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[email],
                ).send(fail_silently=False)
            except Exception:
                logger.exception('Newsletter confirmation email failed for %s', email)

        return Response({'success': True})
