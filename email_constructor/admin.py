from django.contrib import admin
from models import Template

admin.autodiscover()


# Register your models here.
class TemplateAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'modified')

admin.site.register(Template, TemplateAdmin)