/* Auto-play videos: when a page opens, its film starts by itself, muted (browsers only allow
   autoplay when muted). The native controls stay on so the visitor can pause, seek or turn the sound on.
   If a browser still blocks autoplay, the big play button comes back as a fallback. */
(function(){
  var wraps=document.querySelectorAll(".vwrap");
  [].forEach.call(wraps,function(w){
    var v=w.querySelector("video"),b=w.querySelector(".vplay");
    if(!v)return;
    function start(){
      if(!v.getAttribute("src")){v.src=v.getAttribute("data-src");}
      v.muted=true; v.defaultMuted=true; v.setAttribute("muted","");
      v.controls=true;
      if(b)b.hidden=true;
      var p=v.play();
      if(p&&p.catch){p.catch(function(){ if(b)b.hidden=false; v.controls=false; });}
    }
    if(b)b.addEventListener("click",start);
    start();
  });
})();
