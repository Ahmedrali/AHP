from django.shortcuts import render_to_response
from django.http import HttpResponse
import simplejson as json
from AHP.ahp.core.Consistency import AHPCalc

def index(request):
    return render_to_response('index.html')

def checkMat(request):
    m = request.GET.get('m', '')
    mat_str = m.split(",_");
    mat = [];
    for i in range(len(mat_str)-1):
        elms = mat_str[i].split(',')
        col = []
        for j in range(len(elms)):
            col.append(float(elms[j]))
        mat.append(col)
    print 'Mat = %s' %mat
    ahp_obj = AHPCalc()
    CR = ahp_obj.consistency(mat)
    prob = []
    print '\nCR = %s' %CR
    if CR < 0.15:
        for i in range(len(ahp_obj.pr)):
            prob.append( round(ahp_obj.pr[i], 2) )
    return HttpResponse(json.dumps(prob))