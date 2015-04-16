# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Template',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('template_name', models.CharField(max_length=50, verbose_name=b'\xd0\x9d\xd0\xb0\xd0\xb7\xd0\xb2\xd0\xb0\xd0\xbd\xd0\xb8\xd0\xb5')),
                ('template_html', models.TextField(verbose_name=b'\xd0\xa8\xd0\xb0\xd0\xb1\xd0\xbb\xd0\xbe\xd0\xbd')),
            ],
            options={
                'db_table': 'Templates',
                'verbose_name': '\u0428\u0430\u0431\u043b\u043e\u043d',
                'verbose_name_plural': '\u0428\u0430\u0431\u043b\u043e\u043d\u044b',
            },
            bases=(models.Model,),
        ),
    ]
