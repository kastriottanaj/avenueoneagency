from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_blogpost_category_newslettersignup_delete_blospost_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogpost',
            name='byline',
            field=models.CharField(
                blank=True,
                help_text='Public author name when the author does not have a Django account',
                max_length=120,
            ),
        ),
        migrations.AddField(
            model_name='blogpost',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
