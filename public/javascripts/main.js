function showContent() {
    //Get the screen height
    var h = document.documentElement.clientHeight;
    window.scrollTo({top: h, behavior: 'smooth'});
}