// Let the visitor choose when sound starts; never play two scores together.
document.querySelectorAll('.wedding-films video').forEach(video=>{
 video.addEventListener('play',()=>{
  document.querySelectorAll('.wedding-films video').forEach(other=>{if(other!==video)other.pause();});
 });
});
