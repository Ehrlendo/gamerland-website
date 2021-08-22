const countDownTo = "13/07/2021&18:00"; //Count down to this date and time


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
    //countdownInit();
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
            console.log(res)


        } else if(this.status != 200 && this.readyState == 4) {
            console.log(this.responseText);
            updateServerStatus(res);
        }
    }


    //Register shortcut
    window.addEventListener("keydown", (e) => {
        if(e.key == "Delete") {
            //Open up the accept modal
            adminModal();
        }
    });

//Check if the user has visited the website recently
var lSt = JSON.parse(localStorage.getItem("godtatt-endring"));

if(!lSt) {
    //Create the acknowledge modal
    var modal = document.getElementById("acknowledge-modal");
    modal.style.display = "block";
}


}

function closeConsentModal() {
    localStorage.setItem("godtatt-endring", JSON.stringify(true));
    var modal = document.getElementById("acknowledge-modal");
    if(modal) {
        modal.parentNode.removeChild(modal);
    }
}

function delayConsentModal() {
    var modal = document.getElementById("acknowledge-modal");
    if(modal) {
        modal.parentNode.removeChild(modal);
    }
}


var isPushEnabled = false;

window.addEventListener('load', function() {
  var pushButton = document.querySelector('.js-push-button');
    setTimeout(()=>{
        subscribe();
    }, 500)

  // Check that service workers are supported, if so, progressively
  // enhance and add push messaging support, otherwise continue without it.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(initialiseState);
  } else {
    console.warn('Service workers aren\'t supported in this browser.');
  }
});




// Once the service worker is registered set the initial state
function initialiseState() {
  // Are Notifications supported in the service worker?
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    console.warn('Notifications aren\'t supported.');
    return;
  }

  // Check the current Notification permission.
  // If its denied, it's a permanent block until the
  // user changes the permission
  if (Notification.permission === 'denied') {
    console.warn('The user has blocked notifications.');
    return;
  }

  // Check if push messaging is supported
  if (!('PushManager' in window)) {
    console.warn('Push messaging isn\'t supported.');
    return;
  }

  // We need the service worker registration to check for a subscription
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    // Do we already have a push message subscription?
    serviceWorkerRegistration.pushManager.getSubscription()
      .then(function(subscription) {

        if (!subscription) {
          // We aren't subscribed to push, so set UI
          // to allow the user to enable push
          return;
        }

        // Keep your server in sync with the latest subscriptionId
        sendSubscriptionToServer(subscription);

      })
      .catch(function(err) {
        console.warn('Error during getSubscription()', err);
      });
  });
}


function adminModal() {
    var socket;
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

            modal.querySelector(".user-list").appendChild(el);
            
        }
    }
    function showServConsole(e) {
        socket = io();

        var handleCommandReturn = (message) => {
            if(!document.body.querySelector(".fp-modal > .server-console")) return;
            var el = document.createElement("div");
            el.className = "console-message";
            var par = document.body.querySelector(".fp-modal > .server-console > .console-body > .server-feedback");
            par.appendChild(el);
            el.innerHTML = message;
            document.querySelector("body > div.fp-modal > div.server-console > div > form > button").innerHTML = "Submit"
        }

        socket.on("minecraft-server-console",handleCommandReturn);


        var el = e.target;
        var buttons = el.closest(".page-buttons").children;
        
        var x;
        for(x of buttons) {
            x.classList.remove("outline");
            x.classList.remove("smooth-shadow");
            x.classList.add("white");
        }
    
        el.classList.add("outline");
        el.classList.add("smooth-shadow");
        el.classList.remove("white");
    
    
        var modal = document.body.querySelector(".fp-modal");
        if(modal.querySelector(".user-list")) {
            modal.querySelector(".user-list").style.display = "none";
        }
    
        var createConsole = ()=>{
            //Get the pass
            var pass = localStorage.getItem("pass");

            var cons = document.createElement("div");
            cons.className = "server-console";
            modal.appendChild(cons);

            var title = document.createElement("h1");
            title.innerHTML = "Gamerland 5 Server Console";
            cons.appendChild(title);
            
            var body = document.createElement("div");
            body.className = "console-body smooth-shadow"
            cons.appendChild(body)
        
        
            var feedB = document.createElement("div");
            feedB.className = "server-feedback";
            body.appendChild(feedB);
        
            var infoButt = document.createElement("button");
            infoButt.className = "smooth-shadow"
            var ico = document.createElement("i");
            ico.className = "material-icons";
            ico.innerHTML = "info";
            infoButt.appendChild(ico);
            feedB.appendChild(infoButt);

            var inpB = document.createElement("form");
            inpB.className = "input-form";
            body.appendChild(inpB);
        
            var field = document.createElement("input");
            inpB.appendChild(field);

            var subm = document.createElement("button");
            subm.className = "button fd-design";
            inpB.appendChild(subm);
            subm.innerHTML = "SUBMIT";
            
            var sendServCommand = (e)=>{
                e.preventDefault();
                var command = e.target.previousElementSibling.value.trim();
                e.target.previousElementSibling.value = ""; //Reset the text field, because du'uh
                if(command.length == 0) return;
                e.target.innerHTML = "Sending";

                socket.emit("minecraft-server-console", {key: pass,command:command});

/*
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "/consoleCommand");
                
                var form = new FormData();
                form.append("command", command);
                
                xhr.send(form);
                
                xhr.onreadystatechange = function() {
                    if(this.readyState == 4 && this.status == 200) {
                        //OK
                        e.target.innerHTML = "Submit";
                    } else {
                        e.target.innerHTML = "error";
                        console.log(this.status);
                    }
                }*/
            }
            
            subm.addEventListener("click", sendServCommand);

        }
    
        if(!modal.querySelector(".server-console")) {
            createConsole();
        } else {
            modal.querySelector(".server-console").style.display = "grid";
        }
    
    
    
    
    }
    
    function showApplicantList(e) {
        socket.off("minecraft-server-console");
        var el = e.target;
        var buttons = el.closest(".page-buttons").children;
        console.log(buttons);
        var x;
        for(x of buttons) {
            x.classList.remove("outline");
            x.classList.remove("smooth-shadow");
            x.classList.add("white");
        }
        
        el.classList.add("outline");
        el.classList.add("smooth-shadow");
        el.classList.remove("white");
    
        var modal = document.body.querySelector(".fp-modal");
        if(modal.querySelector(".server-console")) {
            modal.querySelector(".server-console").style.display = "none";
        }
    
        createApplicantList();
    
    }


    var createApplicantList = ()=>{

        var list;

        if(!modal.querySelector(".user-list")) {
            list = document.createElement("div");
            list.className = "user-list";
            modal.appendChild(list);
        } else {
            list = modal.querySelector(".user-list");
        }

        list.style.display = "block";

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
                //Yes
                if(this.status == 204) {
                    //No content
                    modal.querySelector(".user-list").innerHTML = "No users have applied, or all applications have been processed";
                }
            }
        }
    }


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
                //save the password in localstorage

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
            var pass = inp.value;
            xhr.send(formData);

            xhr.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                    //Successful
                    localStorage.setItem("pass", pass);
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

        createApplicantList();

        //Create the page buttons
        var buttonsCont = document.createElement("div");
        buttonsCont.className = "page-buttons";
        modal.appendChild(buttonsCont);

        var console = document.createElement("button");
        console.className = "button fd-design white";
        console.innerHTML = "Server Console";
        buttonsCont.appendChild(console);
        console.addEventListener("click", showServConsole);


        var apL = document.createElement("button");
        apL.className = "button fd-design outline smooth-shadow";
        apL.innerHTML = "Application list";
        buttonsCont.appendChild(apL);        
        apL.addEventListener("click", showApplicantList);



    }




    var submitUserChanges = (e) => {
        //Submit the user list changes
        var list = document.querySelector("body > div.fp-modal > .user-list").children;

        var acceptedList = [];
        var rejectedList = [];

        var y;
        console.log(list)
        for(y of list) {
            if(y.classList.contains("accepted") && !y.classList.contains("rejected")) {
                //Add to the accepted list
                console.log(y);
                var obj = {usrname:y.querySelector(".mcusrname").innerHTML,dcname:y.querySelector(".dcusrname").innerHTML,id:y.querySelector(".id").innerHTML}
                acceptedList.push(obj);
            } else if(y.classList.contains("rejected") && !y.classList.contains("accepted")) {
                var obj = {usrname:y.querySelector(".mcusrname").innerHTML,dcname:y.querySelector(".dcusrname").innerHTML,id:y.querySelector(".id").innerHTML}
                rejectedList.push(obj);
            }
        }
        console.log(acceptedList,rejectedList)
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


                //Fix user roles in discord
                var secret = localStorage.getItem("pass");
                giveAcceptedUsersRoles(acceptedList, secret);

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
                        y.parentNode.removeChild(y);
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

function giveAcceptedUsersRoles(users, secret) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://mc.gamerland.no:4000/users/roles/add");
    //xhr.setRequestHeader("Content-Type", "multipart/form-data");
    if(secret.trim().length == 0 || users.length == 0) return;

    var formData = new FormData();
    formData.append("users", JSON.stringify(users))
    formData.append("secret", secret);

    xhr.send(formData);
    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            //OK

        }  else if(this.readyState == 4 && this.status != 200) {
            //NOT OK

        }
    }
}


function enableClickListener() {
    var hideArray = [".login-box:not(.mobile)", ".register-box"];
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
    var par = document.querySelector("#top > div > div.body > ul");
    
    var online = data?true:false;
    if(!data) {
        //Set the status
        par.querySelector(".is-online").innerHTML = "offline";
        par.querySelector(".players").innerHTML = "N/A";
        par.querySelector(".is-online").classList.add("offline");
        par.querySelector(".is-online").classList.remove("online");
        return;
    };
    var ping = data.roundTripLatency;  
    var players = data.onlinePlayers;

    par.querySelector(".is-online").innerHTML = "online";
    par.querySelector(".is-online").classList.add("online");
    par.querySelector(".is-online").classList.remove("offline");

    //par.querySelector(".ping").innerHTML = ping + "ms";

    var plural = players==1?"spiller":"spillere";
    par.querySelector(".players").innerHTML = players + " " + plural + " på";    
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
        x.style.backgroundColor = "#A4B9C4";
    }
    //Change the borders of the button that has been clicked
    el.style.borderRadius = "1rem 0 0 1rem";
    el.style.backgroundColor = "#CEDBE2";
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
    if(!document.querySelector("#white-box > button").classList.contains("content-shown")) {
        document.querySelector("#white-box > button").classList.add("content-shown");
    }
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

    var sources = ["curseforge", "mods", "map", "datapacks"]
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

function toggleFastenButton(el) {
    el.classList.toggle("fastened");
    if(el.classList.contains("fastened")) {
        el.children[0].innerHTML = "lock";
        el.children[1].innerHTML = "Løsne fanen";
    } else {
        el.children[0].innerHTML = "lock_open";
        el.children[1].innerHTML = "Fest fanen";
    }
}

/*
//COUNTDOWN TIMER CODE
function countdownInit() {
    //Check if the countdown is finished or not
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var hr = date.getHours();
    var min = date.getMinutes();


    var splitDate = countDownTo.split("&")[0].split("/");
    
    var Tday = parseInt(splitDate[0]);
    var Tmonth = parseInt(splitDate[1]);
    var Tyear = parseInt(splitDate[2]);

    var splitTime = countDownTo.split("&")[1].split(":");

    var Thr = parseInt(splitTime[0]);
    var Tmin = parseInt(splitTime[1]);

    //Create the future date object
    var future = new Date();
    future.setDate(Tday);
    future.setMonth(Tmonth-1);
    future.setFullYear(Tyear);
    future.setHours(Thr);
    future.setMinutes(Tmin);
    future.setSeconds(0);
    //The time parameters matches
    var timer = document.body.querySelector("#countdown-timer");
    var ctdwn;
    if(!timer.hasChildNodes()) {
        ctdwn = document.createElement("p");
        ctdwn.className = "countdown"
        timer.appendChild(ctdwn);
    } else {
        ctdwn = timer.querySelector(".countdown");
    }

    setInterval(()=>{
        var date = new Date();
        if(future >= date) {
            //Not yet!
            //get seconds between times
            var delta = Math.abs(future - date) / 1000;
            
            // calculate (and subtract) whole days
            var days = Math.floor(delta / 86400);
            delta -= days * 86400;

            // calculate (and subtract) whole hours
            var hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;

            // calculate (and subtract) whole minutes
            var minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;

            // what's left is seconds
            var seconds = Math.round(delta % 60);

            var dString = days==1?"dag":"dager";
            var hrString = hours==1?"time":"timer";
            ctdwn.innerHTML = hours + " " + hrString + " " + minutes + " min og " + seconds + " sek til åpning";
        } else if(future < date) {
            var secAgo = (date - future)/1000;
            if(secAgo < 172800) {
                //Add the animation
                animateTitle(ctdwn);
                ctdwn.innerHTML = "Serveren er nå åpen! Registrer deg for å få tilgang"

            } else {
                //Two days have passed since opening
                if(document.querySelector("#countdown-timer > p")) {
                    var el = document.querySelector("#countdown-timer > p");
                    el.parentNode.removeChild(el);
                }
            }
            
        }
    }, 1000)
}

var transitionRunning = false;
function animateTitle(el) {
    if(el.style.animation != "animateLaunchTitle 1300ms cubic-bezier(0.07, 0.19, 0.15, 1.47) 100ms" && !transitionRunning) {
        transitionRunning = true;
        el.style.color = "white";
        setTimeout(()=>{
            el.style.animation = "none";
            el.style.color = "var(--color-two)";
            el.style.animation = "animateLaunchTitle 1300ms cubic-bezier(0.07, 0.19, 0.15, 1.47) 100ms";
        }, 300);
    }
}*/