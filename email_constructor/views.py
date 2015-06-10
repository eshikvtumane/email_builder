#-*- coding: utf-8 -*-
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.views.generic import View
from django.template import RequestContext
from django.core.context_processors import csrf
from django.conf import settings

DATETIME_FORMAT = settings.DATETIME_INPUT_FORMATS[0]


from datetime import datetime
import json

import os
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

from django.contrib.sites.models import get_current_site

from models import Template

from random import randint
import re
import urllib
from PIL import Image, ImageDraw
import urllib, cStringIO

from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator


# Create your views here.
class EmailConstructorView(View):
    template = 'email_constructor/builder.html'

    @method_decorator(login_required)
    def get(self, request):
        args = {}
        args.update(csrf(request))
        # получение доменного имени
        args['domain'] = get_current_site(request).domain
        # args['templates'] = Template.objects.all().values('id', 'template_name')
        args['templates'] = Template.objects.all()
        rc = RequestContext(request, args)
        return render_to_response(self.template, rc)


# страница для тестирования
class TestView(EmailConstructorView):
    template = 'email_constructor/test.html'


# сохранение изображений на сервер
class SavingImages():
    def savingImage(self, file, dir='tmp', path=settings.MEDIA_URL):
        # сохраняем изображение и возвращаем путь до него
        return self.__save(file, path, dir)

    # сохранение массива изображений на сервер
    def savingImages(self, files, dir='tmp', path=settings.MEDIA_URL):
        # массив ссылок на изображения
        arr_path = []
        # перебираем все изображения
        for image in files:
            # сохранение изображения
            image_url = self.__save(image, path, dir)
            arr_path.append(image_url)
        return arr_path

    def __save(self, file, path, dir):
        # получаем имя и расширение файла
        original_name, file_extension = os.path.splitext(file.name)
        # генерируем уникальное имя файлу
        filename = str(randint(10000, 1000000)) + '-' + datetime.now().strftime('%Y-%m-%d-%H-%M-%S') + file_extension
        # сохраняем файл
        save_path = default_storage.save(os.path.join(dir, filename), ContentFile(file.read()))
        # формируем путь до файла
        image_url = os.path.join(path, save_path)
        return image_url


# сохранение изображений с локальной машины
class SavingImageAjax(View, SavingImages):
    def post(self, request):
        if request.is_ajax():
            url = self.savingImage(request.FILES['img'], 'email_images')
            full_url = ''.join(['http://', get_current_site(request).domain, url])
            result = json.dumps(['200', full_url])
            return HttpResponse(result, content_type='application/json')


# сохранение изображений с локальной машины через редактор TinyMCE
class SavingTinyMCEImage(View, SavingImages):
    def post(self, request):
        try:
            url = self.savingImage(request.FILES['image'], 'email_images')
            full_url = ''.join(['http://', get_current_site(request).domain, url])
            result_dict = {"error":False,"path":full_url}
            serialized_instance = json.dumps(['200', full_url])
        except Exception, e:
            serialized_instance = json.dumps(['500', e.message])

        return HttpResponse(serialized_instance, content_type='application/json')


# сохранение шаблона письма
class SavingTemplatesAjax(View):
    def post(self, request):
        post = request.POST
        make_new_template = bool(int(post['make_new_template']))
        name = post['name']
        html = post['html']
        bg_color = post.get('bg_color', '')
        bg_img = post.get('bg_image', None)

        if make_new_template:
            try:
                if bg_color:
                    st = Template(template_name=name, template_html=html, bg_color=bg_color, bg_image=bg_img)
                else:
                    st = Template(template_name=name, template_html=html, bg_image=bg_img)
                st.save()
                result = json.dumps({
                    'code': '200_new',
                    'template_id': st.id,
                    'creation_date': st.created.strftime(DATETIME_FORMAT),
                    'changing_date': st.modified.strftime(DATETIME_FORMAT)
                })
            except:
                result = json.dumps({'code': '500'})
        else:
            try:
                template_id = post['template_id']
                temp = Template.objects.get(pk=template_id)
                temp.template_name = name
                temp.template_html = html
                temp.bg_color = bg_color
                temp.bg_image = bg_img
                temp.save()
                result = json.dumps({
                    'code': '200_old',
                    'template_id': temp.id,
                    'name': temp.template_name,
                    'changing_date': temp.modified.strftime(DATETIME_FORMAT)
                    })
            except Exception, e:
                result = json.dumps({'code': '500'})
        return HttpResponse(result, content_type='application/json')


# загрузка шаблона
class LoadTemplateAjax(View):
    def get(self, request):
        try:
            template = Template.objects.get(pk=request.GET['id'])
            # result = json.dumps([
            #     '200',
            #     template.template_html,
            #     template.bg_color,
            #     template.bg_image,
            #     template.template_name
            # ])
            result = json.dumps({
                'code': '200',
                'html': template.template_html,
                'color': template.bg_color,
                'image': template.bg_image,
                'name': template.template_name
            })
        except Exception, e:
            result = json.dumps({'code': '500'})
        return HttpResponse(result, content_type='application/json')


# удаление шаблона из списка
class DeleteTemplateAjax(View):
    def get(self, request):
        try:
            Template.objects.get(pk=request.GET['id']).delete()
            result = json.dumps(['200'])
        except Exception, e:
            result = json.dumps(['500', e.message])
        return HttpResponse(result, content_type='application/json')


# генерирование эскиза для видео
class VideoThumbmail():
    def generateThumbnail(self, url):
        # анализ переданного с клиента url
        # если url от youtube
        if 'youtu' in url:
            if 'youtu.be' in url:
                # получаем id видео
                video_id = url.replace('https://youtu.be/', '')
            else:
                # получаем id видео
                match = re.search(r"youtube\.com/.*v=([^&]*)", url)
                video_id = match.group(1)

            # передаём полученное id
            return self.youtube(video_id)
        # если url от vimeo
        elif 'vimeo' in url:
            # получаем id видео
            result = url.split('/')
            return self.vimeo(result[len(result)-1])
        else:
            return False

    # генерирование эскиза видео с видеохостинга Vimeo
    def vimeo(self, id):
        # формирование ссылки для скачивания эскиза
        url = "http://vimeo.com/api/v2/video/" + str(id) + ".json?callback=showThumb"

        # скачиваем файл с ссылками на изображения
        img = json.loads(self.__getThumb(url))
        # получаем объект изображения
        main = self.__imageOpen(self.__getThumb(img[0]['thumbnail_large']))
        # получаем объект изображения (кнопка воспроизведения)
        watermark = Image.open(settings.BASE_DIR + '/media/play/vimeo64.png')
        # накладываем кнопку воспроизведения
        return self.__pasteImages(main, watermark)

    # генерирование эскиза видео с видеохостинга Youtube
    def youtube(self, id):
        # Open the original image'
        url = "http://img.youtube.com/vi/" + str(id) + "/0.jpg"
        img = self.__getThumb(url)
        # получаем объект скаченной картинки
        main = self.__imageOpen(img)
        # получаем объект изображения (кнопка воспроизведения)
        watermark = Image.open(settings.BASE_DIR + '/media/play/YouTube-icon.png')
        # накладываем кнопку воспроизведения
        return self.__pasteImages(main, watermark)

    # скачиваем изображение
    def __getThumb(self, url):
        return urllib.urlopen(url).read()
    # получаем объект изображения
    def __imageOpen(self, img):
        return Image.open(cStringIO.StringIO(img))
    # накладывание изображений
    def __pasteImages(self, bg, watermark):
        width, height = bg.size
        bg.paste(watermark, ((width/2) - (watermark.size[0] / 2), (height/2) - (watermark.size[1] / 2) ), watermark)
        img_path = "/media/email_images/video-%s-%s.jpg" % (str(randint(0, 100000)), datetime.now().strftime('%Y-%m-%d-%H-%M-%S'))
        bg.save(settings.BASE_DIR + img_path, "JPEG")
        return img_path


# генерирование шаблона по ссылке, полученной с клиента
class GenerateThumbnail(View, VideoThumbmail):
    def get(self, request):
        if request.is_ajax:
            url = request.GET['url']
            # генерирование шаблона
            full_url = self.generateThumbnail(url)
            if full_url:
                # формирование полного пути
                full_url = ''.join(['http://', get_current_site(request).domain, full_url])
                result = json.dumps(['200', full_url])
            else:
                # если произошла ошибка или ссылка не относится к видеохостингам
                result = json.dumps(['500'])
            return HttpResponse(result, "application/json")
        else:
            # если запрос сделан не через ajax
            return HttpResponse('AJAX!', "text/plain")


from django.core.mail import send_mail
def send(request):
    send_mail('Letter', 'msg', 'admin@geliusdv.ru', [request.POST.get('mail', '')], fail_silently=False, html_message=request.POST.get('html'))
    return HttpResponse('sent')
