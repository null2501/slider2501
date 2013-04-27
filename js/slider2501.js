function SLIDER2501(conf){
	var self=this,obj=false,uobj=false;lobj=[],xobj=false,w=0,h=0,sel=0,selx=0,te=false,dst=0,dstx=0,tmr=false,dtm=0,ply=false,atmr=false;

	if(typeof(conf['loop'])=='undefined')conf['loop']=false;
	if(typeof(conf['auto'])=='undefined')conf['auto']=0;

	this.init=function(){
		obj=document.getElementById(conf['id']);
		uobj=obj.getElementsByTagName("ul")[0];w=uobj.offsetWidth;h=uobj.offsetHeight;
		te=this.wte();
		lcnt=0;
		for(var i in uobj.childNodes)if(typeof uobj.childNodes[i].innerHTML!=='undefined'){
			lobj[lcnt++]=uobj.childNodes[i];
			if(uobj.childNodes[i].className.indexOf('selected')>-1)sel=lcnt-1;
			uobj.childNodes[i].style.width=w+'px';uobj.childNodes[i].style.display='block';
		}
		dst=sel;
		if(conf['loop']){
			uobj.style.width=((lcnt+2)*w+1)+'px';
			this.rem_clones();
			this.add_clones();
		} else uobj.style.width=(lcnt*w+1)+'px';
		this.pos();
		this.stop();
		this.play();
		if(te)uobj.addEventListener(te,function(){self.tcb()}, false);
	}
	this.pos=function(){
		if(conf['loop'])selx=-(w*(sel+1));
		else selx=-(w*sel);
		uobj.style.left=selx+'px';
	}
	this.rem_clones=function(){
		var g=document.getElementById(conf['id']+'_lano');if(g)g.parentNode.removeChild(g);
		g=document.getElementById(conf['id']+'_fino');if(g)g.parentNode.removeChild(g);
	}
	this.add_clones=function(){
		var lano=lobj[lcnt-1].cloneNode(true);lano.setAttribute('id',conf['id']+'_lano');
		var fino = lobj[0].cloneNode(true);fino.setAttribute('id',conf['id']+'_fino');
		lobj[-1]=uobj.insertBefore(lano,lobj[0])
		lobj[lcnt]=uobj.appendChild(fino);
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
	this.go=function(d,auto){
		if(dst!=sel)return;
		if(typeof(auto)=='undefined')auto=false;
		if((!auto)&&(ply))this.stop();
		dst=sel;
		if(d==='prev'){
			dst--;
			if((!conf['loop'])&&(dst<0))dst=lcnt-1;			
		}else if(d==='next'){
			dst++;
			if((!conf['loop'])&&(dst>=lcnt))dst=0;
		}else{
		}
		if (dst==sel)return false;
		if(conf['loop'])dstx=-(w*(dst+1));
		else dstx=-(w*dst);
		if(te){
			uobj.style.transition='left 0.5s';
			uobj.style.webkitTransition='left 0.5s';
			uobj.style.left=dstx+"px";
		} else {
			if(tmr)clearInterval(tmr);
			dtm=new Date().getTime();
			tmr=setInterval(function(){self.mover()},16);
		}
	}
	this.mover=function(){
		var dltx=selx-dstx;
		var dt=500-(new Date().getTime()-dtm);
		if(dt>500)dt=500;if(dt<0)dt=0;
		var att=(Math.PI*(dt/500))+(Math.PI/2),dm=(Math.sin(att)+1)/2;
		if(dt==0)x=dstx;else x=parseInt(selx-(dltx*dm));
		if(dstx!=x)uobj.style.left=x+"px";
		else {if(tmr)clearInterval(tmr);tmr=false;this.tcb()}
	}
	this.tcb=function(){
		uobj.style.transition='';uobj.style.webkitTransition='';
		if(dst<0)dst=lcnt-1;if(dst>lcnt-1)dst=0;
		sel=dst;
		this.pos();
		if(ply){this.stop();this.play()}
	}
	this.wte=function(){
		var t;
		var el = document.createElement('fakeelement');
		var transitions = {
		  'transition':'transitionend',
		  'OTransition':'oTransitionEnd',
		  'MozTransition':'transitionend',
		  'WebkitTransition':'webkitTransitionEnd'
		}
		for(t in transitions){
			if( el.style[t] !== undefined ){
				return transitions[t];
			}
		}
	}
	this.init();
}
