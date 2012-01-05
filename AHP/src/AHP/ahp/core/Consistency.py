'''
Created on Dec 5, 2011

@author: Ahmed H.Ali
'''
class AHPCalc():
    def __init__(self):
        self.RI = [1, 1, .58, .9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57, 1.59]
        self.pr = []
    def consistency(self, m):
        h = len(m)
        w = len(m[0])
        if (h != w):
            print "Error: Matrix Dim not consistency"
        sum_col = self.sumCol(m)
        m_r = []
        for i in range(w):
            s = [];
            for j in range(h):
                s.append(m[i][j] / float(sum_col[i]))
            m_r.append(s)
        sum_row = self.sumRow(m_r)
        for i in range(len(sum_row)):
            self.pr.append(sum_row[i]/ float(h));
        m_multi = self.multi(m, self.pr)
        m_div = []
        for i in range(h):
            m_div.append(m_multi[i] / float(self.pr[i]) )
        m_div_sum = 0
        for i in range(h):
            m_div_sum = m_div_sum + m_div[i]
        
        lamda_max = m_div_sum / float(h)
        
        CI = (lamda_max - h) / float(h - 1)
        
        CR = CI / self.RI[h-1]
        
        return CR
    
    def sumCol(self, m):
        h = len(m)
        w = len(m[0])
        res = []
        for i in range(h):
            s = 0;
            for j in range(w):
                s = s + m[i][j]
            res.append(s)
        if w != len(res):
            print "Error: col-Size doesn't match"
        return res
    
    def sumRow(self, m):
        h = len(m)
        w = len(m[0])
        res = []
        for i in range(w):
            s = 0;
            for j in range(h):
                s = s + m[j][i]
            res.append(s)
        if h != len(res):
            print "Error: Row-Size doesn't match"
        return res
    
    def multi(self, m, v):
        w = len(m)      # 0f cols
        h = len(m[0])   # of rows
        w_v = len(v)    # of vector elements
        
        if w != w_v:
            print "Error: Matrix and Vector Dim not consistency"
        res = []
        for i in range(h):
            s = 0
            for j in range(w):
                s = s + (m[j][i] * v[j])
            res.append(s)
        
        if h != len(res):
            print "Error: multi-Size doesn't match"
             
        return res
