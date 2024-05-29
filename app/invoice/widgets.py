from django_json_widget.widgets import JSONEditorWidget


class JSONFieldWidget(JSONEditorWidget):
    template_name = "django_json_widget.html"
