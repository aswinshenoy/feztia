from django import http

from user.models import User


class AuthEmailBackend:
    @staticmethod
    def authenticate(request, username=None, password=None, **kwargs):
        if username is not None:
            try:
                user = User.objects.get(email__iexact=username)
            except User.DoesNotExist:
                return None
            else:
                if user.check_password(password) and user.is_active:
                    return user
        return None

    @staticmethod
    def get_user(user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None


class CORSMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        http_host = "*"
        if hasattr(request, "META") and "HTTP_ORIGIN" in request.META:
            http_host = request.META["HTTP_ORIGIN"]
        if hasattr(request, "META") and (
                request.method == "OPTIONS" and "HTTP_ACCESS_CONTROL_REQUEST_METHOD" in request.META
        ):
            response = http.HttpResponse()
            response["Content-Length"] = "0"
            response["Access-Control-Max-Age"] = 86400
        response["Access-Control-Allow-Origin"] = http_host
        response["Access-Control-Allow-Credentials"] = "true"
        response["Access-Control-Allow-Methods"] = "DELETE, GET, OPTIONS, PATCH, POST, PUT"
        response["Access-Control-Allow-Headers"] = "accept, accept-encoding, authorization, content-type, dnt, origin, user-agent, x-csrftoken, x-requested-with"
        return response


class DisableProtectedAPIMiddleware:
    """
    This middleware should use for production mode. This class hide the introspection.
    """
    def resolve(self, next, root, info, **args):
        if (
            info.field_name == '__schema' or
            info.field_name == '_debug'
        ):
            from user.models import User
            from django.conf import settings
            if (
                settings.DEBUG or
                (
                    hasattr(info.context, 'user') and
                    info.context.user and
                    info.context.user.is_staff
                ) or
                (
                    hasattr(info.context, "userID") and
                    info.context.userID is not None and
                    User.objects.get(id=info.context.userID).is_staff
                )
            ):
                return next(root, info, **args)

            from graphql import GraphQLObjectType, GraphQLField, GraphQLSchema, GraphQLString
            query = GraphQLObjectType(
                "Query", lambda: {
                    "mohanlal": GraphQLField(
                        GraphQLString,
                        description='Sawari Giri Giri...',
                        resolver=lambda *_: "Sawari Giri Giri..."
                    ),
                    "rajnikath": GraphQLField(
                        GraphQLString,
                        description='Naan solrathaiyum seiven, sollathathiyum seiven',
                        resolver=lambda *_: "Naan solrathaiyum seiven, sollathathiyum seiven"
                    ),
                    "amitabhBachhan": GraphQLField(
                        GraphQLString,
                        description='Don ko pakadna mushkil hi nahin, naamumkin hai',
                        resolver=lambda *_: "Don ko pakadna mushkil hi nahin, naamumkin hai"
                    ),
                    "tonyStark": GraphQLField(
                        GraphQLString,
                        description='I know exactly what I am doing',
                        resolver=lambda *_: "I know exactly what I am doing"
                    ),
                }
            )
            info.schema = GraphQLSchema(query=query)
            return next(root, info, **args)
        return next(root, info, **args)

