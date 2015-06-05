# -*- coding: utf-8 -*-
from django.db import models
import datetime


# Create your models here.
class Template(models.Model):
    template_name = models.CharField(verbose_name='Название', max_length=50)
    template_html = models.TextField(verbose_name='Шаблон')

    bg_color = models.CharField(verbose_name='Цвет фона', max_length=7, default='#C3CCD5')
    bg_image = models.TextField(verbose_name='Изображения для фона', blank=True, null=True)

    created = models.DateTimeField(verbose_name='дата создания', blank=True, null=True)
    modified = models.DateTimeField(verbose_name='дата последних изменений', blank=True, null=True)

    def __unicode__(self):
        return self.template_name

    def save(self, *args, **kwargs):
        now = datetime.datetime.now()

        # автозаполнение даты создания и даты последних изменений
        if not self.id or not self.created:
            self.created = now
        self.modified = now
        template = super(Template, self).save(*args, **kwargs)

        # templates = Template.objects.all()
        # for temp in templates:
        #     if not temp.created:
        #         temp.created = now
        #     if not temp.modified:
        #         temp.modified = now
        #     temp.save()

        # сжатие картинки
        # if self.image:
        #     compress_an_image(self.image, self.file_path)
        return template

    class Meta:
        db_table = 'Templates'
        verbose_name = 'Шаблон'
        verbose_name_plural = 'Шаблоны'