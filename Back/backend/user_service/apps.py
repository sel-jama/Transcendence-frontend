from django.apps import AppConfig
#from .views import run_on_startup

class UserProfileConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user_service'

    # def ready(self):
    #     run_on_startup()