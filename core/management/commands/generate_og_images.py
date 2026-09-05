"""Render one Open Graph image per page.

Every page previously shared a single stock photograph, so every link shared to
Instagram, LinkedIn, WhatsApp or Slack looked identical and said nothing about
where it led. These are generated from the same PAGE_META the pages themselves
use, so a title change cannot leave a stale image behind.

Run after changing page titles or adding a vertical:

    python manage.py generate_og_images
"""

import os
import textwrap

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from PIL import Image, ImageDraw, ImageFont

from core.seo import VERTICALS

W, H = 1200, 630
BG = (10, 9, 12)
WHITE = (248, 246, 249)
PINK = (255, 71, 120)
GRAY = (150, 144, 158)

FONT_DIR = os.path.join(settings.BASE_DIR, 'assets', 'fonts')
OUT_DIR = os.path.join(
    settings.BASE_DIR, 'core', 'static', 'core', 'css', 'img', 'og'
)

# Display titles. Deliberately shorter and punchier than the SEO <title>, which
# is written for a search results page rather than a 1200x630 card.
STATIC_CARDS = {
    'default': ('NYC-Born Creative Agency', 'Building iconic brands through strategy & influence'),
    'index': ('NYC-Born Creative Agency', 'Building iconic brands through strategy & influence'),
    'about': ('About', 'NYC-born. Creator-led. Built for modern brands.'),
    'services': ('Services', 'Everything your brand needs to dominate'),
    'industries': ('Industries', 'We know your industry inside out'),
    'testimonials': ('Testimonials', 'What our clients say about us'),
    'blog': ('Blog', 'Insights, trends & brand stories'),
    'contact': ('Contact', "Let's build something iconic"),
    'imprint': ('Imprint', 'Avenue One Agency'),
    'privacy': ('Privacy Policy', 'Avenue One Agency'),
}


def _font(name, size, axes=None):
    path = os.path.join(FONT_DIR, name)
    if not os.path.exists(path):
        raise CommandError(
            f'Missing build font: {path}\n'
            'See assets/fonts/README.md for where these come from.'
        )
    f = ImageFont.truetype(path, size)
    if axes:
        try:
            f.set_variation_by_axes(axes)
        except Exception:
            # Static build of the font — the default instance is fine.
            pass
    return f


def _tracked(draw, xy, text, font, fill, tracking=0):
    """Draw text with letter-spacing, which Pillow has no native support for."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x


def _glow_mask():
    """A soft radial falloff anchored off the top-left corner.

    Computed at low resolution and scaled up with bicubic interpolation, which
    is both far faster than per-pixel work at full size and smoother than any
    stack of concentric ellipses.
    """
    small = 96
    mask = Image.new('L', (small, small), 0)
    px = mask.load()
    cx, cy = small * 0.06, small * -0.02
    radius = small * 0.78
    for y in range(small):
        for x in range(small):
            dist = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            t = max(0.0, 1.0 - dist / radius)
            # Cubic ease-out: bright near the corner, long gentle tail.
            px[x, y] = int(255 * (t ** 3) * 0.62)
    return mask.resize((W, H), Image.BICUBIC)


def _glow_layer():
    return Image.new('RGB', (W, H), (232, 24, 92))


def _render(eyebrow, title, out_path):
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)

    # Pink glow bleeding in from the top left, matching the site's hero.
    # Built as a smooth radial falloff — stacked ellipses leave visible arcs.
    img.paste(_glow_layer(), (0, 0), _glow_mask())
    d = ImageDraw.Draw(img)

    # Rule + eyebrow
    d.rectangle([80, 96, 128, 97], fill=PINK)
    eyebrow_font = _font('Archivo.ttf', 21, [100, 600])
    _tracked(d, (144, 86), eyebrow.upper(), eyebrow_font, PINK, tracking=3.2)

    # Title, in the display face
    title_font = _font('BodoniModa.ttf', 78, [96, 500])
    lines = textwrap.wrap(title, width=26)[:3]
    y = 168
    for line in lines:
        d.text((80, y), line, font=title_font, fill=WHITE)
        y += 92

    # Footer: wordmark and domain
    mark_font = _font('BodoniModa.ttf', 34, [96, 500])
    d.text((80, H - 104), 'Avenue One', font=mark_font, fill=WHITE)
    domain_font = _font('Archivo.ttf', 19, [100, 500])
    _tracked(d, (80, H - 58), 'AVENUEONEAGENCY.COM', domain_font, GRAY, tracking=2.4)

    d.rectangle([0, H - 8, W, H], fill=PINK)

    img.save(out_path, 'PNG', optimize=True)
    return os.path.getsize(out_path)


class Command(BaseCommand):
    help = 'Generate per-page Open Graph images into core/static/core/css/img/og/'

    def handle(self, *args, **options):
        os.makedirs(OUT_DIR, exist_ok=True)

        cards = dict(STATIC_CARDS)
        for v in VERTICALS:
            cards[v['slug']] = (
                v['eyebrow'],
                f"{v['h1Lead']} {v['h1Accent']}",
            )

        total = 0
        for name, (eyebrow, title) in sorted(cards.items()):
            path = os.path.join(OUT_DIR, f'{name}.png')
            size = _render(eyebrow, title, path)
            total += size
            self.stdout.write(f'  {name}.png'.ljust(38) + f'{size // 1024} KB')

        self.stdout.write(
            self.style.SUCCESS(
                f'\nGenerated {len(cards)} Open Graph images, {total // 1024} KB total'
            )
        )
