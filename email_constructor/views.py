#-*- coding: utf-8 -*-
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.views.generic import View
from django.template import RequestContext
from django.core.context_processors import csrf
from django.conf import settings


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
        args['domain'] = get_current_site(request).domain
        args['templates'] = Template.objects.all().values('id', 'template_name')
        rc = RequestContext(request, args)
        return render_to_response(self.template, rc)


# сохранение изображений на сервер
class SavingImages():
    def savingImage(self, file, dir='tmp', path=settings.MEDIA_URL):
        return self.__save(file, path, dir)

    def savingImages(self, files, dir='tmp', path=settings.MEDIA_URL):
        arr_path = []
        for image in files:
            image_url = self.__save(image, path, dir)
            arr_path.append(image_url)
        return arr_path

    def __save(self, file, path, dir):
        original_name, file_extension = os.path.splitext(file.name)

        filename = str(randint(10000, 1000000)) + '-' + datetime.now().strftime('%Y-%m-%d-%H-%M-%S') + file_extension

        save_path = default_storage.save(os.path.join(dir, filename), ContentFile(file.read()))
        image_url = os.path.join(path, save_path)
        return image_url


class SavingImageAjax(View, SavingImages):
    def post(self, request):
        if request.is_ajax():
            url = self.savingImage(request.FILES['img'], 'email_images')
            full_url = ''.join(['http://', get_current_site(request).domain, url])
            result = json.dumps(['200', full_url])
            return HttpResponse(result, content_type='application/json')

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
        name = request.POST['name']
        html = request.POST['html']

        try:
            st = Template(template_name = name, template_html = html)
            st.save()

            result = json.dumps(['200', st.id])
        except:
            result = json.dumps(['500'])

        return HttpResponse(result, content_type='application/json')

# получение шаблона
class LoadTemplateAjax(View):
    def get(self, request):
        try:
            template = Template.objects.get(pk=request.GET['id'])
            result = json.dumps(['200', template.template_html])
        except:
            result = json.dumps(['500'])
        return HttpResponse(result, content_type='application/json')


# генерирование эскиза для видео
class VideoThumbmail():
    def generateThumbnail(self, url):
        if 'youtu' in url:
            if 'youtu.be' in url:
                video_id = url.replace('https://youtu.be/', '')
            else:
                match = re.search(r"youtube\.com/.*v=([^&]*)", url)
                video_id = match.group(1)

            return self.youtube(video_id)
        elif 'vimeo' in url:
            result = url.split('/')
            return self.vimeo(result[len(result)-1])
        else:
            return False

    def vimeo(self, id):
        url = "http://vimeo.com/api/v2/video/" + str(id) + ".json?callback=showThumb"

        img = json.loads(self.__getThumb(url))
        main = self.__imageOpen(self.__getThumb(img[0]['thumbnail_large']))
        watermark = Image.open(settings.BASE_DIR + '/media/play/vimeo64.png')
        return self.__pasteImages(main, watermark)


    def youtube(self, id):
        # Open the original image'
        url = "http://img.youtube.com/vi/" + str(id) + "/0.jpg"
        img = self.__getThumb(url)
        main = self.__imageOpen(img)
        watermark = Image.open(settings.BASE_DIR + '/media/play/YouTube-icon.png')
        return self.__pasteImages(main, watermark)

    def __getThumb(self, url):
        return urllib.urlopen(url).read()

    def __imageOpen(self, img):
        return Image.open(cStringIO.StringIO(img))

    def __pasteImages(self, bg, watermark):
        width, height = bg.size
        bg.paste(watermark, ((width/2) - (watermark.size[0] / 2), (height/2) - (watermark.size[1] / 2) ), watermark)
        img_path = "/media/email_images/video-%s-%s.jpg" % (str(randint(0, 100000)), datetime.now().strftime('%Y-%m-%d-%H-%M-%S'))
        bg.save(settings.BASE_DIR + img_path, "JPEG")
        return img_path

class GenerateThumbnail(View, VideoThumbmail):
    def get(self, request):
        if request.is_ajax:
            url = request.GET['url']
            full_url = self.generateThumbnail(url)
            if full_url:
                full_url = ''.join(['http://', get_current_site(request).domain, full_url])
                result = json.dumps(['200', full_url])
            else:
                result = json.dumps(['500'])
            return HttpResponse(result, "application/json")
        else:
            return HttpResponse('AJAX на!', "text/plain")



