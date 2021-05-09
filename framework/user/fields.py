from django.db.models import FileField
from django.forms import forms
from django.template.defaultfilters import filesizeformat
from django.utils.translation import ugettext_lazy as _


class MediaField(FileField):
    """
    Same as FileField, but you can specify:
        * content_types - list containing allowed content_types. Example: ['application/pdf', 'image/jpeg'] - MIME TYPES
        * max_upload_size - a number indicating the maximum file size allowed for upload.
    """
    def __init__(self, *args, **kwargs):
        self.content_types = kwargs.pop("content_types", [])
        self.max_size = kwargs.pop("max_size", 0)

        super(MediaField, self).__init__(*args, **kwargs)

    def clean(self, *args, **kwargs):
        data = super(MediaField, self).clean(*args, **kwargs)

        file = data.file
        try:
            content_type = file.content_type
            if content_type in self.content_types or self.content_types == []:
                if file._size > self.max_size or self.max_size == 0:
                    raise forms.ValidationError(
                        _('Please keep file size under %s. Current file size is %s')
                        % (filesizeformat(self.max_size), filesizeformat(file._size))
                    )
            else:
                raise forms.ValidationError(_('File type not supported.'))
        except AttributeError:
            pass

        return data


__all__ = [
    'MediaField'
]
