function showContent() {
    //Get the screen height
    var h = document.documentElement.clientHeight;
    window.scrollTo({top: h, behavior: 'smooth'});
}


async function showLoginModal(element) {
    await sleep(10);
    var modal = element.parentNode.querySelector(".login-box");
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

async function showRegisterModal(element) {
    await sleep(10);
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




var FDButtons = function(){
    this.activateInput = (inp) => {
        //Get the input tag
        var el = inp.querySelector(".fd-text-input__action");
        if(!el) {return new Error("Could not find element")}

        el.addEventListener("blur", (e)=>{
            if(e.target.value.trim().length > 0) {
                //Don't let the label fall back down
                el.closest(".fd-text-input").querySelector(".fd-text-input__title").style = `transform: translate(-0.8rem,-1.6rem); font-size: 1rem; line-height: 1.5rem; height: 1.5rem; opacity: 1;`; 
                return;
            }
            console.log("iasind")
            el.closest(".fd-text-input").querySelector(".fd-text-input__title").style = ``;
        })

    },
    this.textInput = (title)=> {
        var lab = document.createElement("label");
        lab.className = "fd-text-input";
    
        var inp = document.createElement("input");
        inp.type = "text";
        inp.className = "fd-text-input__action smooth-shadow";
    
        var sp = document.createElement("span");
        sp.className = "fd-text-input__title";

        if(title) {
            sp.innerHTML = title + '';
        }

        var indicator = document.createElement("div");
        indicator.className = "fd-text-input__indicator";

        lab.appendChild(inp);
        lab.appendChild(indicator);
        lab.appendChild(sp);

        return lab;
    }
}


window.onload = function() {
    const FDButts = new FDButtons();
    //Get all input elements and enable them
    var inputs = document.getElementsByClassName("fd-text-input");
    var x;

    for(x of inputs) {
        FDButts.activateInput(x);
    }

    enableClickListener();

}


var hideArray = [".login-box", ".register-box"];
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
}