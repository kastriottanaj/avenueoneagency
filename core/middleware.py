from django.conf import settings
from django.http import HttpResponsePermanentRedirect


class CanonicalHostMiddleware:
    """Redirect every non-canonical hostname to CANONICAL_HOST with a 301.

    Both avenueoneagency.com and www.avenueoneagency.com previously served the
    full site with a 200 and no canonical link, which splits ranking signals,
    backlinks and analytics across two hostnames. nginx lists both in one
    server_name, so the redirect is done here to keep it independent of the
    deployment target.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.canonical_host = getattr(settings, 'CANONICAL_HOST', '') or ''

    def __call__(self, request):
        host = request.get_host().split(':')[0].lower()

        if (
            self.canonical_host
            and host != self.canonical_host
            and host.endswith('.' + self.canonical_host)
        ):
            scheme = 'https' if request.is_secure() else 'http'
            return HttpResponsePermanentRedirect(
                f'{scheme}://{self.canonical_host}{request.get_full_path()}'
            )

        return self.get_response(request)
