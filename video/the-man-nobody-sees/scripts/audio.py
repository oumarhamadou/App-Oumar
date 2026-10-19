import numpy as np, sys
sr=44100
x=np.fromfile(sys.argv[1],dtype=np.float32).reshape(-1,2)
out_len=int(39.6*sr)
y=np.zeros((out_len,2),np.float32)
T=lambda s:int(round(s*sr))
cut=T(36.83)
y[:cut]=x[:cut]
fo=T(0.03); y[cut-fo:cut]*=np.linspace(1,0,fo)[:,None]

def lowpass(sig,fc):
    # one-pole lowpass, applied twice
    a=np.exp(-2*np.pi*fc/sr); o=sig.copy()
    for _ in range(2):
        z=np.zeros(2,np.float32); r=np.empty_like(o)
        for i in range(len(o)):
            z=(1-a)*o[i]+a*z; r[i]=z
        o=r
    return o

def ola_extend(seg,length,win=0.6,hop=0.3,seed=0):
    rng=np.random.default_rng(seed); W=T(win); H=T(hop)
    w=np.hanning(W)[:,None].astype(np.float32)
    o=np.zeros((length+W,2),np.float32); norm=np.zeros((length+W,1),np.float32)
    pos=0
    while pos<length:
        st=rng.integers(0,len(seg)-W)
        o[pos:pos+W]+=seg[st:st+W]*w; norm[pos:pos+W]+=w; pos+=H
    o=o[:length]/np.maximum(norm[:length],1e-3)
    return o

# G-chord sustain (speech-free 27.40-27.95) bridging to the next bar line at 37.24
g=x[T(27.40):T(27.95)]
bridge=ola_extend(g,T(37.40)-T(36.78),win=0.4,hop=0.2,seed=1)
# A-minor resolution (speech-free 22.52-23.24) from 37.24 to the end
am=x[T(22.52):T(23.24)]
res=ola_extend(am,out_len-T(37.10),win=0.5,hop=0.25,seed=2)
res=lowpass(res,4200)
bridge=lowpass(bridge,4200)
# envelopes
b0=T(36.78); bl=len(bridge); env=np.ones(bl,np.float32)
fi=T(0.08); env[:fi]=np.linspace(0,1,fi); xf=T(0.16); env[-xf:]=np.linspace(1,0,xf)
y[b0:b0+bl]+=bridge*env[:,None]*0.9
r0=T(37.10); rl=len(res); t=np.arange(rl)/sr
env=np.minimum(1,t/0.16)*np.exp(-np.maximum(0,t-0.3)*0.9)
fade_end=np.clip((rl-np.arange(rl))/T(0.6),0,1)
y[r0:r0+rl]+=res*(env*fade_end)[:,None].astype(np.float32)*0.95
# soft echo of "most" (36.54-36.83)
m=x[T(36.52):cut].copy(); m*=np.hanning(len(m))[:,None]**0.3
for d,gn,fc in [(0.42,0.26,3000),(0.84,0.13,2200),(1.26,0.06,1600)]:
    e=lowpass(m,fc)*gn; s0=T(36.52+d); y[s0:s0+len(e)]+=e
y=np.clip(y,-1,1)
y.astype(np.float32).tofile(sys.argv[2])
print('done',y.shape, 'peak',np.abs(y).max())
