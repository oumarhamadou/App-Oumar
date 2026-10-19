import numpy as np, sys
sr=22050; x=np.fromfile(sys.argv[1],dtype=np.float32)
n=8192; hop=1024
win=np.hanning(n); fr=np.fft.rfftfreq(n,1/sr)
F=1+(len(x)-n)//hop
S=np.abs(np.stack([np.fft.rfft(win*x[i*hop:i*hop+n]) for i in range(F)]))
t=(np.arange(F)*hop+n/2)/sr
band=(fr>55)&(fr<520)
midi=69+12*np.log2(fr[band]/440)
pc=np.round(midi).astype(int)%12
C=np.zeros((F,12))
for k in range(12): C[:,k]=S[:,band][:,pc==k].sum(1)
C/= (C.sum(1,keepdims=True)+1e-9)
# smooth 0.5s
k=int(0.5*sr/hop); ker=np.ones(k)/k
Cs=np.stack([np.convolve(C[:,j],ker,'same') for j in range(12)],1)
d=np.r_[0,np.linalg.norm(np.diff(Cs,axis=0),axis=1)]
names='C C# D D# E F F# G G# A A# B'.split()
pk=[i for i in range(2,F-2) if d[i]==d[i-2:i+3].max() and d[i]>np.percentile(d,85)]
print("chord-change candidates:",[round(t[i],2) for i in pk])
for s in np.arange(0,37,1.0):
    m=(t>=s)&(t<s+1); top=np.argsort(-Cs[m].mean(0))[:3]
    print(f"{s:4.0f}s", ' '.join(names[j] for j in top))
