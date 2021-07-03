const minWidthToTriggerMobile = 980;

(()=>{
    setInterval(()=>{
        //Get website size
        var width = document.documentElement.clientWidth || window.innerWidth;
        var height = document.documentElement.clientHeight || window.innerHeight;
        
        if(width < minWidthToTriggerMobile) {
            //Show mobile view instead
            if(!document.body.classList.contains("mobile")) {
                document.body.classList.add("mobile");
            }
        } else {
            if(document.body.classList.contains("mobile")) {
                document.body.classList.remove("mobile");
            }
        }
    }, 100);
})();
function showContent() {
    //Get the screen height
    var h = document.documentElement.clientHeight;
    window.scrollTo({top: h, behavior: 'smooth'});
}

function toggleHeader() {
    var header = document.getElementById("header").querySelector(".right").getElementsByClassName("header-button");
    var top = document.getElementById("header");

    if(top.display == undefined) {
        top.display = false;
    }
    console.log(top.display);

    if(!top.display) {
        var x;
        for(x of header) {
            x.style.display = "none";
        }
        top.display = true;
    } else {
        var x;
        for(x of header) {
            x.style.display = "inline-block";
        }
        top.display = false;
    }
}

async function showLoginModal(element) {
    await sleep(10);
    var showConditions = {showMobile: false}
    
    //Get website size
    var width = document.documentElement.clientWidth || window.innerWidth;
    var height = document.documentElement.clientHeight || window.innerHeight;
    
    if(width < minWidthToTriggerMobile) {
        //Show mobile view instead
        showConditions.showMobile = true;
    } else {
        showConditions.showMobile = false;
    }

    var removeModal = function(event) {
        var modal = event.target;
        toggleHeader();
        modal.parentNode.removeChild(modal);

        //Hide the menu
        var menu = document.getElementsByClassName("login-box")[0] || document.getElementsByClassName("register-box")[0];
        if(menu) {
            menu.style.display = "none";
            menu.show = false;
        }
    }

    if(showConditions.showMobile) {
        toggleHeader();
        var modal = element.parentNode.querySelector(".login-box");
        modal.classList.add("mobile");

        var shade = document.createElement("div");
        shade.className = "fullpage-modal-shade";
        document.body.appendChild(shade);
        shade.addEventListener("click", removeModal);

    } else {
        var modal = element.parentNode.querySelector(".login-box");
        modal.classList.remove("mobile");
    }


    var modal = element.parentNode.querySelector(".login-box");
    if(modal.show == undefined) {
        modal.show = true;
        modal.style.display = "";
        return;
    }

    if(modal.show) {
        modal.style.display = "none";
        modal.show = false;
    } else {
        modal.style.display = "";
        modal.show = true;
    
    }
}

async function showRegisterModal(element) {
    await sleep(10);
    var showConditions = {showMobile: false}
    
    //Get website size
    var width = document.documentElement.clientWidth || window.innerWidth;
    var height = document.documentElement.clientHeight || window.innerHeight;

    if(width < minWidthToTriggerMobile) {
        //Show mobile view instead
        showConditions.showMobile = true;
    } else {
        showConditions.showMobile = false;
    }

    var removeModal = function(event) {
        var modal = event.target;
        toggleHeader();
        modal.parentNode.removeChild(modal);

        //Hide the menu
    var menu = document.getElementsByClassName("login-box")[0] || document.getElementsByClassName("register-box")[0];
        if(menu) {
            menu.style.display = "none";
            menu.show = false;
        }
    }

    if(showConditions.showMobile) {
        toggleHeader();
        var modal = element.parentNode.querySelector(".register-box");
        modal.classList.add("mobile");
        
        var shade = document.createElement("div");
        shade.className = "fullpage-modal-shade";
        document.body.appendChild(shade);
        shade.addEventListener("click", removeModal);

    } else {
        var modal = document.body.querySelector(".register-box");
        modal.classList.remove("mobile");
    }


    var modal = element.parentNode.querySelector(".register-box");
    if(modal.show == undefined) {
        modal.show = true;
        modal.style.display = "block";
        return;
    }

    if(modal.show) {
        modal.style.display = "none";
        modal.show = false;
    } else {
        modal.style.display = "block";
        modal.show = true;
    
    }
}

function sleep(interval) {
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve();
        },interval)
    })
}





window.onload = function() {

    var modal = document.body.querySelector(".login-box");
    modal.style.display = "none";

    const FDButts = new FDButtons();
    //Get all input elements and enable them
    var inputs = document.getElementsByClassName("fd-text-input");
    var x;

    for(x of inputs) {
        FDButts.activateInput(x);
    }

    enableClickListener();


    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/mc/server/status");
    xhr.send();

    xhr.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            var res = JSON.parse(this.responseText);
            updateServerStatus(res);



        } else if(this.status != 200 && this.readyState == 4) {
            console.log(this.responseText);
        }
    }
}


var hideArray = [".login-box:not(.mobile)", ".register-box"];
function enableClickListener() {
    document.addEventListener("click", function(e) {
        var target = e.target;

        
        //Hide the elements to hide
        var x;
        for(x of hideArray) {
            var el = document.querySelector(x);
            if(el instanceof HTMLElement) {   
                if(!el.contains(target)) {
                    el.style.display = "none";
                    el.show = false;
                }
            }

        }
    })
}


function signInClient(e) {
    e.preventDefault();
}

function registerUser(e) {
    e.preventDefault();

    var form = e.target.parentNode;
    var inps = form.getElementsByTagName("label");

    var name = inps[0].querySelector(".fd-text-input__action").value;
    var disc = inps[1].querySelector(".fd-text-input__action").value;
    
    if(name.trim().length < 5 || name.trim().length < 5 && disc.trim().length < 3) {
        e.target.innerHTML = "Begge feltene kan ikke være tomme";
        return;
    }

    e.target.innerHTML = "Laster"
    e.target.disabled = true;
    setTimeout(()=>{
        e.target.innerHTML = "Prøv igjen senere"
        e.target.disabled = false;
}, 1000)
}


function updateServerStatus(data) {
    return;
    console.log(data)
    var online = data.onlinePlayers;
    var host = data.host;
    if(host) {
        var el = document.getElementsByClassName("server-online")[0];
        el.innerHTML = "Serveren er på";
    } else {
        var el = document.getElementsByClassName("server-online")[0];
        el.innerHTML = "Serveren er av";
    }

    if(online == null) {
        var el = document.getElementsByClassName("players-online")[0];
        el.innerHTML = "Kunne ikke laste inn"
    } else {
        
        var el = document.getElementsByClassName("players-online")[0];
        var player = "Spiller";
        if(online > 1 || online == 0) {
            player = "Spillere";
        } 
        el.innerHTML = online + " " + player + " online";
    }
}

function closeRegisterBox(el) {
    var sB = el.closest(".register-box");
    sB.style.display = "none";
    sB.show = false;
}



function showCardContents(el) {
    var bts = el.parentNode.getElementsByClassName("action-button");
    var x;
    for(x of bts) {
        x.style.borderRadius = "1rem";
        x.style.backgroundColor = "#adadad";
    }
    //Change the borders of the button that has been clicked
    el.style.borderRadius = "1rem 0 0 1rem";
    el.style.backgroundColor = "#d3d3d3";
    var type;
    //Return the button index (type)
    for(let i = 0; i < bts.length; i++) {
        if(el.getAttribute("name") == bts[i].getAttribute("name")) {
            type = i;
        }
    }
    showBoxContents(type);
    setRibbonPos(type);
}

function showBoxContents(type) {
    var wr = document.querySelector("#white-box > div.wrapper > div.card-content-wrapper");
    if(!wr.querySelector(".box")) {
        //There is no beautiful box, create one
        var box = document.createElement("div");
        box.className = "box";
        wr.appendChild(box);

        //Set the appropriate animation
        switch(type) {
            case 0:
                box.style.animation = "s-c-b-1 500ms cubic-bezier(0.33, 0.01, 0.17, 1.01) 80ms both";
            break;
            case 1:
                box.style.animation = "s-c-b-2 500ms cubic-bezier(0.33, 0.01, 0.17, 1.01) 80ms both";
            break;
            case 2:
                box.style.animation = "s-c-b-3 500ms cubic-bezier(0.33, 0.01, 0.17, 1.01) 80ms both";
            break;
            case 3:
                box.style.animation = "s-c-b-4 500ms cubic-bezier(0.33, 0.01, 0.17, 1.01) 80ms both";
            break;
        }


        //Hide the placeholder image
        var img = document.querySelector("#white-box > div.image-display");
        img.style.opacity = "0";

        //Add the iframe for content displaying
        var iframe = document.createElement("iframe");
        iframe.className = "interchangable-content";
        box.appendChild(iframe);
    } else {
        var box = wr.querySelector(".box");
        var iframe = box.querySelector(".interchangable-content");
        iframe.style.animation = "fade-in 400ms ease-in-out";
        setTimeout(()=>{
            iframe.style.animation = "none";
        }, 400)   
    }

    var box = wr.querySelector(".box");
    var iframe = box.querySelector(".interchangable-content");
    if(type == 0) {
        box.style.borderRadius = "0 1rem 1rem 1rem";
    } else {
        box.style.borderRadius = "1rem";
    }

    var sources = ["curseforge", "mods", "map", "voicechat"]
    iframe.src="/" + sources[type];



}

function setRibbonPos(pos) {
    var ribbon = document.querySelector("#white-box > div.wrapper > div.connector-ribbon");
    if(!ribbon.classList.contains("activated")) {
        ribbon.classList.add("activated");
    }
    var top = ribbon.children[0];
    var middle = ribbon.children[1];
    var bottom = ribbon.children[2];

    var values = [
        {top:0,bottom:"calc(100% - 7rem)"},
        {top:"7.8rem",bottom: "calc(100% - 7.8rem - 7rem)"},
        {top:"calc(7.8rem * 2)",bottom: "calc(100% - (7.8rem*2) - 7rem)"},
        {top:"calc(7.8rem * 3)", bottom: "calc(100% - (7.8rem*3) - 7rem)"}
    ];

    top.style.height = values[pos].top;
    bottom.style.height = values[pos].bottom;
}


function showModal() {
    var modalBkg = document.createElement("div");
    modalBkg.className = "fp-modal-bkg";
    document.body.appendChild(modalBkg);
    modalBkg.addEventListener("click", (e)=>{
        document.body.querySelector(".fp-modal").kill();
    })

    var modal = document.createElement("div");
    modal.className = "fp-modal";
    modal.background = modalBkg;
    document.body.appendChild(modal);

    //Define the modal kill function
    modal.kill = ()=>{
        var bkg = document.querySelector(".fp-modal-bkg");
        bkg.parentNode.removeChild(bkg);
        modal.parentNode.removeChild(modal);
    }

    return modal;
}