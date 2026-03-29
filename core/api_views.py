from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactMessage, NewsletterSubscriber


class ContactView(APIView):
    def post(self, request):
        name = request.data.get('name', '').strip()
        email = request.data.get('email', '').strip()
        message = request.data.get('message', '').strip()

        if not all([name, email, message]):
            return Response({'error': 'All fields are required.'}, status=400)

        ContactMessage.objects.create(name=name, email=email, message=message)

        try:
            send_mail(
                subject=f"New contact request from {name}",
                message=message,
                from_email=email,
                recipient_list=[settings.CONTACT_RECEIVER_EMAIL],
                fail_silently=False,
            )
        except Exception:
            pass

        return Response({'success': True})


class NewsletterView(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip()

        if not email:
            return Response({'error': 'Email is required.'}, status=400)

        if not NewsletterSubscriber.objects.filter(email=email).exists():
            NewsletterSubscriber.objects.create(email=email)
            try:
                send_mail(
                    subject="Successfully subscribed to the newsletter",
                    message="Thank you for subscribing to our newsletter!",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[email],
                    fail_silently=True,
                )
            except Exception:
                pass

        return Response({'success': True})
