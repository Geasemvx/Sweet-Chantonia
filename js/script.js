const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');
const facebook = document.getElementById('facebook');
const tiktok = document.getElementById('tiktok');
const username = document.getElementById('username');
const password = document.getElementById('password');



if(bar){
    bar.addEventListener('click', ()=> {
        nav.classList.add('active');
    }
    )
}
if (close){
    close.addEventListener('click', ()=>{
        nav.classList.remove('active');
    })
}

if (facebook) { facebook.addEventListener('click', () => { window.open('https://www.facebook.com/profile.php?id=61582877626540'); }); }
if (tiktok) { tiktok.addEventListener('click', () => { window.open('https://www.tiktok.com/@chantiey040'); }); }
