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

    //var modal = document.body.querySelector(".login-box");
    //modal.style.display = "none";

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


    //Register shortcut
    window.addEventListener("keydown", (e) => {
        if(e.key == "Delete") {
            //Open up the accept modal
            adminModal();
        }
    })

}

function adminModal() {
    var modal;
    if(!document.body.querySelector(".fp-modal")) {
        var modal = showModal();
    } else {
        document.body.querySelector(".fp-modal").kill();
        return;
    }

    //Show loading message
    var p = document.createElement("h1");
    p.style = `
        color: black;
        position: absolute;
        width: 100%;
        text-align: center;
        top: 50%;
        transform: translateY(-50%);
        animation: fade-in 100ms ease-in-out both 0.5s;
        margin: 0;
    `
    p.innerHTML = "Checking credentials..";
    modal.appendChild(p);


    //Check if the user is already authenticated
    setTimeout(()=>{
        
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/adminAuth");
        xhr.send();
        xhr.onreadystatechange = function() {
            if(this.status == 200 && this.readyState == 4) {
                //User authenticated! Great!
                p.parentNode.removeChild(p);
                showAdminPage(modal);
            } else if(this.status != 200 && this.readyState == 4) {
                //Not already authenticated, ask for authentication
                p.parentNode.removeChild(p);
                showLogin();
            }
        }
        
    }, 1000)


    var showLogin = () => {

        var title = document.createElement("h1");
        var wr = document.createElement("div");
        modal.appendChild(wr);
        title.innerHTML = "Admin Tools Sign-In";
        wr.appendChild(title);

        var form = document.createElement("form");
        wr.appendChild(form);

        var pswrd = document.createElement("label");
        pswrd.className = "fd-text-input";

        var inp = document.createElement("input");
        inp.type = "password";
        inp.className = "fd-text-input__action";
        var ind = document.createElement("div");
        ind.className = "fd-text-input__indicator";

        var lab = document.createElement("span");
        lab.className = "fd-text-input__title";
        lab.innerHTML = "Passord";

        pswrd.appendChild(inp);
        pswrd.appendChild(ind);
        pswrd.appendChild(lab);

        const FDButts = new FDButtons();

        FDButts.activateInput(pswrd);

        form.appendChild(pswrd);

        var button = document.createElement("button");
        button.innerHTML = "Logg inn";
        button.className = "smooth-shadow button fd-design rounded important";
        button.style = `
            display: block;
            margin-top: 1rem;
            width: 10rem;
        `
        form.appendChild(button);

        button.addEventListener("click", (e) => {
            e.preventDefault();

            if(inp.value.trim().length == 0) return;

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/adminAuth");
            
            var formData = new FormData();
            formData.append("password", inp.value);

            xhr.send(formData);

            xhr.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                    //Successful
                    e.target.style.transition = "all 150ms ease-in-out";
                    e.target.style.width = "13rem";
                    e.target.style.color = "rgba(255,255,255,0)";
                    setTimeout(()=>{
                        e.target.innerHTML = "Velkommen inn"
                        e.target.style.color = "rgba(255,255,255,1)";     
                        
                        setTimeout(()=>{
                            showAdminPage(modal);
                        }, 500)
                        
                    }, 150);
                    



                } else if(this.readyState == 4 && this.status != 200) {
                    //Error
                    alert(this.status + ", " + this.statusText);
                }
            }
        })
    }

    var showAdminPage = (modal)=>{
        modal.innerHTML = "";

        var list = document.createElement("div");
        list.className = "user-list";
        modal.appendChild(list);


        //Fetch the user list

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/applyList");
        xhr.send();
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                //OK
                //Populate the list
                var listData = JSON.parse(this.responseText);

                var acceptChanges = document.createElement("button");
                acceptChanges.className = "button fd-design white smooth-shadow";
                acceptChanges.innerHTML = "Apply";
                acceptChanges.style = `
                    position: absolute;
                    bottom: 1rem;
                    right: 1rem;
                `;

                acceptChanges.addEventListener("click", submitUserChanges);

                modal.appendChild(acceptChanges);

                populateList(listData);

            } else if(this.readyState == 4 && this.status != 200) {
                //ERROR
                console.log(this.responseText)
                if(this.status == 204) {
                    //No content
                    modal.innerHTML = "No users have applied, or all applications have been processed";
                }
            }
        }

        function handleUserAction(e) {

            var el = e.target.closest(".button");

            if(el.innerHTML.toLowerCase() != "accept" && el.innerHTML.toLowerCase() != "reject") {
                //Reset the button
                el.style.height = "2rem";
                el.closest(".user-entry").classList.remove("rejected");
                el.closest(".user-entry").classList.remove("accepted");
                if(el.classList.contains("accept")) {
                    el.innerHTML = "Accept";
                    return;
                } else {
                    el.innerHTML = "Reject";
                    return;
                }
            }

            var action = el.innerHTML.toLowerCase().trim()=='accept' ? true : false;
            //If true: accept user, otherwise reject
            if(action) {
                //Reset the reject button
                el.nextElementSibling.innerHTML = "Reject";
                el.nextElementSibling.style.height = "2rem";

                el.closest(".user-entry").classList.add("accepted");
                el.closest(".user-entry").classList.remove("rejected");

            } else if(action == false) {
                el.previousElementSibling.innerHTML = "Accept";
                el.previousElementSibling.style.height = "2rem";

                
                el.closest(".user-entry").classList.add("rejected");
                el.closest(".user-entry").classList.remove("accepted");
            }

            var ico = document.createElement("i");
            ico.style.animation = "slide-in-bottom 200ms ease-in-out";
            ico.innerHTML = "check";
            ico.className = "material-icons";
            el.innerHTML = "";
            el.appendChild(ico);
            el.style.height = "2.8rem";

        }

        var populateList = function(listData) {
            if(listData.length < 1) return;
            var x;
            for(x of listData) {

                var el = document.createElement("div");
                el.className = "user-entry";
                
                var tWr = document.createElement("div");
                tWr.className = "text-wrapper";

                var title = document.createElement("p");
                title.innerHTML = x.username;
                title.className = "mcusrname"

                var dc = document.createElement("p");
                dc.innerHTML = x.dcname;
                dc.className = "dcusrname"

                var id = document.createElement("p");
                id.innerHTML = x.id;
                id.className = "id"

                var wr = document.createElement("div");
                wr.className = "buttons-wrapper";

                var acc = document.createElement("button");
                acc.innerHTML = "Accept"
                acc.className = "button fd-design smooth-shadow white accept";
                acc.addEventListener("click", handleUserAction)


                var rej = document.createElement("button");
                rej.innerHTML = "Reject";
                rej.className = "button fd-design outline reject";
                rej.addEventListener("click", handleUserAction)


                tWr.appendChild(title);
                tWr.appendChild(dc);
                tWr.appendChild(id);

                el.appendChild(tWr);
                el.appendChild(wr);

                wr.appendChild(acc);
                wr.appendChild(rej);

                list.appendChild(el);
            }
        }
    }

    var submitUserChanges = (e) => {
        //Submit the user list changes
        var list = document.querySelector("body > div.fp-modal > div").children;

        var acceptedList = [];
        var rejectedList = [];

        var x;
        for(x of list) {
            if(x.classList.contains("accepted") && !x.classList.contains("rejected")) {
                //Add to the accepted list
                console.log(x);
                var obj = {usrname:x.querySelector(".mcusrname").innerHTML,dcname:x.querySelector(".dcusrname").innerHTML,id:x.querySelector(".id").innerHTML}
                acceptedList.push(obj);
            } else if(x.classList.contains("rejected") && !x.classList.contains("accepted")) {
                var obj = {usrname:x.querySelector(".mcusrname").innerHTML,dcname:x.querySelector(".dcusrname").innerHTML,id:x.querySelector(".id").innerHTML}
                rejectedList.push(obj);
            }
        }
        if(acceptedList.length == 0 && rejectedList.length == 0) return;
        e.target.innerHTML = "SENDING";


        //send this list to the server
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/updateUserList");
        
        var formData = new FormData();
        formData.append("accepted", JSON.stringify(acceptedList));
        formData.append("rejected", JSON.stringify(rejectedList));

        xhr.send(formData);

        xhr.onreadystatechange = function() {
            if(this.status == 200 && this.readyState == 4) {
                //OK
                e.target.innerHTML = "Submitted";
                setTimeout(()=>{
                    if(e.target instanceof HTMLElement) {
                        e.target.innerHTML = "Submit";
                    }
                }, 2000);

                //Remove the users that have been processed
                var acc = modal.getElementsByClassName("accepted");
                var rej = modal.getElementsByClassName("rejected");

                var x;
                for(x of acc) {
                    x.style.animation = "fade-out 200ms ease-in-out both";
                    setTimeout(()=>{
                        x.parentNode.removeChild(x);
                    }, 200);
                }

                var y;
                for(y of rej) {
                    y.style.animation = "fade-out 200ms ease-in-out both";
                    setTimeout(()=>{
                        x.parentNode.removeChild(y);
                    }, 200);
                }


            } else if(this.status != 200 && this.readyState == 4) {
                //ERROR
                e.target.innerHTML = "Error";
                setTimeout(()=>{
                    if(e.target instanceof HTMLElement) {
                        e.target.innerHTML = "Submit";
                    }
                }, 2000);
            }

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

    var submButt = e.target;

    submButt.innerHTML = "Laster"
    submButt.disabled = true;


    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/register");
    //xhr.setRequestHeader("content-type", "multipart/form-data");

    var formData = new FormData();
    formData.append("usrName", name + '');
    formData.append("discord", disc + '');

    xhr.send(formData);
    xhr.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            //OK
            submButt.innerHTML = "Du er nå registrert"
            submButt.disabled = true;
        } else if(this.status != 200 && this.readyState == 4) {
            //ERROR
            submButt.innerHTML = "Noe gikk galt";
            submButt.disabled = false;
        }
    }
/*
    setTimeout(()=>{
        submButt.innerHTML = "Prøv igjen senere"
        submButt.disabled = false;
}, 1000)
*/
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