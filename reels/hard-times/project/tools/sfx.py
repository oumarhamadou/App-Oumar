# Synthesizes a small royalty-free SFX kit (all generated from scratch).
import numpy as np, soundfile as sf, sys, os
SR = 48000
out = sys.argv[1]
rng = np.random.default_rng(7)

def t(d): return np.arange(int(SR*d))/SR
def norm(x, peak=0.9): return x/(np.max(np.abs(x))+1e-9)*peak
def lp(x, a):  # one-pole lowpass, a in (0,1)
    y = np.empty_like(x); s = 0.0
    for i,v in enumerate(x): s += a*(v-s); y[i]=s
    return y
def bandsweep(n, f0, f1, q=6.0):
    # time-varying 2-pole resonant bandpass on noise
    N=len(n); f=np.geomspace(f0,f1,N); y=np.zeros(N); y1=y2=0.0
    for i in range(N):
        w=2*np.pi*f[i]/SR; r=np.exp(-w/(2*q)); c=2*r*np.cos(w)
        v=n[i]+c*y1-r*r*y2; y2=y1; y1=v; y[i]=v
    return y
def stereo(x, width=0.0):
    if width==0: return np.stack([x,x],1)
    d=int(SR*0.0004*width*10); l=x; r=np.concatenate([np.zeros(d),x[:-d]]) if d>0 else x
    return np.stack([l,r],1)
def save(name, x, peak=0.9):
    x = norm(x, peak)
    if x.ndim==1: x=stereo(x,0.6)
    sf.write(os.path.join(out,name+".wav"), x.astype(np.float32), SR)

# whoosh: noise through rising-then-falling bandpass, swelling envelope
d=0.55; n=rng.standard_normal(int(SR*d)); tt=t(d)
f=np.concatenate([np.geomspace(250,3200,int(SR*d*0.6)), np.geomspace(3200,900,int(SR*d)-int(SR*d*0.6))])
y=np.zeros_like(n); y1=y2=0.0
for i in range(len(n)):
    w=2*np.pi*f[i]/SR; r=np.exp(-w/8); c=2*r*np.cos(w); v=n[i]+c*y1-r*r*y2; y2=y1; y1=v; y[i]=v
env=np.sin(np.pi*np.clip(tt/d,0,1))**2.2
save("whoosh", y*env, 0.8)

# fast whoosh (short, for pans)
d=0.32; n=rng.standard_normal(int(SR*d)); tt=t(d)
y=bandsweep(n,600,4200,5); env=np.sin(np.pi*tt/d)**2
save("swish", y*env, 0.7)

# pop: sine blip with pitch drop + tiny click
d=0.14; tt=t(d); fr=np.geomspace(1300,420,len(tt)); ph=2*np.pi*np.cumsum(fr)/SR
y=np.sin(ph)*np.exp(-tt*38); y[:60]+=rng.standard_normal(60)*0.3*np.linspace(1,0,60)
save("pop", y, 0.7)

# soft ui tick
d=0.05; tt=t(d); y=np.sin(2*np.pi*2600*tt)*np.exp(-tt*140)+rng.standard_normal(len(tt))*np.exp(-tt*400)*0.4
save("tick", y, 0.5)

# mouse click (two transients)
d=0.09; tt=t(d); y=np.zeros(len(tt))
for off,a in [(0,1.0),(int(SR*0.045),0.6)]:
    k=np.arange(len(tt)-off)/SR; y[off:]+= a*(rng.standard_normal(len(k))*np.exp(-k*900)+np.sin(2*np.pi*3400*k)*np.exp(-k*500)*0.5)
save("click", y, 0.6)

# key press variants
for j in range(4):
    d=0.06; tt=t(d); f0=1800+j*260
    y=rng.standard_normal(len(tt))*np.exp(-tt*520)*0.8+np.sin(2*np.pi*f0*tt)*np.exp(-tt*300)*0.35
    y=lp(y,0.55)
    save(f"key{j}", y, 0.42)

# glitch: bitcrushed square/noise bursts
d=0.38; tt=t(d); y=np.zeros(len(tt)); i=0
while i < len(tt):
    seg=int(SR*rng.uniform(0.012,0.045)); kind=rng.integers(0,3); k=np.arange(min(seg,len(tt)-i))/SR
    if kind==0: s=np.sign(np.sin(2*np.pi*rng.uniform(80,900)*k))
    elif kind==1: s=rng.standard_normal(len(k))
    else: s=np.zeros(len(k))
    y[i:i+len(k)]=s*rng.uniform(0.3,1.0); i+=seg
y=np.round(y*6)/6
save("glitch", y, 0.55)

# error buzz (two low square-ish tones)
d=0.32; tt=t(d); y=np.zeros(len(tt))
for st,f0 in [(0,190),(0.15,150)]:
    m=(tt>=st)&(tt<st+0.14); k=tt[m]-st
    y[m]+=np.tanh(3*np.sin(2*np.pi*f0*k))*np.exp(-k*10)
y=lp(y,0.35); save("error", y, 0.55)

# ding (pin drop): bell partials
d=1.0; tt=t(d); y=sum(a*np.sin(2*np.pi*f*tt)*np.exp(-tt*dk) for f,a,dk in [(1318,1,5),(2637,0.4,8),(3951,0.2,11),(1975,0.25,7)])
save("ding", y, 0.5)

# impact: sub boom + noise crack + tail
d=1.6; tt=t(d); fr=np.geomspace(120,38,len(tt)); ph=2*np.pi*np.cumsum(fr)/SR
boom=np.sin(ph)*np.exp(-tt*3.2); crack=lp(rng.standard_normal(len(tt)),0.25)*np.exp(-tt*16)
y=np.tanh(1.6*(boom+0.5*crack)); save("impact", y, 0.95)

# riser: noise with rising band + rising tone, exponential swell
d=1.3; tt=t(d); n=rng.standard_normal(len(tt)); y=bandsweep(n,300,6000,4)
y=y/np.max(np.abs(y)); tone=np.sin(2*np.pi*np.cumsum(np.geomspace(180,900,len(tt)))/SR)*0.25
env=(tt/d)**2.6; y=(y*0.8+tone)*env; y[-int(SR*0.02):]*=np.linspace(1,0,int(SR*0.02))
save("riser", y, 0.7)

# heartbeat-ish low thump (for tension)
d=0.5; tt=t(d); y=np.sin(2*np.pi*np.cumsum(np.geomspace(90,45,len(tt)))/SR)*np.exp(-tt*9)
save("thump", y, 0.8)

# swoosh-up for text slams (reverse-ish)
d=0.4; tt=t(d); n=rng.standard_normal(len(tt)); y=bandsweep(n,800,7000,3)*(tt/d)**2
y[-int(SR*0.01):]*=np.linspace(1,0,int(SR*0.01)); save("suck", y, 0.6)
print("ok")
