#-*- coding:utf-8 -*-
from django.conf.urls import patterns, include, url
from views import EmailConstructorView, SavingImageAjax, SavingTinyMCEImage, SavingTemplatesAjax, LoadTemplateAjax, \
    DeleteTemplateAjax, GenerateThumbnail, TestView, email_autocomplete
from django.contrib.admin.views.decorators import staff_member_required


urlpatterns = patterns('',
    url(r'^$', staff_member_required(EmailConstructorView.as_view()), name='create_email'),
    url(r'^test/$', staff_member_required(TestView.as_view()), name='test'),

    # сохранение загруженного изображения на сервере
    url(r'^send/$', 'email_constructor.views.send'),
    url(r'^save_img/$', SavingImageAjax.as_view(), name='save_img'),
    url(r'^save_tinymce_img/$', SavingTinyMCEImage.as_view(), name='save_tinymce_img'),

    # сохранение шаблона
    url(r'^save_template/$', SavingTemplatesAjax.as_view(), name='save_template'),

    # загрузка выбранного шаблона
    url(r'^load_template/$', LoadTemplateAjax.as_view(), name='load_template'),

    # удаление выбранного шаблона
    url(r'^delete_template/$', DeleteTemplateAjax.as_view(), name='delete_template'),

    # генерирование эскиза для видео
    url(r'^generate_thumbnail/$', GenerateThumbnail.as_view(), name='generate_thumbnail'),

    # запоминание ранее введенных электронок
    url(r'^email_autocomplete/$', email_autocomplete, name='email_autocomplete')
)