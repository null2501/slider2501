/* Thorium Slider, Yet Another Lightweight JavaScript Content Slider with Touch Support */
/* Twitter: @Null_2501 - https://github.com/null2501/thorium-slider */

function THORIUM(conf){
	var self=this,obj=false,xobj=false,xxobj=false,hw=false,lcnt=0,lobj=[],w=0,h=0,act=0,dst=0,actx=0,dstx=0,lk=0,dtm=0,dltx=0,tmr=false,atmr=false,ply=false,lr=[],ctrl=[],cdiv=false,mob=false,tob=false,labs=[];
	if(typeof(conf.mode)=='undefined')conf.mode='scroll';
	if(typeof(conf.loop)=='undefined')conf.loop=false;
	if(typeof(conf.auto)=='undefined')conf.auto=0;
	if(typeof(conf.arrows)=='undefined')conf.arrows=true;
	if(typeof(conf.controls)=='undefined')conf.controls=true;
	if(typeof(conf.callback)=='undefined')conf.callback=false;
	if(typeof(conf.shadow)=='undefined')conf.shadow=false;
	if(typeof(conf.touch)=='undefined')conf.touch=true;
	if(typeof(conf.speed)=='undefined')conf.speed=450;
	if(typeof(conf.easing)=='undefined')conf.easing='ease-in-out';
	if(typeof(conf.labels)=='undefined')conf.labels=false;

	var requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;
	if(typeof requestAnimationFrame=='undefined')requestAnimationFrame=false;
	window.requestAnimationFrame=requestAnimationFrame;
	if(conf.touch)mob=("ontouchstart" in document.documentElement);
	
	if(/Android.+Firefox\//.test(navigator.userAgent)){
		if(conf.mode=='fade')conf.speed*=1.5;
		else conf.speed*=1.2;
	}
	
	this.init=function(){
		if((conf.mode!='scroll')&&(conf.loop==true))conf.loop='semi';
		if(!obj){obj=document.getElementById(conf.id);w=obj.offsetWidth;h=obj.offsetHeight}
		if(!xobj){xobj=document.createElement('div');xobj.id=conf.id+'-x';xobj.className='sl2501x';xobj.appendChild(obj.parentNode.replaceChild(xobj,obj));xobj.style.width=w+'px';xobj.style.height=h+'px';
			if(conf.mode!='scroll')xobj.className+=' sl2501f'
		}
		if(!xxobj){
			if(document.getElementById(conf.id+'-wrapper'))xxobj=document.getElementById(conf.id+'-wrapper');
			else{xxobj=document.createElement('div');xxobj.id=conf.id+'-wrapper';xxobj.className='sl2501-wrapper';xxobj.appendChild(xobj.parentNode.replaceChild(xxobj,xobj));xxobj.style.width=w+'px';xxobj.style.height=h+'px'}
			if(typeof(conf.shadow)=='string'){
				if(conf.shadow.indexOf('bottom')!=-1)this.appendDiv('','sl2501-botshadow');
				if(conf.shadow.indexOf('top')!=-1)this.appendDiv('','sl2501-topshadow');
			}
		}
		hw=this.hw_detection();
		if(mob)tob=new THORIUM_TOUCH(obj,function(g){self.mgo(g)});
		lcnt=0;labs=[];
		for(var i in obj.childNodes)if(typeof obj.childNodes[i].innerHTML!=='undefined'){
			lobj[lcnt]=obj.childNodes[i];
			if(lobj[lcnt].getAttribute('data-label'))labs[lcnt]=lobj[lcnt].getAttribute('data-label');
			else labs[lcnt]=false;
			if(lobj[lcnt].className.indexOf('active')>-1)act=lcnt;
			lobj[lcnt].style.width=w+'px';lobj[lcnt].style.height=h+'px';
			lcnt++;
		}
		dst=act;
		if(conf.mode=='scroll'){
			if(conf.loop===true){
				obj.style.width=(w*(lcnt+2))+'px';
				this.add_clones();
			} else {
				obj.style.width=(w*lcnt)+'px';
			}
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
		if(lr.length==2)return true;
		if(conf.arrows===false)return false;
		var m=false;
		if(!(conf.arrows===true)){
			if(document.getElementById(conf.arrows+'-prev')) {
				lr['prev']=document.getElementById(conf.arrows+'-prev');
				lr['next']=document.getElementById(conf.arrows+'-next');
			} else m=document.getElementById(conf.arrows);
		} else m=xxobj;
		if(m){
			lr['prev']=document.createElement('a');lr['prev'].className='prev';lr['prev'].href='#';m.appendChild(lr['prev']);
			lr['next']=document.createElement('a');lr['next'].className='next';lr['next'].href='#';m.appendChild(lr['next']);
		}
		lr['prev'].onclick=function(){return false};lr['next'].onclick=function(){return false};	
		this.add_event(lr['prev'],'click',function(){self.go('prev');return false});
		this.add_event(lr['next'],'click',function(){self.go('next');return false});
	}
	this.create_controls=function(){
		if(conf.controls===false)return false;
		if(ctrl.length!=lcnt){
			for(var i=0;i<ctrl.length;i++){
				ctrl[i].parentNode.removeChild(ctrl[i]);
			}
			ctrl=[];
			if(cdiv===false){
				if(conf.controls===true){
					cdiv=document.createElement('div');cdiv.className='controls';
					xxobj.appendChild(cdiv);
				} else {
					if(document.getElementById(conf.controls+'-1'))cdiv=true;
					else cdiv=document.getElementById(conf.controls);
				}
			}
			for(i=0;i<lcnt;i++){
				if(!(cdiv===true)){
					ctrl[i]=document.createElement('a');ctrl[i].href='#';
					cdiv.appendChild(ctrl[i]);
				} else ctrl[i]=document.getElementById(conf.controls+'-'+(i+1));
				ctrl[i].setAttribute('data-idx', i+1);
				ctrl[i].onclick=function(){return false};
				this.add_event(ctrl[i],'click',function(e){e=e||window.event;var o=this;if(e.srcElement)o=e.srcElement;self.go(o.getAttribute('data-idx'));return false});
			}
		}
		if(conf.labels)for(var i=0;i<ctrl.length;i++){
			if(labs[i]!=false) ctrl[i].innerHTML=labs[i];
			else ctrl[i].innerHTML=i+1;
		}
	}
	this.update=function(){
		for(var i=0;i<ctrl.length;i++){
			if(i==act)ctrl[i].className='active';
			else ctrl[i].className='';
		}
		if(typeof(lr.next)!='undefined'){
			var add={prev:'',next:''};
			if(conf.loop===false){
				if(act<1)add.prev=' blocked';
				if(act>lcnt-2)add.next=' blocked';
			}
			lr['next'].className='next'+add.next;
			lr['prev'].className='prev'+add.prev;
		}
		if(typeof(conf.callback)!='boolean'){conf.callback({curr: act+1, tot: lcnt, play: ply, labels: labs})}
	}
	this.mgo=function(d) {
		this.go(d);
	}
	this.go=function(d,a) {
		if(typeof(a)=='undefined')a=false;
		setTimeout(function(){self.xgo(d,a)},0);
	}
	this.xgo=function(d,auto){
		if(lk++>0){return false}
		if(typeof(auto)=='undefined')auto=false;
		if((!auto)&&(ply))this.stop();
		if(conf.loop===false)if(((d==='prev')&&(act<1))||((d==='next')&&(act>lcnt-2))){lk=0;return false}
		dst=act;
		if(d==='prev'){
			dst--;
			if((conf.loop==='semi')&&(dst<0))dst=lcnt-1;
		}else if(d==='next'){
			dst++;
			if((conf.loop==='semi')&&(dst>=lcnt))dst=0;
		}else{
			dst=parseInt(d)-1;
			if(dst<0)dst=0;
			if(dst>=lcnt)dst=lcnt-1;
		}
		if (dst==act){lk=0;return false}
		if(conf.loop===true)dstx=-(w*(dst+1));
		else dstx=-(w*dst);
		dltx=dstx-actx;
		if(hw&&(conf.mode=='scroll')){
			this.hw_mover(dltx,true);
		}else{
			dtm=new Date().getTime();
			if(conf.mode=='scroll')this.mover();
			else this.mover_fade(true);
		}
	}
	this.pos=function(){
		if(conf.mode=='scroll'){
			if(conf.loop===true)actx=-(w*(act+1));
			else actx=-(w*act);
			if(hw)this.hw_mover(actx,false);
			else obj.style.left=actx+'px';
		}else{
			for(var i=0;i<lcnt;i++){
				if(i==act){
					lobj[i].style.zIndex=0;
					this.alpha(lobj[i],1);
					lobj[i].style.display='block';
				}else lobj[i].style.display='none';
			}
		}
	}
	this.slide_end=function(){
		if(dst<0)dst=lcnt-1;if(dst>lcnt-1)dst=0;
		act=dst;
		this.pos();
		this.update();
		if(ply){this.stop();this.play()}
		obj.style.display='none';
		obj.style.display='block';
		lk=0;
	}
	this.mover_fade=function(first){
		if(first){lobj[act].style.zIndex=0;lobj[dst].style.zIndex=1;lobj[dst].style.display='block';dtm=new Date().getTime()}
		var dt=new Date().getTime()-dtm;
		if(dt>conf.speed)dt=conf.speed;if(dt<0)dt=0;
		if(dt>=conf.speed)x=1;else x=dt/conf.speed;
		this.alpha(lobj[act],1-x);
		this.alpha(lobj[dst],x);
		if(x<1){
			if(requestAnimationFrame){
				requestAnimationFrame(function(){self.mover_fade(false)});
			} else {
				tmr=setTimeout(function(){self.mover_fade(false)},16);
			}
		} else self.slide_end();
	}
	this.mover=function(){
		var x;
		var dt=conf.speed-(new Date().getTime()-dtm);
		if(dt>conf.speed)dt=conf.speed;if(dt<0)dt=0;
		var att=(Math.PI*(dt/conf.speed))+(Math.PI/2),dm=(Math.sin(att)+1)/2;
		if(dt==0)x=dstx;else x=parseInt(actx+(dltx*dm));
		if(dstx!=x){
			obj.style.left=x+"px";
			if(requestAnimationFrame){
				requestAnimationFrame(function(){self.mover});
			} else {
				tmr=setTimeout(function(){self.mover()},16);
			}
		} else {
			self.slide_end();
		}
	}
	this.hw_mover=function(x,trans){
		if(typeof(trans)=='undefined')trans=false;
		if(!trans){
			obj.style.webkitTransition=obj.style.mozTransition=obj.style.transition='';
			obj.style.webkitTransform=obj.style.mozTransform=obj.style.transform="translate3d(0,0,0)";
			obj.style.left=x+'px';
		}else{
			obj.style.webkitTransition=obj.style.mozTransition=obj.style.transition='all '+(conf.speed/1000)+'s '+conf.easing;
			obj.style.webkitTransform=obj.style.mozTransform=obj.style.transform="translate3d("+x+"px,0,0)";
		}
	}
	this.alpha=function(o,a){
		o.style.msFilter="progid:DXImageTransform.Microsoft.Alpha(Opacity="+(a*100)+")";
		o.style.filter="alpha(opacity="+(a*100)+")";
		o.style.mozOpacity=a;
		o.style.opacity=a;
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
		var g=document.getElementById(conf.id+'_lano');if(g)g.parentNode.removeChild(g);
		g=document.getElementById(conf.id+'_fino');if(g)g.parentNode.removeChild(g);
		var lano=lobj[lcnt-1].cloneNode(true);lano.setAttribute('id',conf.id+'_lano');
		var fino = lobj[0].cloneNode(true);fino.setAttribute('id',conf.id+'_fino');
		lobj[-1]=obj.insertBefore(lano,lobj[0])
		lobj[lcnt]=obj.appendChild(fino);
	}
	this.stop=function(){
		if(atmr)clearTimeout(atmr);atmr=false;
		ply=false;
	}
	this.play=function(){
		if((conf.auto==0)||(ply))return;
		ply=true;
		atmr=setTimeout(function(){self.go('next',true)},conf.auto*1000);
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
	this.appendDiv=function(id,clas,content){
		if(typeof(clas)=='undefined')clas='';
		if(typeof(id)=='undefined')id='';
		if(typeof(content)=='undefined')content='';
		var o=document.createElement('div');
		if(id)o.setAttribute('id',id);
		if(clas)o.className=clas;
		if(content)o.innerHTML=content;
		xxobj.appendChild(o);
	}
	this.init();
}

function THORIUM_TOUCH(obj,cabe) {
	var self=this,sx,sy,app=0,evt='';
	var supp=("ontouchstart" in document.documentElement);
	if(supp)if(navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/)) app=1;
	if(supp)obj.addEventListener('touchstart', function(e){self.tstart(e)}, false);

	this.tstart=function(e){
      sx=e.touches[0].pageX;sy=e.touches[0].pageY;
	  evt='';
      obj.addEventListener('touchmove', function(e){self.tmove(e)}, false);
      obj.addEventListener('touchend', function(e){self.tend(e)}, false);
	}
	this.tmove=function(e){
	  if(evt=='scroll')return;
      if(e.touches.length>1||e.scale&&e.scale!=1)return;
      var dx=e.touches[0].pageX - sx,dy=e.touches[0].pageY - sy;
      if (evt=='')if(Math.abs(dx)<Math.abs(dy))evt='scroll';
      if (evt!='scroll') {
        e.preventDefault();
        if(evt!='swipe'){
			if(Math.abs(dx)>30){
				evt='swipe';
				if(dx>0)cabe('prev');
				else cabe('next');
	        }	
	    }
      }
	}
	this.tend=function(e){
	  evt='';
      obj.removeEventListener('touchmove', function(e){self.tmove(e)}, false);
      obj.removeEventListener('touchend', function(e){self.tend(e)}, false);
	}
}
