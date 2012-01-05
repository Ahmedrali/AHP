from django.conf.urls.defaults import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('ahp.views',
    (r'^$', 'index'),
    (r'^/$', 'index'),
    (r'^index$', 'index'),
    (r'^index.html$', 'index'),
    (r'^checkMat$', 'checkMat'),
    
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    url(r'^admin/', include(admin.site.urls)),
)
