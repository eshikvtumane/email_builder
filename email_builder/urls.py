from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.contrib.auth.views import login

admin.autodiscover()

from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'email_builder.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^', include('email_constructor.urls',namespace = 'email_constructor')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/', login, {'template_name':'admin/login.html'}),
)
#http://stackoverflow.com/questions/16196603/images-from-imagefield-in-django-dont-load-in-templates
#https://docs.djangoproject.com/en/dev/howto/static-files/#deploying-static-files-in-a-nutshell
urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)