from django.test import TestCase

from .models import BlogPost


class HospitalityEditorialSeedTests(TestCase):
    expected_slugs = {
        'hotel-social-media-strategy-direct-bookings',
        'restaurant-opening-marketing-plan-nyc',
        'ugc-creator-usage-rights-hospitality-brands',
        'hospitality-content-calendar-guide',
    }

    def test_four_articles_are_published_with_named_authorship(self):
        posts = BlogPost.objects.filter(slug__in=self.expected_slugs)
        self.assertEqual(posts.count(), 4)
        self.assertTrue(all(post.published for post in posts))
        self.assertTrue(all(post.display_author == 'Linda Kafexholli' for post in posts))

    def test_articles_are_substantial_and_internally_linked(self):
        for post in BlogPost.objects.filter(slug__in=self.expected_slugs):
            with self.subTest(slug=post.slug):
                self.assertGreater(len(post.content.split()), 450)
                self.assertIn('href="/', post.content)
                self.assertIn('<h2>', post.content)
