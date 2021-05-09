from django.db import connection
from django.http import HttpResponse
from django.template import loader
from django.views import View

from django.db import DEFAULT_DB_ALIAS, connections
from django.db.migrations.executor import MigrationExecutor


def is_database_synchronized(database):
    cn = connections[database]
    cn.prepare_database()
    executor = MigrationExecutor(cn)
    targets = executor.loader.graph.leaf_nodes()
    return not executor.migration_plan(targets)


class HealthCheckView(View):
    @staticmethod
    def get(request, *args, **kwargs):
        with connection.cursor() as cursor:
            cursor.execute("select 1")
            one = cursor.fetchone()[0]
            if one != 1:
                reason = 'Not Connected To Database'
                return HttpResponse(
                    loader.render_to_string(
                    'healthz.html',
                        {
                            'status': 503,
                            'message': 'Service Unavailable',
                            'reason': reason
                        }
                    ),
                    status=503,
                    reason=reason
                )
        if is_database_synchronized(DEFAULT_DB_ALIAS):
            pass
        else:
            reason = 'Database Migrations Pending.'
            return HttpResponse(
                loader.render_to_string(
                'healthz.html',
                    {
                        'status': 503,
                        'message': 'Service Unavailable',
                        'reason': reason,
                    }
                ),
                status=503,
                reason=reason
            )
        return HttpResponse(
            loader.render_to_string(
            'healthz.html',
                {
                    'status': 200,
                    'message': 'Service Healthy',
                    'reason': 'Services running',
                }
            ),
            status=200,
        )
