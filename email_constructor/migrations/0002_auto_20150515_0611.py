# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('email_constructor', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='template',
            name='bg_color',
            field=models.CharField(default=1, max_length=7, verbose_name=b'\xd0\xa6\xd0\xb2\xd0\xb5\xd1\x82 \xd1\x84\xd0\xbe\xd0\xbd\xd0\xb0'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='template',
            name='bg_image',
            field=models.TextField(default=1, verbose_name=b'\xd0\x98\xd0\xb7\xd0\xbe\xd0\xb1\xd1\x80\xd0\xb0\xd0\xb6\xd0\xb5\xd0\xbd\xd0\xb8\xd1\x8f \xd0\xb4\xd0\xbb\xd1\x8f \xd1\x84\xd0\xbe\xd0\xbd\xd0\xb0'),
            preserve_default=False,
        ),
    ]
