const btn = document.querySelector('.btn-call');
const modal = document.getElementById('sModal');
const closeBtn = document.querySelector('.modal__btn_close');

btn.addEventListener('click', function(){
    modal.style.display = 'block';
    document.body.classList.add('_lock');
});

closeBtn.addEventListener('click', function(){
    modal.style.display = 'none';
    document.body.classList.remove('_lock');
});

window.onclick = function(e) {
    if (e.target == modal) {
      modal.style.display = "none";
      document.body.classList.remove('_lock');
    }
  }