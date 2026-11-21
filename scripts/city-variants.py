# Делает вечернюю и ночную версии фона города из src/assets/img/city.webp.
# Запуск: python3 scripts/city-variants.py (нужны pillow, numpy, scipy)
import numpy as np, random
from PIL import Image, ImageFilter
import os
D=os.path.join(os.path.dirname(__file__),'..','src','assets','img')+'/'
src=Image.open(D+'city.webp').convert('RGB');src=src.crop((26,26,src.width-26,src.height-26))
a=np.asarray(src).astype(np.float32)/255
L=(0.3*a[...,0]+0.59*a[...,1]+0.11*a[...,2])
sat=a.max(-1)-a.min(-1)
H,W=L.shape
# здания: тёмнее неба и насыщенно-синие/фиолетовые; небо и облака светлые
raw=((L<0.56)&(sat>0.14))
from scipy import ndimage
raw=ndimage.binary_closing(raw,iterations=2)
lab,n=ndimage.label(raw)
keep=set(np.unique(lab[-6:,:]))|set(np.unique(lab[:,-6:]))
keep.discard(0)
bmask=np.isin(lab,list(keep)).astype(np.float32)
bm=Image.fromarray((bmask*255).astype(np.uint8)).filter(ImageFilter.MedianFilter(7)).filter(ImageFilter.GaussianBlur(1.2))
bmask=np.asarray(bm).astype(np.float32)/255
yy=np.linspace(0,1,H)[:,None]
def make(kind):
    if kind=='night':
        top=np.array([0.04,0.06,0.20]);bot=np.array([0.16,0.12,0.38])
        sky=top*(1-yy[...,None])+bot*yy[...,None]
        sky=np.broadcast_to(sky,(H,W,3))
        # облака светятся холодным светом луны
        cl=np.clip((L-0.55)/0.45,0,1)[...,None]
        sky=sky+cl*np.array([0.17,0.19,0.40])
        g=L[...,None];bld=g*np.array([0.30,0.30,0.62])+np.array([0.03,0.03,0.10])
        win_cols=[(255,214,140),(255,214,140),(255,236,200),(140,190,255),(200,160,255)]
        density=0.0040
    else: # dusk
        top=np.array([0.55,0.60,0.92]);bot=np.array([0.97,0.78,0.86])
        sky=top*(1-yy[...,None])+bot*yy[...,None]
        sky=np.broadcast_to(sky,(H,W,3))
        cl=np.clip((L-0.55)/0.45,0,1)[...,None]
        sky=sky*(1-cl*0.5)+cl*0.5*np.array([1.0,0.88,0.95])
        g=L[...,None];bld=g*np.array([0.78,0.70,1.05])+np.array([0.10,0.08,0.22])
        win_cols=[(255,226,170),(255,200,220),(210,190,255)]
        density=0.0026
    m=bmask[...,None]
    out=sky*(1-m)+bld*m
    img=Image.fromarray((np.clip(out,0,1)*255).astype(np.uint8))
    # окна: только внутри зданий, по сетке, с мягким свечением
    glow=Image.new('RGB',(W,H),(0,0,0));from PIL import ImageDraw
    d=ImageDraw.Draw(glow);random.seed(4)
    n=int(W*H*density/40)
    ys,xs=np.nonzero(bmask>0.9)
    for _ in range(n):
        k=random.randrange(len(xs));x=int(xs[k])//8*8;y=int(ys[k])//11*11
        c=random.choice(win_cols);d.rectangle((x,y,x+4,y+6),fill=c)
    halo=glow.filter(ImageFilter.GaussianBlur(5))
    arr=np.asarray(img).astype(np.float32)+np.asarray(halo).astype(np.float32)*0.9+np.asarray(glow).astype(np.float32)*0.85
    img=Image.fromarray(np.clip(arr,0,255).astype(np.uint8))
    img.save(D+f'city-{kind}.webp','WEBP',quality=78,method=6)
    img.resize((1252,688),Image.LANCZOS).save(D+f'city-{kind}-sm.webp','WEBP',quality=74,method=6)

make('night');make('dusk')
