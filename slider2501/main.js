/* Slider2501, yet another standalone lightweight JavaScript slider */
/* Twitter: @Null_2501 - https://github.com/null2501/slider2501 */

function SLIDER2501(conf){
	var self=this,obj=false,xobj=false,xxobj=false,hw=false,lcnt=0,lobj=[],w=0,h=0,act=0,dst=0,actx=0,dstx=0,lk=0,dtm=0,dltx=0,tmr=false,atmr=false,ply=false,lr=[],ctrl=[],cdiv=false;

	if(typeof(conf['loop'])=='undefined')conf['loop']=false;
	if(typeof(conf['auto'])=='undefined')conf['auto']=0;
	if(typeof(conf['arrows'])=='undefined')conf['arrows']=true;
	if(typeof(conf['controls'])=='undefined')conf['controls']=true;
	if(typeof(conf['callback'])=='undefined')conf['callback']=false;

	var requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;
	if(typeof requestAnimationFrame=='undefined')requestAnimationFrame=false;
	window.requestAnimationFrame=requestAnimationFrame;
	
	this.init=function(){
		if(!obj){obj=document.getElementById(conf['id']);w=obj.offsetWidth;h=obj.offsetHeight}
		if(!xobj){xobj=document.createElement('div');xobj.id=conf['id']+'-x';xobj.className='sl2501x';xobj.appendChild(obj.parentNode.replaceChild(xobj,obj));xobj.style.width=w+'px';xobj.style.height=h+'px'}
		if(!xxobj){xxobj=document.createElement('div');xxobj.id=conf['id']+'-xx';xxobj.className='sl2501xx';xxobj.appendChild(xobj.parentNode.replaceChild(xxobj,xobj));xxobj.style.width=w+'px';xxobj.style.height=h+'px'}
		hw=this.hw_detection();
		lcnt=0;
		for(var i in obj.childNodes)if(typeof obj.childNodes[i].innerHTML!=='undefined'){
			lobj[lcnt]=obj.childNodes[i];
			if(lobj[lcnt].className.indexOf('active')>-1)act=lcnt;
			lobj[lcnt].style.width=w+'px';lobj[lcnt].style.height=h+'px';
			lcnt++;
		}
		dst=act;
		if(conf.loop){
			obj.style.width=(w*(lcnt+2))+'px';
			this.add_clones();
		} else {
			obj.style.width=(w*lcnt)+'px';
		}
		this.pos();
		this.create_arrows();
		this.create_controls();
		this.update();
		lk=0;
		this.stop();
		this.play();
		if(hw)obj.addEventListener(hw,function(){self.hw_callback()},false);
	}
	this.create_arrows=function(){
		if(conf.arrows===false)return false;
		if(lr.length==2)return true;
		var m;
		if(conf.arrows===true)m=xxobj;
		else m=getElementById(conf.arrows);
		lr['prev']=document.createElement('a');lr['prev'].className='prev';lr['prev'].href='#';m.appendChild(lr['prev']);
		lr['next']=document.createElement('a');lr['next'].className='next';lr['next'].href='#';m.appendChild(lr['next']);
		this.add_event(lr['prev'],'click',function(){self.go('prev');return false});
		this.add_event(lr['next'],'click',function(){self.go('next');return false});
	}
	this.create_controls=function(){
		if(conf.controls===false)return false;
		if(ctrl.length===lcnt)return true;
		for(var i=0;i<ctrl.length;i++){
			ctrl[i].parentNode.removeChild(ctrl[i]);
		}
		ctrl=[];
		if(cdiv===false){
			if(conf.controls===true){
				cdiv=document.createElement('div');cdiv.className='controls';
				xxobj.appendChild(cdiv);
			} else cdiv=document.getElementById(conf.controls);
		}
		for(i=0;i<lcnt;i++){
			ctrl[i]=document.createElement('a');ctrl[i].href='#';ctrl[i].idx=i+1;
			this.add_event(ctrl[i],'click',function(){self.go(this.idx);return false});
			cdiv.appendChild(ctrl[i]);
		}		
	}
	this.update=function(){
		if(typeof(conf.callback)!='boolean'){conf.callback(act+1)}
		for(var i=0;i<ctrl.length;i++){
			if(i==act)ctrl[i].className='active';
			else ctrl[i].className='';
		}
	}
	this.go=function(d,auto){
		if(lk++>0)return false;
		if(typeof(auto)=='undefined')auto=false;
		if((!auto)&&(ply))this.stop();

		dst=act;
		if(d==='prev'){
			dst--;
			if((!conf['loop'])&&(dst<0))dst=lcnt-1;
		}else if(d==='next'){
			dst++;
			if((!conf['loop'])&&(dst>=lcnt))dst=0;
		}else{
			dst=parseInt(d)-1;
			if(dst<0)dst=0;
			if(dst>=lcnt)dst=lcnt-1;
		}
		if (dst==act){lk=0;return false}
		if(conf['loop'])dstx=-(w*(dst+1));
		else dstx=-(w*dst);

		if(hw)this.hw_mover(dstx,true);
		else{
			dtm=new Date().getTime();dltx=dstx-actx;
			this.mover();
		}
	}
	this.pos=function(){
		if(conf['loop'])actx=-(w*(act+1));
		else actx=-(w*act);
		if(hw)this.hw_mover(actx,false);
		else obj.style.left=actx+'px';
	}
	this.slide_end=function(){
		if(dst<0)dst=lcnt-1;if(dst>lcnt-1)dst=0;
		act=dst;
		this.pos();
		this.update();
		lk=0;
		if(ply){this.stop();this.play()}
	}
	this.mover=function(){
		var x;
		var dt=400-(new Date().getTime()-dtm);
		if(dt>400)dt=400;if(dt<0)dt=0;
		var att=(Math.PI*(dt/400))+(Math.PI/2),dm=(Math.sin(att)+1)/2;
		if(dt==0)x=dstx;else x=parseInt(actx+(dltx*dm));
		if(dstx!=x){
			obj.style.left=x+"px";
			if(requestAnimationFrame){
				requestAnimationFrame(self.mover);
			} else {
				tmr=setTimeout(function(){self.mover()},16);
			}
		} else {
			self.slide_end();
		}
	}
	this.hw_mover=function(x,trans){
		if(typeof(trans)=='undefined')trans=false;
		var t='';
		if(trans)t='all 0.4s ease-in-out';
		obj.style.webkitTransition=t;
		obj.style.mozTransition=t;
		obj.style.transition=t;
		var m="translate3d("+x+"px,0,0)";
		obj.style.webkitTransform=m;
		obj.style.mozTransform=m;
		obj.style.transform=m;
	}
	this.hw_callback=function(){this.slide_end()}	
	this.hw_detection=function(){
		if(typeof(opera)!='undefined')return false;
		var el = document.createElement('fakeelement');
		var transitions = {
		  'transition':'transitionend',
		  'MozTransition':'transitionend',
		  'WebkitTransition':'webkitTransitionEnd'
		}
		for(var t in transitions){
			if( el.style[t] !== undefined ){
				return transitions[t];
			}
		}
		return false;
	}
	this.add_clones=function(){
		var g=document.getElementById(conf['id']+'_lano');if(g)g.parentNode.removeChild(g);
		g=document.getElementById(conf['id']+'_fino');if(g)g.parentNode.removeChild(g);
		var lano=lobj[lcnt-1].cloneNode(true);lano.setAttribute('id',conf['id']+'_lano');
		var fino = lobj[0].cloneNode(true);fino.setAttribute('id',conf['id']+'_fino');
		lobj[-1]=obj.insertBefore(lano,lobj[0])
		lobj[lcnt]=obj.appendChild(fino);
	}
	this.stop=function(){
		if(atmr)clearTimeout(atmr);atmr=false;
		ply=false;
	}
	this.play=function(){
		if((conf['auto']==0)||(ply))return;
		ply=true;
		atmr=setTimeout(function(){self.go('next',true)},conf['auto']*1000);
	}	
	this.add_event=function(obj, evType, fn) {
	    if (obj.addEventListener) {
	        obj.addEventListener(evType, fn, false);
	        return true;
	    } else if (obj.attachEvent) {
	        var r = obj.attachEvent("on" + evType, fn);
	        return r;
	    }
	}
	
	this.init();
}