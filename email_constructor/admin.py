from django.contrib import admin
from models import Template, UserEmail, User

admin.autodiscover()


# Register your models here.
class TemplateAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'modified')

    manager_fields = ['template_name', 'template_html', 'bg_color', 'bg_image', 'created', 'modified']
    superuser_fields = ['user']

    def get_fields(self, request, obj=None):
        if request.user.is_superuser:
            self.fields = self.manager_fields + self.superuser_fields
        else:
            self.fields = self.manager_fields
        return super(TemplateAdmin, self).get_fields(request, obj)


class UserEmailInline(admin.TabularInline):
    model = UserEmail
    extra = 0


class UserAdmin(admin.ModelAdmin):
    inlines = [UserEmailInline]


admin.site.register(Template, TemplateAdmin)
admin.site.unregister(User)
admin.site.register(User, UserAdmin)